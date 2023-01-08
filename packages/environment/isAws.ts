/**
 * Check if process is running on AWS Lambda
 * @returns `true` if process is running on AWS Lambda
 */
export const isAws = async() => {
  const { access } = await import('node:fs/promises')
  try { await access('/etc/aws_profile'); return true }
  catch { return false }
}
