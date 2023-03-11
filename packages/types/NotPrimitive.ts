import { Primitive } from "./Primitive";

/** Not a primitive */

export type NotPrimitive<U = unknown> = U extends Primitive ? never : U;
