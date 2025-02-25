#include <node.h>
#include <v8.h>
#include <vector>
#include <cstdint>
#include <cstring>
#include <algorithm>
using namespace v8;

// --- Throws a V8 TypeError on the given isolate with a message.
inline void ThrowTypeError(Isolate* isolate, const char* message) {
  Local<String> str = String::NewFromUtf8(isolate, message).ToLocalChecked();
  isolate->ThrowException(Exception::TypeError(str));
}

// --- Returns true if all UTF-16 code units are below 256.
static bool canUseBitParallel(const uint16_t* pat, size_t lenPat,
                              const uint16_t* txt, size_t lenTxt) {
  for (size_t i = 0; i < lenPat; ++i)
    if (pat[i] >= 256) return false;
  for (size_t i = 0; i < lenTxt; ++i)
    if (txt[i] >= 256) return false;
  return true;
}

// --- Computes Levenshtein distance using a bit-parallel algorithm.
// --- Assumes all code units are less than 256.
static int DistanceLevenshteinBitParallel(
  const uint16_t* pat,
  size_t lenPat,
  const uint16_t* txt,
  size_t lenTxt
) {
  
  uint64_t PM[256] = {0};
  uint64_t VP = ~0ULL, VN = 0ULL;

  // --- Build bit mask for each pattern character. Here is
  // --- the trick: we use a 64-bit integer to store the mask
  // --- for each character. This allows us to perform bitwise
  // --- operations on the entire mask in a single instruction.
  for (size_t i = 0; i < lenPat; ++i)
    PM[pat[i]] |= (1ULL << i);

  int score = static_cast<int>(lenPat);
  const uint64_t mask = 1ULL << (lenPat - 1);
  for (size_t i = 0; i < lenTxt; ++i) {
    uint64_t X = PM[txt[i]] | VN;
    uint64_t D = (((X & VP) + VP) ^ VP) | X;
    uint64_t HP = VN | ~(D | VP);
    uint64_t HN = D & VP;

    // --- Update score based on highest bit.
    score += (HP & mask) ? 1 : ((HN & mask) ? -1 : 0);
    uint64_t shiftedHP = (HP << 1) | 1;
    VN = shiftedHP & HN;
    VP = (HN << 1) | ~(shiftedHP | D);
  }
  return score;
}

// --- Computes the Levenshtein distance between two UTF-16 strings.
// --- Trims common prefixes/suffixes and selects an algorithm.
static int DistanceLevenshtein(const uint16_t* a, size_t lenA,
                               const uint16_t* b, size_t lenB) {
  // --- Fast check for equality.
  if (lenA == lenB &&
      std::memcmp(a, b, lenA * sizeof(uint16_t)) == 0)
    return 0;

  // --- Trim common prefix. When both characters are equal,
  // --- we can safely skip them and reduce the problem size.
  while (lenA && lenB && a[0] == b[0]) {
    a++;
    b++;
    lenA--;
    lenB--;
  }

  // --- Trim common suffix. When last characters are equal,
  // --- we can safely reduce the problem size.
  while (lenA && lenB && a[lenA - 1] == b[lenB - 1]) {
    lenA--;
    lenB--;
  }

  if (lenA == 0) return static_cast<int>(lenB);
  if (lenB == 0) return static_cast<int>(lenA);

  // --- Use bit-parallel method if length <= 64 and valid.
  if (std::min(lenA, lenB) <= 64 && canUseBitParallel(a, lenA, b, lenB)) {
    return (lenA <= lenB)
      ? DistanceLevenshteinBitParallel(a, lenA, b, lenB)
      : DistanceLevenshteinBitParallel(b, lenB, a, lenA);
  }

  // --- For DP, use the shorter string as the horizontal axis.
  const uint16_t* ptrA = a;
  const uint16_t* ptrB = b;
  size_t m = lenA, n = lenB;
  if (m > n) {
    std::swap(ptrA, ptrB);
    std::swap(m, n);
  }
  int result = 0;
  // --- Use stack allocation if m is small.
  if (m < 256) {
    int d[256];
    for (size_t j = 0; j <= m; ++j)
      d[j] = static_cast<int>(j);
    for (size_t i = 1; i <= n; ++i) {
      int prev = d[0];
      d[0] = static_cast<int>(i);
      for (size_t j = 1; j <= m; ++j) {
        int cost = (ptrA[j - 1] == ptrB[i - 1]) ? 0 : 1;
        int ins = d[j - 1] + 1;
        int del = d[j] + 1;
        int sub = prev + cost;
        int cell = (ins < del) ? ins : del;
        cell = (cell < sub) ? cell : sub;
        prev = d[j];
        d[j] = cell;
      }
    }
    result = d[m];
  } else {
    std::vector<int> d(m + 1);
    for (size_t j = 0; j <= m; ++j)
      d[j] = static_cast<int>(j);
    for (size_t i = 1; i <= n; ++i) {
      int prev = d[0];
      d[0] = static_cast<int>(i);
      for (size_t j = 1; j <= m; ++j) {
        int cost = (ptrA[j - 1] == ptrB[i - 1]) ? 0 : 1;
        int ins = d[j - 1] + 1;
        int del = d[j] + 1;
        int sub = prev + cost;
        int cell = (ins < del) ? ins : del;
        cell = (cell < sub) ? cell : sub;
        prev = d[j];
        d[j] = cell;
      }
    }
    result = d[m];
  }
  return result;
}

// --- Node.js binding wrapper for Levenshtein distance.
// --- Accepts two string arguments and returns the distance.
void DistanceLevenshteinWrapper(
    const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  // --- Validate arguments.
  if (args.Length() < 2 ||
      !args[0]->IsString() || !args[1]->IsString()) {
    ThrowTypeError(isolate, "Expected two strings as arguments");
    return;
  }

  // --- Convert V8 strings to UTF-16.
  v8::String::Value strA(isolate, args[0]);
  v8::String::Value strB(isolate, args[1]);
  size_t lenA = strA.length();
  size_t lenB = strB.length();

  // --- Return early if either string is empty.
  if (lenA == 0) {
    args.GetReturnValue().Set(Int32::New(isolate, static_cast<int>(lenB)));
    return;
  }
  if (lenB == 0) {
    args.GetReturnValue().Set(Int32::New(isolate, static_cast<int>(lenA)));
    return;
  }

  // --- Compute distance using UTF-16 code units.
  int result = DistanceLevenshtein(
    reinterpret_cast<const uint16_t*>(*strA), lenA,
    reinterpret_cast<const uint16_t*>(*strB), lenB
  );
    
  args.GetReturnValue().Set(Int32::New(isolate, result));
}

// --- Initializes the module and exposes the distance function.
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "DistanceLevenshtein",
                  DistanceLevenshteinWrapper);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
