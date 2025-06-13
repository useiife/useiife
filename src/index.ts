import { useScript, createUnhead } from 'unhead'
import type { UseScriptOptions } from 'unhead/types';
import { useScriptInput } from './core'
import type { NpmOptions } from './core'

const head = createUnhead({})

const useIIFE = (npmOptions: NpmOptions, _options?: UseScriptOptions<Record<string | symbol, any>> | undefined) => {
  return useScript(head, useScriptInput(npmOptions), _options)
}

export default {
  useIIFE
}