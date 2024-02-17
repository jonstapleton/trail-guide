import { json } from '@sveltejs/kit'
import { parse } from '$lib/parsing/parser'


export async function GET({ params }) {
    // get and process markdown for file in params.path
    const { file, frontmatter, quicktake, practice } = await parse(params.path)

    //TODO: load userdata for tutorial or project at params.path

    return json({
        path: params.path,
        content: {full: file.value, quick: quicktake, practice: practice},
        frontmatter: frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    })
}