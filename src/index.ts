import { useScript, createUnhead } from 'unhead'
import type { UseScriptOptions } from 'unhead/types';
import { getProviderUrl } from './core'
import type { NpmOptions } from './core'

const head = createUnhead({})

export const useIIFE = (npmOptions: NpmOptions | string, _options?: UseScriptOptions<Record<string | symbol, any>> | undefined) => {
  return useScript(head, { src: getProviderUrl(npmOptions) }, _options)
}