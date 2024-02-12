import { json } from '@sveltejs/kit'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import { img } from '$lib/components/directives/img'
import { a } from '$lib/components/directives/a'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import {read} from 'to-vfile'
import {unified} from 'unified'
import YAML from 'yaml'


export async function GET({ params }) {
    // process markdown
    let frontmatter:object = {}
    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(() => (tree) => {
            frontmatter = tree.children[0] && tree.children[0].value ? YAML.parse(tree.children[0].value) : {}
            // if there's no frontmatter defined but there's content in the file, the frontmatter will get assigned the first element
            if(typeof(frontmatter) == typeof('string')) {
                frontmatter = {}
            }
        })
        .use(remarkGfm)
        .use(remarkDirective)
        .use(remarkRehype)
        .use(img)
        .use(a)
        .use(rehypeFormat)
        .use(rehypeStringify)
        // TODO: this is going to cause problems for us! Paths, etc.
        .process(await read(`../modules/${params.path.replace('.json', '')}`))
    
    // console.log(file, frontmatter)
    frontmatter.title = frontmatter.title? frontmatter.title :  `../modules/${params.path.replace('.json', '')}`

    return json({
        path: params.path,
        content: file.value,
        frontmatter: frontmatter,
        completed: false // TODO: this is going to have to change when we load data
    })
}