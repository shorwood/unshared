# OpenGL

```ts
/**
 * Run a kernel on the GPU. This is a low-level function that is not
 * intended to be used directly. Instead, use the `@kernel` decorator.
 *
 * @param kernel
 * @param args
 * @param options
 */
export function runKernel(kernel: string, args: any[], options: KernelOptions = {}): unknown
export function createKernel(kernel: string, options: KernelOptions): Kernel
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

```shader
#version 330 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
```

### Example

```ts
// main.ts
import { createWindow } from '@unshared/opengl'

const window = createWindow({
  width: 800,
  height: 600,
  title: 'Hello, OpenGL!',
})

window.addEventListener('load', () => {
  console.log('Window loaded!')
})