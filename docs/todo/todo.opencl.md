# OpenCL

```ts
/**
 * Run a kernel on the GPU. This is a low-level function that is not
 * intended to be used directly. Instead, use the `@kernel` decorator.
 *
 * @param kernel The kernel code to run written in [OpenCL](https://www.khronos.org/opencl/).
 * @param args The arguments to pass to the kernel.
 * @param options The options to pass to the kernel.
 */
export function openClRunKernel(kernel: string, args: any[], options: KernelOptions = {}): unknown
export function openClCreateKernel(kernel: string, options: KernelOptions): Kernel
```

```c
/**
 * Matrix multiplication.
 */
kernel void matmul(
  global const float* a,
  global const float* b,
  global float* c,
  const int n
) {
  int i = get_global_id(0);
  int j = get_global_id(1);
  float sum = 0;
  for (int k = 0; k < n; k++) {
    sum += a[i * n + k] * b[k * n + j];
  }
  c[i * n + j] = sum;
}
```

```ts
const kernel = await readFile('matmul.cl', 'utf8')
const result = runKernel(kernel, [a, b, c, n], {
  globalWorkSize: [n, n],
  localWorkSize: [16, 16],
}) // result is a Float32Array
```
