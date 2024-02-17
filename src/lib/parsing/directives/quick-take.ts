import { visit } from 'unist-util-visit'
import {toHtml} from 'hast-util-to-html'
import {remove} from 'unist-util-remove'

export function quick_take(tree:any):any|false {
    let content:string = ''
    visit(tree, function (node:any) {
        if(node.tagName == 'quick-take' && node.children) {
            console.log("found quick take!")
            content += toHtml(node.children)
        }
    })
    remove(tree, (node:any) => node.tagName == 'quick-take')
    return content
}