import type Map from './local/Map.svelte';
import {read} from 'to-vfile'

export async function load() {
    const blob = (await read('/home/kat/GitHub/pytext-trail-guide/modules/region-map.canvas')).toString()
    const mapData = JSON.parse(blob)

    return mapData as Map
}

export const prerender = true;