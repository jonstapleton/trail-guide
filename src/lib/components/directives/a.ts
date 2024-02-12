import { base } from "$app/paths"
import { visit } from 'unist-util-visit'

export function a() {
    return function (tree:any) {
      visit(tree, function (node:object, index:number, parent:object):any {
        
        if(node.tagName == 'a') {
            node.properties.href = node.properties.href[0] == '/' ? `${base}${node.properties.href}` : node.properties.href
        }
      })
    }
  }