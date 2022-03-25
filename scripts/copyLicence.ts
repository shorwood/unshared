import { copyFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// --- Compute paths.
const root = resolve(__dirname, '../')
const distPath = resolve(root, 'dist')
const distPackages = readdirSync(distPath)

// --- Get root licence path.
const licencePath = resolve(__dirname, 'LICENSE')

for (const distPackage in distPackages)
  copyFileSync(licencePath, distPackage)
