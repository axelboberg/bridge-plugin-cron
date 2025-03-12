const fs = require('node:fs')
const path = require('node:path')

const RELEASE_DIR_PATH = path.join(__dirname, '../release')
async function reCreateReleaseDirectory () {
  try {
    await fs.promises.rm(RELEASE_DIR_PATH, { recursive: true, force: true })
  } catch (_) {}
  return fs.promises.mkdir(RELEASE_DIR_PATH)
}

function removeObjKeys (obj, keysToRemove) {
  const out = {}
  for (const key of Object.keys(obj)) {
    if (keysToRemove.includes(key)) {
      continue
    }
    out[key] = obj[key]
  }
  return out
}

async function copyManifest () {
  const manifest = require('../package.json')
  const cleaned = removeObjKeys(manifest, [
    'scripts',
    'dependencies',
    'devDependencies'
  ])
  await fs.promises.writeFile(path.join(RELEASE_DIR_PATH, 'package.json'), JSON.stringify(cleaned))
}

;(async function () {
  await reCreateReleaseDirectory()
  console.log('✅ Created release directory')
  await copyManifest()
  console.log('✅ Copied manifest')
})()