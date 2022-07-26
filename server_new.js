import { green, cyan, bold } from 'colorette'
const path = require('path')
const fs = require('fs')
const http = require('http')
const handler = require('serve-handler')
const metablock = require('rollup-plugin-userscript-metablock')

const pkg = require('./package.json')
const meta = require('./meta.json')

console.log('👀 watch & serve 🤲\n###################\n')

const port = pkg.config.port
const destDir = 'dist/'
const devScriptInFile = 'dev.user.js'

const hyperlink = (url, title) =>
  `\u001B]8;;${url}\u0007${title || url}\u001B]8;;\u0007`

fs.mkdir('dist/', { recursive: true }, () => null)

// Start web server
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: destDir,
  })
})
server.listen(port, () => {
  console.log(`Running webserver at ${hyperlink(`http://localhost:${port}`)}`)
})

// Create the userscript for development 'dist/dev.user.js'
const devScriptOutFile = path.join(destDir, devScriptInFile)
console.log(
  cyan(
    `generate development userscript ${bold('package.json')}, ${bold(
      'meta.json'
    )}, ${bold(devScriptInFile)} → ${bold(devScriptOutFile)}...`
  )
)
const devScriptContent = fs
  .readFileSync(devScriptInFile, 'utf8')
  .replace(/%PORT%/gm, port.toString())
const grants = 'grant' in meta ? meta.grant : []
if (grants.indexOf('GM.xmlHttpRequest') === -1) {
  grants.push('GM.xmlHttpRequest')
}
if (grants.indexOf('GM.setValue') === -1) {
  grants.push('GM.setValue')
}
if (grants.indexOf('GM.getValue') === -1) {
  grants.push('GM.getValue')
}
const override = {
  name: pkg.name + ' [dev]',
  version: pkg.version,
  description: pkg.description,
  homepage: pkg.homepage,
  author: pkg.author,
  license: pkg.license,
  grant: grants,
}
if ('connect' in meta) {
  override.connect = meta.connect
  override.connect.push('localhost')
}
const devMetablock = metablock({
  file: './meta.json',
  override: override,
})

const result = devMetablock.renderChunk(devScriptContent, null, {
  sourcemap: false,
})
const outContent = typeof result === 'string' ? result : result.code
fs.writeFileSync(devScriptOutFile, outContent)
console.log(
  green(`created ${bold(devScriptOutFile)}. Please install in Tampermonkey: `) +
    hyperlink(`http://localhost:${port}/${devScriptInFile}`)
)
