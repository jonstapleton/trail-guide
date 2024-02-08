import { loadConfig } from "$lib/config"

export async function load() {
    
    const config = await loadConfig()
    return {
        config: config
    }
}