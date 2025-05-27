import { visit } from 'unist-util-visit'
import {toHtml} from 'hast-util-to-html'
import {remove} from 'unist-util-remove'
import {h} from 'hastscript'

export function quick_take(tree:any):string {
    let content:string = ''
    visit(tree, function (node:any) {
        if(node.tagName == 'quick-take' && node.children) {
            // const el = h('div', [
            //    , 
            // ])
            // el.properties.src = node.properties.src
            console.log("found quick take!", node.properties.src)
            content += toHtml( h('div.column.mt-0.pt-0.pb-5', [node.children]))
            if(node.properties.src) {
                content += toHtml(h('div.column.mt-0.pt-0.pb-5', [h('img', {src: node.properties.src})]))
            }
        }
    })
    remove(tree, (node:any) => node.tagName == 'quick-take')
    return content
}