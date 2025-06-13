import { useScript } from '@unhead/svelte'
import type { UseScriptOptions } from 'unhead/types';
import { useScriptInput } from './core'
import type { NpmOptions } from './core'

const useIIFE = (npmOptions: NpmOptions, _options?: UseScriptOptions<Record<string | symbol, any>> | undefined) => {
    return useScript(useScriptInput(npmOptions), _options)
}

export default {
    useIIFE
}