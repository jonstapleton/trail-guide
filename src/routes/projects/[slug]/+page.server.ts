import { parse } from '$lib/parsing/parser'
import { base } from '$app/paths'
import { read } from 'to-vfile'

export async function load({ params, fetch }) {
    const { file, frontmatter, quicktake, practice } = await parse('/projects/'+params.slug + '.md')
    const blob = (await read('../modules/region-map.canvas')).toString()
    const res = JSON.parse(blob)

    const nodes = res.nodes.filter((obj:any) => {
        return frontmatter.nodes.includes("./"+obj.file)
    })

    let nodeIdsByPath:any = {}
    for(let i=0;i<nodes.length;i++) {
        nodeIdsByPath["./"+nodes[i].file] = nodes[i].id
    }

    console.log(nodeIdsByPath)

    for(let i=0;i<frontmatter.nodes.length;i++) {
        const id = nodeIdsByPath[frontmatter.nodes[i]]
        frontmatter.nodes[i] = await (await fetch(`${base}/api/file/${frontmatter.nodes[i]}.json`)).json()
        frontmatter.nodes[i].id = id
    }

    return {
        path: params.slug,
        content: {full: file.value, quick: quicktake, practice: practice},
        frontmatter: frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    }
}

export const prerender = true