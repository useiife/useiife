import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
    if (mode == 'vue') {
        return {
            build: {
                outDir: 'dist/vue',
                lib: {
                    entry: resolve(__dirname, 'src/vue.ts'),
                    name: 'useiife',
                    fileName: "index",
                    formats: ['es', 'cjs', 'umd', 'iife'],
                },
                rollupOptions: {
                    external: ['vue'],
                    output: {
                        globals: {
                            vue: 'Vue',
                        },
                    },
                },
            },
        }
    } else if (mode == 'react') {
        return {
            build: {
                outDir: 'dist/react',
                lib: {
                    entry: resolve(__dirname, 'src/react.ts'),
                    name: 'useiife',
                    fileName: "index",
                    formats: ['es', 'cjs', 'umd', 'iife'],
                },
                rollupOptions: {
                    external: ['react'],
                    output: {
                        globals: {
                            react: 'React',
                        },
                    },
                },
            },
        }
    } else if (mode == 'svelte') {
        return {
            build: {
                outDir: 'dist/svelte',
                lib: {
                    entry: resolve(__dirname, 'src/svelte.ts'),
                    name: 'useiife',
                    fileName: "index",
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
        }
    } else if (mode == 'angular') {
        return {
            build: {
                outDir: 'dist/angular',
                lib: {
                    entry: resolve(__dirname, 'src/angular.ts'),
                    name: 'useiife',
                    fileName: "index",
                    formats: ['es', 'cjs', 'umd', 'iife'],
                },
                rollupOptions: {
                    external: ['@angular/common', '@angular/core'],
                    output: {
                        globals: {
                            "@angular/common": 'ng.common',
                            "@angular/core": 'ng.core',
                        },
                    },
                },
            },
        }
    } else {
        return {
            build: {
                lib: {
                    entry: resolve(__dirname, 'src/index.ts'),
                    name: 'useiife',
                    fileName: 'index',
                    formats: ['es', 'cjs', 'umd', 'iife'],
                },
            },
        }
    }
})