/* eslint-disable unicorn/prevent-abbreviations */
import { execute } from '@unshared/process/execute'

export interface OpensslReqOptions {
  /**
   * This specifies the input format. The DER option uses an ASN1 DER encoded
   * form compatible with the PKCS#10. The PEM form is the default format: it
   * consists of the DER format base64 encoded with additional header and footer lines.
   */
  inform?: 'DER' | 'PEM'
  /**
   * This specifies the output format, the options have the same meaning and default
   * as the -inform option.
   */
  outform?: 'DER' | 'PEM'
  /**
   * This specifies the input file. If not specified the standard input is used.
   * The input file must be in the format specified by the -inform option.
   */
  in?: string
}

/**
 * PKCS#10 certificate request and certificate generating utility
 *
 * @param options The options to use.
 * @returns A promise that resolves with the certificate signing request.
 */
export async function opensslReq(options: OpensslReqOptions = {}): Promise<string> {
  const args = []

  for (const key in options) {
    // @ts-expect-error: Ignore.
    const value = options[key]
    args.push(`-${key}`, value)
  }

  return spawnAsync('openssl', args, 'utf8')
}

