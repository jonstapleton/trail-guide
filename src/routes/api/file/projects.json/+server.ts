import { json } from "@sveltejs/kit"
import * as fs from 'fs'
import { parse } from "$lib/parsing/parser";
import { loadConfig } from "$lib/config";


export async function GET() {
    const config = await loadConfig()
    const dir = `../${config.modules}/projects/`;
    let paths:string[] = []
    fs.readdirSync(dir).forEach((path:string) => {
        if(!path.includes('_')) {
            paths.push(path)
        }
    }); 

    let objs = []
    for(let i=0;i<paths.length;i++) {
        const projectFile = paths[i] + '/index.md'
        const { file, frontmatter, quicktake, practice } = await parse(dir+projectFile)
        objs.push({
            path: 'projects/'+projectFile.replace('/index.md', ''),
            content: {full: file.value, quick: quicktake, practice: practice},
            frontmatter: frontmatter,
            completed: false
        })
    }
    // console.log(objs)

    return json(objs)
}

export const prerender = true;