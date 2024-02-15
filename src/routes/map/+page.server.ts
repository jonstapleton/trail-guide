import {read} from 'to-vfile'
import {base} from '$app/paths'
import type {MapDataResponse} from './local/mapNodes'

export async function load({ fetch }) {

    // construct MapResponse object
    const blob = (await read('../modules/region-map.canvas')).toString()
    const res = JSON.parse(blob)
    for(let i=0;i<res.nodes.length;i++) {
        const md = await (await fetch(`${base}/api/file/${res.nodes[i].file}.json`)).json()
        res.nodes[i].content = md.content
        res.nodes[i].frontmatter = md.frontmatter
        res.nodes[i].path = md.path
    }
    res.projects = await (await fetch(`${base}/api/file/projects.json`)).json()

    // const mapData = new Map(res)
    return {
        res: res as MapDataResponse
    }
}

export const prerender = true;