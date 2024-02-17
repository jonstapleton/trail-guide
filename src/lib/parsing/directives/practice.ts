import { visit } from 'unist-util-visit'
import {toHtml} from 'hast-util-to-html'
import {remove} from 'unist-util-remove'
import {h} from 'hastscript'

export function practice(tree:any):string {
    let content:string = ''
    visit(tree, function (node:any) {
        if(node.tagName == 'practice-question' && node.children) {
            console.log("Found practice question!")
            // generate hast tree for practice questions from children of practice element
            const el = h('practice-question', node.children)
            content += toHtml(el)
        }
    })
    // remove(tree, (node:any) => node.tagName == 'quick-take')
    return content
}