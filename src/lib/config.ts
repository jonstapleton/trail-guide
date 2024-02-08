import YAML from 'yaml'
import { read } from 'to-vfile'

export async function loadConfig() {
    const file = await read('../config.yaml')
    const config = YAML.parse(file.toString())
    console.log(config)
    return config
}