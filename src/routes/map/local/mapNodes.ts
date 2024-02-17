interface Document {
    frontmatter:Frontmatter,
    file:string,
    path:string,
    content:string
}

interface Frontmatter {
    title:string,
    nodes?:string[],
    video?:string,
    description?:string
}

interface resNode extends Document {
    x:number,
    y:number,
    id:string
}

interface Coords {
    x:number,
    y:number
}

export interface MapDataResponse {
    nodes:resNode[],
    edges:object[],
    projects:Document[]
}

export class Map {
    nodes:Tutorial[] = []
    nodeObj:any = {}
    projectObj:any = {}
    edges:Edge[] = []
    projects:Project[] = []
    selectedNode:Tutorial|null = null

    constructor(res:MapDataResponse) {
        for(let i=0;i<res.nodes.length;i++) {
            const tut = new Tutorial(res.nodes[i])
            this.nodes.push(tut)
            this.nodeObj[res.nodes[i].id] = tut // create the nodeObj object to help with drawing edges
        }
        // this.edges = res.edges

        for(let i=0;i<res.edges.length;i++) {
            const edge = new Edge(res.edges[i], this)
            this.edges.push(edge)
            // if(this.nodeObj[edge.toNode]) {
            //     this.nodeObj[edge.toNode].edges.push(edge.id)
            // }
            // if(this.nodeObj[edge.fromNode]) {
            //     this.nodeObj[edge.fromNode].edges.push(edge.id)
            // }
        }
        this.projects = this.constructProjects(res, this.nodes, this.edges)
        for(let i=0;i<this.projects.length;i++) {
            this.projectObj[this.projects[i].id] = this.projects[i]
        }
        
    }
    constructProjects(res:MapDataResponse, nodes:Tutorial[], edges:Edge[]):Project[] {
        let objs:Project[] = []
        for(let i=0;i<res.projects.length;i++) {
            objs.push(new Project(res.projects[i], nodes, edges))
        }
        return objs
    }
}

export class Edge {
    c1:Coords
    c2:Coords
    toNode:string
    fromNode:string
    fromSide:("left"|"right"|"top"|"bottom")
    toSide:("left"|"right"|"top"|"bottom")
    id:string
    highlighted = false
    constructor(resEdge:any, data:Map) {
        this.toNode = resEdge.toNode
        this.fromNode = resEdge.fromNode
        this.toSide = resEdge.toSide
        this.fromSide = resEdge.fromSide
        this.id = resEdge.id
        const node1 = data.nodeObj[this.fromNode]
        const controlPointKeyX = {"left":-300,"right":300,"top":0,"bottom":0}
        const controlPointKeyY = {"left":0,"right":0,"top":-300,"bottom":300}
        const controlPoint1:Coords = {
            x: node1.x + controlPointKeyX[this.fromSide],
            y: node1.y + controlPointKeyY[this.fromSide]
        }

        const node2 = data.nodeObj[this.toNode]
        const controlPoint2:Coords = {
            x: node2.x + controlPointKeyX[this.toSide],
            y: node2.y + controlPointKeyY[this.toSide]
        }
        this.c1 = controlPoint1
        this.c2 = controlPoint2
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
    edges:string[] = []
    constructor(obj:resNode) {
        super(obj)
    }
    highlight() {
        this.highlighted = true
    }
}

export class Project extends Element {
    nodes:Tutorial[] = []
    edges:Edge[] = []
    selected:boolean = false
    difficulty:number
    id:string
    constructor(obj:Document, nodeObjs:Tutorial[], edges:Edge[]) {
        super(obj)
        this.difficulty = obj.frontmatter.difficulty ? obj.frontmatter.difficulty : 'N/A'
        if(!obj.frontmatter.nodes) { throw new Error(`Document ${obj.frontmatter.title} does not define nodes!`)}
        let objIds:any[] = [...obj.frontmatter.nodes]
        let objArray:(string|Tutorial)[] = [...obj.frontmatter.nodes]
        for(let i=0;i<nodeObjs.length;i++) {
            const nodeFilePath = './'+nodeObjs[i].path
            if(objArray.includes(nodeFilePath)) {
                const index = objArray.indexOf(nodeFilePath)
                objArray[index] = nodeObjs[i]
                objIds[index] = nodeObjs[i].id
            }
        }
        // this.nodes is an ordered list of the nodes in the trail
        this.nodes = objArray as Tutorial[]

        this.edges = edges.filter((edge) => {
            const to = objIds.indexOf(edge.toNode)
            const from = objIds.indexOf(edge.fromNode)
            const edgeInProject = (to != -1 && from != -1) && Math.abs(to - from) == 1
            return edgeInProject
        })
        this.id = this.path
        // console.log(`${this.frontmatter.title} edges:`, this.edges.length)
    }

    highlight() {
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlight()
        }
        for(let i=0;i<this.edges.length;i++) {
            this.edges[i].highlighted = true
        }
    }
    dehighlight() {
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlighted = false || this.selected
        }
        for(let i=0;i<this.edges.length;i++) {
            this.edges[i].highlighted = false || this.selected
        }
    }
}