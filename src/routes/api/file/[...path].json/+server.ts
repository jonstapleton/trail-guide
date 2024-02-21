import { json } from '@sveltejs/kit'
import { parse } from '$lib/parsing/parser'


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