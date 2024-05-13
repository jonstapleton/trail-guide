import { json } from '@sveltejs/kit'
import { parse } from '$lib/parsing/parser'
import * as fs from 'fs/promises'
import type { RouteParams } from './$types.js'


export async function GET({ params }) {
    // get and process markdown for file in params.path
    const obj = await parse(params.path)
    let content:any = {
        full: obj.file.value
    }
    if(obj.quicktake) { content.quick = obj.quicktake }
    if(obj.practice && obj.practice.length > 0)  { content.practice = obj.practice }

    const res = {
        path: params.path,
        content: content,
        frontmatter: obj.frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    }

    //TODO: load userdata for tutorial or project at params.path

    return json(res)
}

export async function entries() {
    console.log("Prerendering [...path].json")
    const subdirectories = [
        '../modules/projects/',
        '../modules/concepts/',
        '../modules/applications/'
    ]
    let paths:RouteParams[] = []
    for(let i=0;i<subdirectories.length;i++) {
        const files = await fs.readdir(subdirectories[i])
        console.log(files)
        files.forEach((path:string) => {
            console.log("Prerendering", path)
            paths.push({path: subdirectories[i].replace('../modules/','')+path})
        }); 
    }
    // throw new Error(paths.toString())
    return paths
}

export const prerender = true