interface Document {
    frontmatter:Frontmatter,
    file:string,
    path:string,
    content:string
}

interface Frontmatter {
    title:string,
    nodes?:string[]
}

interface resNode extends Document {
    x:number,
    y:number,
    id:string
}

export interface MapDataResponse {
    nodes:resNode[],
    edges:object[],
    projects:Document[]
}

export class Edge {
    id:string = ''
    fromSide:string
    toSide:string
    toNode:Tutorial
    fromNode:Tutorial
    highlighted:boolean = false
    constructor() {

    }
}

export class Map {
    nodes:Tutorial[] = []
    edges:object[] = []
    projects:Project[] = []
    selectedNode:Tutorial|null = null

    constructor(res:MapDataResponse) {
        for(let i=0;i<res.nodes.length;i++) {
            this.nodes.push(new Tutorial(res.nodes[i]))
        }
        this.edges = res.edges
        this.projects = this.constructProjects(res, this.nodes)
    }
    constructProjects(res:MapDataResponse, nodes:Tutorial[]):Project[] {
        let objs:Project[] = []
        for(let i=0;i<res.projects.length;i++) {
            objs.push(new Project(res.projects[i], nodes))
        }
        return objs
    }
}

class Element {
    frontmatter:Frontmatter = { title: "Default Title" }
    file:string = ''
    path:string = ''
    content:string = '<p>no content</p>'
    completed:boolean = false
    constructor(obj:Document) {
        this.frontmatter = obj.frontmatter
        this.file = obj.file
        this.path = obj.path
        this.content = obj.content
    }
}

class MapNode extends Element {
    x:number = 0
    y:number = 0
    id:string = ''
    hover:boolean = false
    constructor(obj:resNode) {
        super(obj)
        this.x = obj.x
        this.y = obj.y
        this.id = obj.id
    }
}

export class Tutorial extends MapNode {
    highlighted:boolean = false
    completed:boolean = false
    selected:boolean = false
    constructor(obj:resNode) {
        super(obj)
    }
    highlight() {
        console.log("highlighting", this.frontmatter.title)
        this.highlighted = true
    }
}

export class Project extends Element {
    nodes:Tutorial[] = []
    selected:boolean = false
    difficulty:number
    constructor(obj:Document, nodeObjs:Tutorial[]) {
        super(obj)
        this.difficulty = obj.frontmatter.difficulty ? obj.frontmatter.difficulty : 'N/A'
        if(!obj.frontmatter.nodes) { throw new Error(`Document ${obj.frontmatter.title} does not define nodes!`)}
        let objArray:(string|Tutorial)[] = [...obj.frontmatter.nodes]
        for(let i=0;i<nodeObjs.length;i++) {
            const nodeFilePath = './'+nodeObjs[i].path
            if(objArray.includes(nodeFilePath)) {
                objArray[objArray.indexOf(nodeFilePath)] = nodeObjs[i]
            }
        }
        this.nodes = objArray as Tutorial[]
    }

    highlight() {
        // TODO: fix edge highlighting
        console.log("highlighting", this.frontmatter.title)
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlight()
        }
    }
    dehighlight() {
        // TODO: fix edge dehighlight
        // console.log("highlighting", this.frontmatter.title)
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlighted = false || this.selected
        }
    }
}