import { loadConfig } from "$lib/config"
import {read} from 'to-vfile'
import {base} from '$app/paths'
import type {MapDataResponse} from './map/local/mapNodes'

export async function load({ fetch }) {

    const blob = (await read('../modules/region-map.canvas')).toString()
    const res = JSON.parse(blob)
    for(let i=0;i<res.nodes.length;i++) {
        const md = await (await fetch(`${base}/api/file/${res.nodes[i].file}.json`)).json()
        res.nodes[i].content = md.content
        res.nodes[i].frontmatter = md.frontmatter
        res.nodes[i].path = md.path
    }
    res.projects = await (await fetch(`${base}/api/file/projects.json`)).json()
    
    const config = await loadConfig()
    return {
        config: config,
        res: res as MapDataResponse
    }
}

export const prerender = true;