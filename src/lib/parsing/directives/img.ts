import { base } from "$app/paths"
import { visit, SKIP } from 'unist-util-visit'
import { h } from 'hastscript'

export function img() {
    return function (tree:any) {
      visit(tree, function (node:object, index:number, parent:object):any {
        if(node.tagName == 'img') {
            // TODO: error reporting
            const alt = node.properties.alt ? node.properties.alt : "no alt text provided"
            const src = node.properties.src ? node.properties.src : "no src provided"
            
            // `<div class='has-text-centered' style='margin-left: auto; margin-right: auto;'>
            //     <figure class="image is-inline-block">
            //         <img alt="${alt}" src="${base}/images${src}" />
            //     </figure>
            // </div>`
            // const html= h('div', { classList: 'has-text-centered', style: 'margin-left: auto; margin-right: auto;'}, 
            //                 h('figure.image.is-inline-block',
            //                     h('img', { alt: alt, src: `${base}/images${src}` })
            //                 )
            //             )
            // node.tagName = 'div'
            // node.properties.class = 'has-text-centered, parsed'
            // node.children = html.children
            node.properties.src = `${base}/images${src}`
            // return SKIP
        }
      })
    }
  }