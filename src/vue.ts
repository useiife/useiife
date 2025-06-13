import { useScript } from '@unhead/vue'
import type { UseScriptOptions } from '@unhead/vue'
import { useScriptInput } from './core'
import type { NpmOptions } from './core'

const useIIFE = (npmOptions: NpmOptions, _options?: UseScriptOptions<Record<string | symbol, any>> | undefined) => {
    return useScript(useScriptInput(npmOptions), _options)
}

export default {
    useIIFE
}