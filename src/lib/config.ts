import YAML from 'yaml'
import { read } from 'to-vfile'

interface Config {
    title:string,
    modules:string,
    status:string,
    local:boolean
}

export async function loadConfig():Promise<Config> {
    const file = await read('../config.yaml')
    const config = YAML.parse(file.toString()) as Config
    return config
}