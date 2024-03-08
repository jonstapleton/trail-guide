import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import { img } from '$lib/parsing/directives/img'
import { a } from '$lib/parsing/directives/a'
import { quick_take } from './directives/quick-take'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import {read} from 'to-vfile'
import {unified} from 'unified'
import YAML from 'yaml'
import { practice } from './directives/practice'
import { code_and_image } from './directives/code-and-image'
import rehypeHighlight from 'rehype-highlight'

export async function parse(path:string) {
    let frontmatter:any = {
        title: "No title!"
    }
    let qt:string = ''
    let qs:object[] = []
    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(() => (tree:any) => {
            frontmatter = tree.children[0] && tree.children[0].value ? YAML.parse(tree.children[0].value) : {}
            // if there's no frontmatter defined but there's content in the file, the frontmatter will get assigned the first element
            if(typeof(frontmatter) == typeof('string')) {
                frontmatter = {}
            }
        })
        .use(remarkGfm)
        .use(remarkDirective)
        .use(remarkDirectiveRehype)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(img)
        .use(a)
        .use(() => (tree:any) => {
            qt = quick_take(tree)
        })
        .use(() => (tree:any) => {
            const q = practice(tree, path)
            qs.push(...q)
        })
        .use(code_and_image)
        .use(rehypeFormat)
        .use(rehypeStringify)
        // TODO: this is going to cause problems for us! Paths, etc.
        .process(await read(`../modules/${path.replace('.json', '')}`))
    
    // console.log(file, frontmatter)
    frontmatter.title = frontmatter.title? frontmatter.title :  `../modules/${path.replace('.json', '')}`

    console.log(frontmatter.title,)

    return {
        file: file,
        frontmatter: frontmatter,
        quicktake: qt,
        practice: qs
    }
}