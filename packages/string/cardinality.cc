#include <v8.h>
#include <node.h>

using namespace v8;

// Uses the NewStringType in NewFromUtf8 to enable built-in V8 optimizations.
void ThrowTypeError(Isolate* isolate, const char* message) {
  Local<String> string = String::NewFromUtf8(isolate, message, NewStringType::kNormal).ToLocalChecked();
  Local<Value> exception = Exception::TypeError(string);
  isolate->ThrowException(exception);
}

/*
 * Structure for cardinality options. The caller may override these via the
 * options object, otherwise defaults are used.
 */
struct CardinalityOptions_t {
  uint32_t Lower;    // Cardinality for lower case letters
  uint32_t Upper;    // Cardinality for upper case letters
  uint32_t Digit;    // Cardinality for digits
  uint32_t ASCII;    // Cardinality for ASCII characters
  uint32_t Unicode;  // Cardinality for Unicode characters
};

/*
 * Optimized Cardinality function:
 * - Uses inline character comparisons instead of library calls like islower, isupper, isdigit.
 * - Performs early exit if all five type flags are detected.
 * - Iterates via pointer arithmetic for minimal overhead.
 */
static int Cardinality(const uint8_t* str, int len, const CardinalityOptions_t* opts) {
  uint32_t types = 0;
  const uint32_t ALL_TYPES = 31; // 1 | 2 | 4 | 8 | 16 (i.e. all flags detected)
  
  // Loop through the string using pointer arithmetic
  while (len--) {
    uint8_t c = *str++;
    if (c == 0) break; // stop on null character

    // Inline range checks for performance.
    if (c >= 'a' && c <= 'z') types |= 1; // lower
    else if (c >= 'A' && c <= 'Z') types |= 2; // upper
    else if (c >= '0' && c <= '9') types |= 4; // digit
    else if (c <= 0x7F) types |= 8; // ASCII
    else types |= 16; // Unicode

    // Break early if all type flags are already set.
    if (types == ALL_TYPES) break;
  }
  
  // Sum up the contributions from the detected character types.
  return ((types & 1) ? opts->Lower : 0) +
         ((types & 2) ? opts->Upper : 0) +
         ((types & 4) ? opts->Digit : 0) +
         ((types & 8) ? opts->ASCII : 0) +
         ((types & 16) ? opts->Unicode : 0);
}

/*
 * Wrapper for the Cardinality function:
 * - Minimizes redundant string conversions by storing the converted V8 string.
 * - Uses direct property retrieval (instead of two-step HasOwnProperty then Get)
 *   to update default options from the passed options object.
 */
void CardinalityWrapper(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  // Validate that at least one argument is provided and is a string.
  if (args.Length() < 1 || !args[0]->IsString()) {
    ThrowTypeError(isolate, "Expected a string as the first argument");
    return;
  }

  // Convert the first argument only once.
  Local<String> inputStr = args[0]->ToString(context).ToLocalChecked();
  if (inputStr->Length() == 0) {
    args.GetReturnValue().Set(Uint32::NewFromUnsigned(isolate, 0));
    return;
  }

  // Set default options.
  CardinalityOptions_t options = {
    .Lower = 26,
    .Upper = 26,
    .Digit = 10,
    .ASCII = 33,
    .Unicode = 100
  };

  // --- Parse and override the defaults if an options object is provided.
  if (args.Length() >= 2 && args[1]->IsObject()) {
    Local<Object> optionsObj = args[1].As<Object>();

    // --- Create keys once to avoid redundant string construction.
    Local<String> lowerKey = String::NewFromUtf8(isolate, "lower", NewStringType::kNormal).ToLocalChecked();
    Local<String> upperKey = String::NewFromUtf8(isolate, "upper", NewStringType::kNormal).ToLocalChecked();
    Local<String> digitKey = String::NewFromUtf8(isolate, "digit", NewStringType::kNormal).ToLocalChecked();
    Local<String> asciiKey = String::NewFromUtf8(isolate, "ascii", NewStringType::kNormal).ToLocalChecked();
    Local<String> unicodeKey = String::NewFromUtf8(isolate, "unicode", NewStringType::kNormal).ToLocalChecked();

    // --- Direct retrieval of each property and check for undefined.
    Local<Value> lowerVal;
    if (optionsObj->Get(context, lowerKey).ToLocal(&lowerVal) && !lowerVal->IsUndefined()) {
      options.Lower = lowerVal->Uint32Value(context).ToChecked();
    }

    Local<Value> upperVal;
    if (optionsObj->Get(context, upperKey).ToLocal(&upperVal) && !upperVal->IsUndefined()) {
      options.Upper = upperVal->Uint32Value(context).ToChecked();
    }

    Local<Value> digitVal;
    if (optionsObj->Get(context, digitKey).ToLocal(&digitVal) && !digitVal->IsUndefined()) {
      options.Digit = digitVal->Uint32Value(context).ToChecked();
    }

    Local<Value> asciiVal;
    if (optionsObj->Get(context, asciiKey).ToLocal(&asciiVal) && !asciiVal->IsUndefined()) {
      options.ASCII = asciiVal->Uint32Value(context).ToChecked();
    }

    Local<Value> unicodeVal;
    if (optionsObj->Get(context, unicodeKey).ToLocal(&unicodeVal) && !unicodeVal->IsUndefined()) {
      options.Unicode = unicodeVal->Uint32Value(context).ToChecked();
    }
  }

  // Convert the input string to a UTF-8 encoded C string.
  String::Utf8Value utf8Str(isolate, inputStr);
  int result = Cardinality(reinterpret_cast<const uint8_t*>(*utf8Str), utf8Str.length(), &options);

  // Return the result as an unsigned integer.
  args.GetReturnValue().Set(Uint32::NewFromUnsigned(isolate, result));
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "Cardinality", CardinalityWrapper);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
