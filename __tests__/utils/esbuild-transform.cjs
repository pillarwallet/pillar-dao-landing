const path = require('path')
const esbuild = require('esbuild')

const loaders = {
  '.js': 'jsx',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

const esmPackages = ['connectkit', 'wagmi', '@wagmi', 'viem', '@tanstack', 'zustand']

module.exports = {
  process(src, filename) {
    const normalizedFilename = filename.replace(/\\/g, '/')
    const isNodeModule = normalizedFilename.includes('/node_modules/')
    const shouldProcessNodeModule = esmPackages.some(pkg =>
      normalizedFilename.includes(`/node_modules/${pkg}`)
    )

    if (isNodeModule && !shouldProcessNodeModule) {
      return src
    }

    const ext = path.extname(filename)
    const loader = loaders[ext] || 'jsx'
    const envVars = Object.assign(
      {
        MODE: 'test',
        DEV: false,
        PROD: false,
        SSR: false,
      },
      Object.fromEntries(
        Object.entries(process.env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [key, value ?? ''])
      )
    )

    const result = esbuild.transformSync(src, {
      loader,
      format: 'cjs',
      target: 'es2019',
      sourcemap: 'inline',
      sourcefile: filename,
      jsx: 'automatic',
      jsxImportSource: 'react',
      define: {
        'import.meta.env': JSON.stringify(envVars),
      },
    })

    return { code: result.code, map: result.map || null }
  },
}
