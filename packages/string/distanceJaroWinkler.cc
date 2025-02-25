#include <v8.h>
#include <node.h>
#include <algorithm>
#include <cmath>
#include <vector>
#include <cstring>
using namespace v8;

// --- Throws a V8 TypeError on the given isolate with a message.
inline void ThrowTypeError(Isolate* isolate, const char* msg) {
  Local<String> str = String::NewFromUtf8(isolate, msg).ToLocalChecked();
  isolate->ThrowException(Exception::TypeError(str));
}

// --- Computes the Jaro-Winkler distance between two UTF-16 strings.
// --- a: pointer to first string, lenA: its length.
// --- b: pointer to second string, lenB: its length.
static double DistanceJaroWinkler(const uint16_t* a, size_t lenA, const uint16_t* b, size_t lenB) {
  // --- If strings are identical, return full similarity.
  if (lenA == lenB && std::memcmp(a, b, lenA * sizeof(uint16_t)) == 0)
    return 1.0;

  // --- Allowed matching distance.
  size_t maxLen = (lenA > lenB) ? lenA : lenB;
  size_t maxDistance = (maxLen >> 1) - 1;

  size_t matches = 0;
  size_t transpositions = 0;

  // --- Use stack arrays for small strings.
  if (lenA <= 256 && lenB <= 256) {
    unsigned char aMatch[256] = {0};
    unsigned char bMatch[256] = {0};
    for (size_t i = 0; i < lenA; ++i) {
      size_t start = (i >= maxDistance) ? i - maxDistance : 0;
      size_t end = ((i + maxDistance + 1) < lenB) ? i + maxDistance + 1 : lenB;
      for (size_t j = start; j < end; ++j) {
        if (!bMatch[j] && a[i] == b[j]) {
          aMatch[i] = 1;
          bMatch[j] = 1;
          ++matches;
          break;
        }
      }
    }
    if (matches == 0)
      return 0.0;
    size_t j = 0;
    for (size_t i = 0; i < lenA; ++i) {
      if (!aMatch[i])
        continue;
      while (j < lenB && !bMatch[j])
        ++j;
      if (j < lenB && a[i] != b[j])
        ++transpositions;
      ++j;
    }
  } else {
    // --- Use vectors for large strings.
    std::vector<unsigned char> aMatch(lenA, 0);
    std::vector<unsigned char> bMatch(lenB, 0);
    for (size_t i = 0; i < lenA; ++i) {
      size_t start = (i >= maxDistance) ? i - maxDistance : 0;
      size_t end = ((i + maxDistance + 1) < lenB) ?
                   i + maxDistance + 1 : lenB;
      for (size_t j = start; j < end; ++j) {
        if (!bMatch[j] && a[i] == b[j]) {
          aMatch[i] = 1;
          bMatch[j] = 1;
          ++matches;
          break;
        }
      }
    }
    if (matches == 0)
      return 0.0;
    size_t j = 0;
    for (size_t i = 0; i < lenA; ++i) {
      if (!aMatch[i])
        continue;
      while (j < lenB && !bMatch[j])
        ++j;
      if (j < lenB && a[i] != b[j])
        ++transpositions;
      ++j;
    }
  }
  // --- Compute Jaro similarity.
  double m = static_cast<double>(matches);
  double t = static_cast<double>(transpositions) / 2.0;
  double jaro = ((m / lenA) + (m / lenB) +
                 ((m - t) / m)) / 3.0;
  // --- Compute common prefix length (max 4).
  size_t prefix = 0;
  size_t prefLimit = (lenA < lenB ? lenA : lenB);
  if (prefLimit > 4)
    prefLimit = 4;
  for (size_t i = 0; i < prefLimit; ++i) {
    if (a[i] == b[i])
      ++prefix;
    else
      break;
  }
  // --- Apply Winkler boost.
  double jaroWinkler = jaro + (prefix * 0.1 * (1.0 - jaro));
  return jaroWinkler;
}

// --- Node.js wrapper for the Jaro-Winkler distance.
// --- Accepts two strings and returns the similarity score.
void DistanceJaroWinklerWrapper(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // --- Validate arguments.
  if (args.Length() < 2 || !args[0]->IsString() || !args[1]->IsString()) {
    ThrowTypeError(isolate, "Expected two strings as arguments");
    return;
  }
  // --- Convert V8 strings to UTF-16.
  v8::String::Value strA(isolate, args[0]);
  v8::String::Value strB(isolate, args[1]);
  double result = DistanceJaroWinkler(
    reinterpret_cast<const uint16_t*>(*strA), strA.length(),
    reinterpret_cast<const uint16_t*>(*strB), strB.length()
  );
  args.GetReturnValue().Set(Number::New(isolate, result));
}

// --- Module initialization: exposes the distance function.
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "DistanceJaroWinkler", DistanceJaroWinklerWrapper);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
