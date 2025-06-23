import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'useiife',
            fileName: 'index',
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
        rollupOptions: {
            external: ['svelte'],
            output: {
                globals: {
                    svelte: 'Svelte',
                },
            },
        },
    },
    plugins: [dts({ rollupTypes: true })]
})