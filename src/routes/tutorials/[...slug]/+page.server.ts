import { parse } from '$lib/parsing/parser'

export async function load({ params }) {
    const { file, frontmatter, quicktake, practice } = await parse(params.slug + '.md')
    return {
        path: params.slug,
        content: {full: file.value, quick: quicktake, practice: practice},
        frontmatter: frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    }
}

export const prerender = true