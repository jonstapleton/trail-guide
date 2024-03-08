import { parse } from '$lib/parsing/parser'
import { read } from 'to-vfile'

// TODO: context-ful location pages, that show what map you're "in" based on where you're coming from
export async function load({ params }) {
    const { file, frontmatter, quicktake, practice } = await parse(params.slug + '.md')

    // const blob = (await read('../modules/region-map.canvas')).toString()
    // const res = JSON.parse(blob)

    // let id = res.nodes.filter((obj:any)=> {
    //     return obj.path = params.slug
    // })[0]

    // console.log(id)

    return {
        path: params.slug,
        content: {full: file.value, quick: quicktake, practice: practice},
        frontmatter: frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    }
}

export const prerender = true