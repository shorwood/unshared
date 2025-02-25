#include <v8.h>
#include <node.h>
#include <vector>
#include <unordered_map>
#include <cmath>

using namespace v8;

// Fast-path for one-byte strings: uses a fixed 256-element frequency table.
static double entropyShannonASCII(const uint8_t* data, int length) {
  uint32_t freq[256] = {0};
  for (int i = 0; i < length; i++) {
    freq[data[i]]++;
  }
  double entropy = 0.0;
  for (int i = 0; i < 256; i++) {
    if (freq[i]) {
      double p = static_cast<double>(freq[i]) / length;
      entropy -= p * std::log2(p);
    }
  }
  return entropy;
}

// Optimized entropy computation for UTF-16 strings.
// If all characters fall in the BMP and the string is large, a fixed frequency
// array is used; otherwise, unordered_map is used with proper surrogate pair decoding.
static double entropyShannonOptimized(const uint16_t* data, int length) {
  bool allBMP = true;
  // Check if any surrogate pair exists.
  for (int i = 0; i < length; i++) {
    uint16_t c = data[i];
    if (c >= 0xD800 && c <= 0xDBFF) { // high surrogate detected
      if ((i + 1) < length) {
        uint16_t next = data[i + 1];
        if (next >= 0xDC00 && next <= 0xDFFF) {
          allBMP = false;
          break;
        }
      }
    }
  }

  if (allBMP && length >= 128) {
    // For large BMP-only strings, use a fixed frequency table.
    std::vector<uint32_t> freqs(0x10000, 0);
    for (int i = 0; i < length; i++) {
      freqs[data[i]]++;
    }
    double entropy = 0.0;
    for (uint32_t count : freqs) {
      if (count) {
        double p = static_cast<double>(count) / length;
        entropy -= p * std::log2(p);
      }
    }
    return entropy;
  } else {
    // Fallback: use unordered_map with surrogate pair decoding.
    std::unordered_map<uint32_t, uint32_t> freq;
    freq.reserve(static_cast<size_t>(length));
    uint32_t totalCodePoints = 0;
    for (int i = 0; i < length; i++) {
      uint32_t codePoint = data[i];
      // Decode surrogate pairs if present.
      if (codePoint >= 0xD800 && codePoint <= 0xDBFF && (i + 1) < length) {
        uint16_t next = data[i + 1];
        if (next >= 0xDC00 && next <= 0xDFFF) {
          codePoint = 0x10000 + (((codePoint - 0xD800) << 10) | (next - 0xDC00));
          i++;
        }
      }
      freq[codePoint]++;
      totalCodePoints++;
    }
    double entropy = 0.0;
    for (const auto &entry : freq) {
      double p = static_cast<double>(entry.second) / totalCodePoints;
      entropy -= p * std::log2(p);
    }
    return entropy;
  }
}

/*
 * Wrapper for the entropyShannon function with extra performance optimizations:
 *
 * 1. Fast one-byte path: if the underlying string is stored in one-byte (Latin1) form,
 *    a stack buffer is used for small strings (<=1024) or a vector for larger ones.
 * 2. For UTF-16 strings, the code detects if all characters are in the BMP.
 *    If so, a fixed frequency array is built for large strings; otherwise, surrogate pairs
 *    are decoded properly with an unordered_map.
 *
 * NOTE: The v8::String::WriteOneByte function now requires the Isolate* as its first argument.
 */
void EntropyShannonOptimizedWrapper(const v8::FunctionCallbackInfo<v8::Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  // Validate that the first argument is a string.
  if (args.Length() < 1 || !args[0]->IsString()) {
    Local<String> errMsg =
        String::NewFromUtf8(isolate, "Expected a string as first argument",
                            NewStringType::kNormal)
            .ToLocalChecked();
    isolate->ThrowException(Exception::TypeError(errMsg));
    return;
  }

  Local<String> inputStr = args[0]->ToString(context).ToLocalChecked();
  if (inputStr->Length() == 0) {
    args.GetReturnValue().Set(Number::New(isolate, 0.0));
    return;
  }

  double result = 0.0;
  if (inputStr->IsOneByte()) {
    int len = inputStr->Length();
    // Use a fixed-size stack buffer for small one-byte strings.
    if (len <= 1024) {
      uint8_t buffer[1024];
      inputStr->WriteOneByte(isolate, buffer, 0, len, v8::String::NO_NULL_TERMINATION);
      result = entropyShannonASCII(buffer, len);
    } else {
      // For larger one-byte strings, allocate a vector.
      std::vector<uint8_t> buffer(len);
      inputStr->WriteOneByte(isolate, buffer.data(), 0, len, v8::String::NO_NULL_TERMINATION);
      result = entropyShannonASCII(buffer.data(), len);
    }
  } else {
    // For UTF-16 strings, obtain underlying 16-bit data.
    String::Value strValue(isolate, inputStr);
    int len = strValue.length();
    const uint16_t* data = reinterpret_cast<const uint16_t*>(*strValue);
    result = entropyShannonOptimized(data, len);
  }

  args.GetReturnValue().Set(Number::New(isolate, result));
}

// Module initialization: register the "entropyShannon" method.
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "entropyShannon", EntropyShannonOptimizedWrapper);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
