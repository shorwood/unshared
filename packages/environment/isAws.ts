import { access } from 'node:fs/promises'

/**
 * Check if process is running on AWS Lambda by checking for the existence of
 * `/etc/aws_profile`. This file is created by the AWS Lambda runtime.
 *
 * @returns `true` if process is running on AWS Lambda.
 */
export async function isAws() {
  try {
    await access('/etc/aws_profile'); return true
  }
  catch {
    return false
  }
}
