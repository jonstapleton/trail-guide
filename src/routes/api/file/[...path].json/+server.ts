import { json } from '@sveltejs/kit'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import {read} from 'to-vfile'
import {unified} from 'unified'
import YAML from 'yaml'


export async function GET({ params }) {
    // process markdown
    let frontmatter:object
    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(() => (tree) => {
            frontmatter = YAML.parse(tree.children[0].value)
        })
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        // TODO: this is going to cause problems for us! Paths, etc.
        .process(await read(`../modules/${params.path.replace('.json', '')}`))
    
    console.log(file)

    return json({
        path: params.path,
        content: file.value,
        frontmatter: frontmatter
    })
}