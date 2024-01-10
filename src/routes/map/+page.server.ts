import {read} from 'to-vfile'

export async function load() {
    const blob = (await read('/home/kat/GitHub/pytext-trail-guide/modules/region-map.canvas')).toString()
    const mapData = JSON.parse(blob)

    return mapData
}

export const prerender = true;