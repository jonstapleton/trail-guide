import { visit } from "unist-util-visit"
import { h } from 'hastscript'

export function code_and_image() {
    return function (tree:any) {
        let index = 0;
        visit(tree, function (node:any) {
            if(node.tagName == 'code-and-image') {
                let tabTitles:string[] = []
                for(let i=0;i<node.children.length;i++) {
                    const child = node.children[i]
                    if(child.tagName == 'pre') {
                        // This assumes a lot:
                        // 1. That the second className is the "language" class
                        // 2. That the language class is always `language-[lang]`
                        // 3. That if the language is not set, the class is `language-undefined`

                        // Get the tab titles
                        let title = 'none-'+index
                        if(child.children[0].properties.className && child.children[0].properties.className.length > 1) {
                            title= child.children[0].properties.className[1].substring('language-'.length)+"-"+String(index)
                        }
                        child.properties.name = title
                        child.properties.id = title
                        child.properties.className = ['code-and-image']
                        if(title != 'none-'+index) {
                            child.properties.className.push('has-tabs')
                        }
                        if (title != 'undefined') {
                            // Cast first letter as uppercase
                            tabTitles = [...tabTitles, title] //.charAt(0).toUpperCase() + title.slice(1)]
                        }
                        index += 1
                    }
                }
                node.properties.tabs = JSON.stringify(tabTitles)
            }
        })
    }
}

export const getComponent = (title:string, tabTitles:string[]) => {
    let tabs = [];
    for(let i=0;i<tabTitles.length;i++) {
        tabs.push(h('li'))
    }
    const component = h('article.code-and-image.card.my-5',[
        h('header.card-header.code-example.pl-5.pt-2.pb-0', h('h4.title', title)),
        h('section.card-content', [
            h('div.columns.is-tablet', [
                h('div.code.column.m-0', tabs)
            ])
        ])
    ])
} 