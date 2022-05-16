import { hashCyrb53 } from './hashCyrb53'
import { hashJenkins } from './hashJenkins'

/**
 * Hash a buffer or string and return it's base64 representation.
 * @param data String or buffer to hash.
 * @param algorithm Hashing algorithm
 */
export const hash = (data: string | ArrayBuffer, algorithm = 'jenkins' as string) => {
  // --- Strigify data.
  data = typeof data !== 'string'
    ? Buffer.from(data).toString()
    : data

  if (algorithm === 'cybr53') return hashCyrb53(data)
  if (algorithm === 'jenkins') return hashJenkins(data.toString())
}
