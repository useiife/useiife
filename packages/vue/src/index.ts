import { useScript } from '@unhead/vue'
import { type UseScriptOptions } from '@unhead/vue'
const PROVIDERS = ['jsdelivr', 'cdnjs', 'unpkg', 'generic'] as const
type Provider = (typeof PROVIDERS)[number]

export type NpmOptions = {
  name: string,
  version: string | undefined,
  provider: Provider | undefined,
  file: string | undefined,
}

export const getProviderUrl = (npmOptions: NpmOptions | string): string => {
  if (typeof npmOptions === 'string') {
    return npmOptions
  }
  if (!npmOptions.name) {
    throw new Error('name is required')
  }
  if (npmOptions.version === undefined) {
    npmOptions.version = 'latest'
  }
  if (npmOptions.provider === undefined) {
    npmOptions.file = 'unpkg'
  }
  if (npmOptions.file === undefined) {
    npmOptions.file = ''
  }
  switch (npmOptions.provider) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${npmOptions.name}@${npmOptions.version}/${npmOptions.file || ''}`
    case 'cdnjs':
      return `https://cdnjs.cloudflare.com/ajax/libs/${npmOptions.name}/${npmOptions.version}/${npmOptions.file || ''}`
    default:
      return `https://unpkg.com/${npmOptions.name}@${npmOptions.version}/${npmOptions.file || ''}`
  }
}

export const useIIFE = (npmOptions: NpmOptions | string, _options?: UseScriptOptions<Record<string | symbol, any>> | undefined) => {
  return useScript({ src: getProviderUrl(npmOptions) }, _options)
}