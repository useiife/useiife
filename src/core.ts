import { withBase } from 'ufo'

const PROVIDERS = ['jsdelivr', 'cdnjs', 'unpkg', 'generic'] as const
type Provider = (typeof PROVIDERS)[number]

export type NpmOptions = {
  packageName: string,
  file: string,
  version: string,
  provider: Provider,
}

const getProviderBaseUrl = (provider: Provider = 'unpkg', packageName: string, version: string = 'latest'): string => {
  switch (provider) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${packageName}@${version}/`
    case 'cdnjs':
      return `https://cdnjs.cloudflare.com/ajax/libs/${packageName}/${version}/`
    default:
      return `https://unpkg.com/${packageName}@${version}/`
  }
}

export const useScriptInput = (npmOptions: NpmOptions) => {
  const baseUrl = getProviderBaseUrl(npmOptions.provider, npmOptions.packageName, npmOptions.version);
  return { src: withBase(npmOptions.file || '', baseUrl) };
}