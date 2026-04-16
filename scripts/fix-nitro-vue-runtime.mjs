import { cp, mkdir, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const currentFile = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(currentFile), '..')
const outputRoot = path.join(rootDir, '.output', 'server')
const outputNodeModulesDir = path.join(outputRoot, 'node_modules')
const outputChunksDir = path.join(outputRoot, 'chunks')
const require = createRequire(import.meta.url)

async function exists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

async function findPackageRoot(startPath, expectedName) {
  let currentDir = path.dirname(startPath)

  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json')

    if (await exists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))

        if (!expectedName || packageJson.name === expectedName) {
          return currentDir
        }
      } catch {
        // Ignore invalid package manifests and keep walking upward.
      }
    }

    const parentDir = path.dirname(currentDir)

    if (parentDir === currentDir) {
      return null
    }

    currentDir = parentDir
  }
}

async function collectBundleFiles(currentPath) {
  const entries = await readdir(currentPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...await collectBundleFiles(entryPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.mjs')) {
      files.push(entryPath)
    }
  }

  return files
}

async function readJson(targetPath) {
  return JSON.parse(await readFile(targetPath, 'utf8'))
}

async function copyDirectoryContents(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true })

  const entries = await readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)

    await cp(sourcePath, targetPath, { force: true, recursive: true })
  }
}

function collectPackageImports(source) {
  const matches = source.matchAll(/(?:from\s+|import\()\s*['"]([^'"]+)['"]/g)
  const specifiers = new Set()

  for (const match of matches) {
    const specifier = match[1]

    if (!specifier || specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) {
      continue
    }

    specifiers.add(specifier)
  }

  return [...specifiers]
}

function splitPackageSpecifier(specifier) {
  const segments = specifier.split('/')

  if (specifier.startsWith('@')) {
    const packageName = segments.slice(0, 2).join('/')
    return {
      packageName,
      subpath: segments.slice(2).join('/')
    }
  }

  return {
    packageName: segments[0],
    subpath: segments.slice(1).join('/')
  }
}

async function main() {
  if (!(await exists(outputChunksDir))) {
    console.warn('[postbuild] Nitro chunks not found in .output, skipping runtime fix.')
    return
  }

  const outputPackageJson = await readJson(path.join(outputRoot, 'package.json'))
  const alignedPackages = Object.keys(outputPackageJson.dependencies)
    .filter(packageName => packageName === 'vue' || packageName.startsWith('@vue/'))
    .sort()

  const aligned = []
  const bundleFiles = await collectBundleFiles(outputChunksDir)
  const runtimeImports = new Set()

  for (const packageName of alignedPackages) {
    let sourcePackageDir
    let targetPackageDir

    try {
      sourcePackageDir = await findPackageRoot(require.resolve(packageName), packageName)
      targetPackageDir = path.join(outputNodeModulesDir, packageName)
    } catch {
      continue
    }

    if (!sourcePackageDir || !(await exists(targetPackageDir))) {
      continue
    }

    const sourcePackageJsonPath = path.join(sourcePackageDir, 'package.json')
    const targetPackageJsonPath = path.join(targetPackageDir, 'package.json')

    if (!(await exists(sourcePackageJsonPath)) || !(await exists(targetPackageJsonPath))) {
      continue
    }

    const sourceVersion = (await readJson(sourcePackageJsonPath)).version
    const targetVersion = (await readJson(targetPackageJsonPath)).version

    if (sourceVersion === targetVersion) {
      continue
    }

    await copyDirectoryContents(sourcePackageDir, targetPackageDir)
    aligned.push(`${packageName} ${targetVersion} -> ${sourceVersion}`)
  }

  for (const bundleFile of bundleFiles) {
    const source = await readFile(bundleFile, 'utf8')

    for (const specifier of collectPackageImports(source)) {
      runtimeImports.add(specifier)
    }
  }

  const repaired = []

  for (const specifier of runtimeImports) {
    const { packageName, subpath } = splitPackageSpecifier(specifier)

    if (!subpath) {
      continue
    }

    let sourcePackageDir
    let sourceResolvedPath

    try {
      sourceResolvedPath = require.resolve(specifier)
      sourcePackageDir = await findPackageRoot(sourceResolvedPath, packageName)
    } catch {
      continue
    }

    if (!sourcePackageDir) {
      continue
    }

    const relativeResolvedPath = path.relative(sourcePackageDir, sourceResolvedPath)

    if (relativeResolvedPath.startsWith('..')) {
      continue
    }

    const targetResolvedPath = path.join(outputNodeModulesDir, packageName, relativeResolvedPath)

    if (await exists(targetResolvedPath)) {
      continue
    }

    const sourceSubdir = path.dirname(sourceResolvedPath)
    const targetSubdir = path.dirname(targetResolvedPath)

    await copyDirectoryContents(sourceSubdir, targetSubdir)
    repaired.push(`${specifier} -> ${relativeResolvedPath}`)
  }

  if (repaired.length === 0) {
    if (aligned.length === 0) {
      console.log('[postbuild] Nitro runtime exports already complete.')
      return
    }

    console.log('[postbuild] Aligned Nitro Vue packages:')

    for (const item of aligned) {
      console.log(`  - ${item}`)
    }

    return
  }

  if (aligned.length > 0) {
    console.log('[postbuild] Aligned Nitro Vue packages:')

    for (const item of aligned) {
      console.log(`  - ${item}`)
    }
  }

  console.log('[postbuild] Repaired Nitro runtime exports:')

  for (const item of repaired) {
    console.log(`  - ${item}`)
  }
}

await main()
