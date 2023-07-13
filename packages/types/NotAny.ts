/** Not `any` */
export type NotAny<T = unknown> = any extends T ? never : T
