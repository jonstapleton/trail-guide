import type { Frontmatter, Document } from './types'

export class Element {
    frontmatter:Frontmatter = { title: "Default Title" }
    file:string = ''
    path:string = ''
    content:string = '<p>no content</p>'
    completed:boolean = false
    p5:any
    type:string = "element"
    constructor(obj:Document) {
        this.frontmatter = obj.frontmatter
        this.file = obj.file
        this.path = obj.path
        this.content = obj.content
        this.completed = obj.completed ? obj.completed : false

        if(obj.completed == true) {
            console.log("Constructing completed Element", obj.file)
        }
    }
}