import { loadConfig } from "$lib/config"
import {read} from 'to-vfile'
import {base} from '$app/paths'
import type {MapDataResponse} from './map/local/mapNodes'
import { mapData } from './store'
import { browser } from '$app/environment'

export async function load({ fetch }) {

    const blob = (await read('../modules/region-map.canvas')).toString()
    const res = JSON.parse(blob)
    for(let i=0;i<res.nodes.length;i++) {
        if(res.nodes[i].type == "file") {
            console.log("fetching...")
            const md = await (await fetch(`${base}/api/file/${res.nodes[i].file}.json`)).json()
            res.nodes[i].content = md.content
            res.nodes[i].frontmatter = md.frontmatter
            res.nodes[i].path = md.path
        }
    }
    res.groups = res.nodes.filter((obj:any) => obj.type == "group")
    res.projects = await (await fetch(`${base}/api/file/projects.json`)).json()

    let local;
    
    const config = await loadConfig()
    console.log("Group Count:", (res.nodes.filter((obj:any) => obj.type == "group")).length)
    return {
        config: config,
        map: local ? JSON.parse(local) : res as MapDataResponse
    }
}

export const prerender = true;