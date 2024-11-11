import { loadConfig } from "$lib/config"
import {read} from 'to-vfile'
import {base} from '$app/paths'
import type {MapDataResponse} from './map/local/mapNodes'
import { mapData } from './store'
import { browser } from '$app/environment'

export async function load({ fetch }) {

    const config = await loadConfig()

    const blob = (await read(`../${config.modules}/region-map.canvas`)).toString()
    const res = JSON.parse(blob)
    for(let i=0;i<res.nodes.length;i++) {
        const md = await (await fetch(`${base}/api/file/${res.nodes[i].file}.json`)).json()
        res.nodes[i].content = md.content
        res.nodes[i].frontmatter = md.frontmatter
        res.nodes[i].path = md.path
    }

    res.projects = await (await fetch(`${base}/api/file/projects.json`)).json()

    let local;

    return {
        config: config,
        map: local ? JSON.parse(local) : res as MapDataResponse
    }
}

export const prerender = true;