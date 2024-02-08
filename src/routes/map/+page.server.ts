import type Map from './local/Map.svelte';
import {read} from 'to-vfile'
import {base} from '$app/paths'

export async function load({ fetch }) {
    const blob = (await read('../modules/region-map.canvas')).toString()
    const mapData = JSON.parse(blob)

    for(let i=0;i<mapData.nodes.length;i++) {
        const md = await (await fetch(`${base}/api/file/${mapData.nodes[i].file}.json`)).json()
        mapData.nodes[i].content = md.content
        mapData.nodes[i].frontmatter = md.frontmatter
        mapData.nodes[i].path = md.path
    }

    return mapData as Map
}

export const prerender = true;