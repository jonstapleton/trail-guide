import type { Cursor } from "./utils"

interface Document {
    frontmatter:Frontmatter,
    file:string,
    path:string,
    content:string,
    completed:boolean
}

interface Frontmatter {
    title:string,
    nodes?:string[],
    video?:string,
    description?:string,
    start?:boolean,
    type?:string,
    icon?:string
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
    nodesByPath:any = {}
    projectObj:any = {}
    edges:Edge[] = []
    projects:Project[] = []
    selectedNode:Tutorial|null = null
    p5:any

    constructor(res:MapDataResponse) {
        res.nodes = res.nodes.filter((obj) => obj.file ? true : false)
        for(let i=0;i<res.nodes.length;i++) {
            const tut = res.nodes[i].frontmatter.type == 'cache' ? new Cache(res.nodes[i]) : new Tutorial(res.nodes[i])
            this.nodes.push(tut)
            this.nodeObj[res.nodes[i].id] = tut // create the nodeObj object to help with drawing edges
            this.nodesByPath[res.nodes[i].path] = tut
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
            this.projectObj[this.projects[i].path] = this.projects[i]
        }
        
    }
    constructProjects(res:MapDataResponse, nodes:Tutorial[], edges:Edge[]):Project[] {
        let objs:Project[] = []
        for(let i=0;i<res.projects.length;i++) {
            objs.push(new Project(res.projects[i], nodes, edges))
        }
        return objs
    }
    toRes():MapDataResponse {
        let res:MapDataResponse = {
            nodes: this.nodes,
            edges: this.edges,
            projects: this.projects
        }
        return res
    }
    setSketchContext(p5:any) {
        this.p5 = p5;
        for(const node of this.nodes) {
            node.setSketchContext(p5)
        }
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
    highlighted:string|false = false
    optional = false
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

    highlight(style:string) {
        this.highlighted = style
    }
    dehighlight() {
        this.highlighted = false
    }
}

class Element {
    frontmatter:Frontmatter = { title: "Default Title" }
    file:string = ''
    path:string = ''
    content:string = '<p>no content</p>'
    completed:boolean = false
    p5:any
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

class MapNode extends Element {
    x:number = 0
    y:number = 0
    id:string = ''
    hover:boolean = false
    primaryFont:any
    iconFont:any
    constructor(obj:resNode) {
        super(obj)
        this.x = obj.x
        this.y = obj.y
        this.id = obj.id
    }
    rehover() {
        this.hover = true
    }
    dehover() {
        this.hover = false
    }
    setSketchContext(p5:any) {
        this.p5 = p5
    }
    setFonts(primary:any, icon:any) {
        this.primaryFont = primary
        this.iconFont = icon
    }
}

export class Tutorial extends MapNode {
    highlighted:boolean = false
    // completed:boolean = false
    selected:boolean = false
    edges:string[] = []
    width:number = 200
    constructor(obj:resNode) {
        super(obj)
    }
    highlight() {
        this.highlighted = true
    }
    dehighlight() {
        this.highlighted = false
    }
    setWidth(p5:any, font:any) {
        // TODO: make this more sophisticated
        let box = font.textBounds(this.frontmatter.title, this.x/2, this.y/2)
        this.width = 250 < box.w + 25 ? 250 : box.w + 25 
    }
    draw(p5:any, cursor:Cursor) {
        // draw highlighted circle (red)
        this.handleHighlight(p5)
            
        // handle hover state
        this.handleHover(p5, cursor)

        // determine node fill color
        this.setFill(p5)
        
        // draw node & display text
        p5.circle(this.x/2, this.y/2, this.width)
        p5.fill(0)
        p5.text(this.frontmatter.title, this.x/2-150/2, this.y/2, 150)

        if(this.completed) { this.drawCheck(p5) }
    }

    drawCheck(p5:any) {
        let cx = this.x/2 + this.width/3
        let cy = this.y/2 - this.width/3
        p5.strokeWeight(24)
        p5.line(cx, cy, cx - 25, cy - 25)
        p5.line(cx, cy, cx + 50, cy - 50)
        p5.stroke('rgb(72, 199, 116)');
        p5.strokeWeight(18)
        p5.line(cx, cy, cx - 25, cy - 25)
        p5.line(cx, cy, cx + 50, cy - 50)
        p5.strokeWeight(1)
    }
    handleHighlight(p5:any) {
        if(this.highlighted) {
            p5.fill(p5.color(255, 0, 0))
            p5.circle(this.x/2, this.y/2, this.width + 18);
        }
    }
    handleHover(p5:any, cursor:Cursor) {
        if(p5.dist(cursor.localX, cursor.localY, this.x/2, this.y/2) <= this.width/2 || this.hover) {
            p5.fill(p5.color(0, 0, 255))
            p5.circle(this.x/2, this.y/2, this.width + 18)
        }
    }
    setFill(p5:any) {
        let color = this.selected? p5.color(0, 255, 0) : 255
        p5.fill(color)
    }
}

export class Cache extends Tutorial {
    constructor(obj:resNode) {
        super(obj)
    }
    setWidth(p5:any, font:any) {
        this.width = 75
    }

    draw(p5:any, cursor:Cursor) {
        this.handleHighlight(p5)
        this.handleHover(p5, cursor)
        
        this.setFill(p5)
        p5.circle(this.x/2, this.y/2, this.width)
        p5.fill(0)
        p5.textFont(this.iconFont)
        p5.text(this.frontmatter.icon, this.x/2 - this.width/2, this.y/2, this.width)

        // reset font
        p5.textFont(this.primaryFont)
    }
}

export class Project extends Element {
    nodes:Tutorial[] = []
    edges:Edge[] = []
    optionalTutorialMask:boolean[] = []
    optionalEdgeMask:boolean[] = []
    selected:boolean = false
    difficulty:number
    id:string
    center:Coords
    constructor(obj:Document, nodeObjs:Tutorial[], edges:Edge[]) {
        super(obj)
        this.difficulty = obj.frontmatter.difficulty ? obj.frontmatter.difficulty : 'N/A'
        if(!obj.frontmatter.nodes) { throw new Error(`Document ${obj.frontmatter.title} does not define nodes!`)}
        let objIds:string[] = []
        let objArray:(string|Tutorial)[] = []
        for(let i=0;i<obj.frontmatter.nodes.length;i++) {
            const nodeRef = obj.frontmatter.nodes[i].replaceAll(' ', '').replace('{optional}','')
            objArray.push(nodeRef)
            objIds.push(nodeRef)
            this.optionalTutorialMask.push(obj.frontmatter.nodes[i].includes('{optional}'))
        }

        
        for(let i=0;i<nodeObjs.length;i++) {
            const nodeFilePath = './'+nodeObjs[i].path
            if(objArray.includes(nodeFilePath)) {
                const index = objArray.indexOf(nodeFilePath)
                objArray[index] = nodeObjs[i]
                objIds[index] = nodeObjs[i].id
            }
        }
        this.nodes = objArray as Tutorial[]

        // find project center
        let minX; let maxX; let minY; let maxY;
        for(let i=0;i<this.nodes.length;i++) {
            const node = this.nodes[i]
            if(!minX || node.x < minX) { minX = node.x }
            if(!maxX || node.x > maxX) { maxX = node.x }
            if(!maxY || node.y > maxY) { maxY = node.y }
            if(!minY || node.y < minY) { minY = node.y }
        }
        this.center = { x: (minX/2) + (maxX - minX)/4, y: (minY/2) + (maxY - minY)/4 }

        // filter the edges available in the map down to the edges associated with the Project
        let reqIds:string[] = []
        this.edges = edges.filter((edge) => {
            const to = objIds.indexOf(edge.toNode)
            const from = objIds.indexOf(edge.fromNode)
            // if the edge leads to or comes from an optional tutorial...
            // if(edgeInProject && (this.optionalTutorialMask[to] || this.optionalTutorialMask[from])) {
            //     this.optionalEdgeMask.push(true)
            // } else if(edgeInProject) {
            //     this.optionalEdgeMask.push(false)
            // }

            for(let i=0;i<objIds.length;i++) {{
                if(!this.optionalTutorialMask[i]) {
                    reqIds.push(objIds[i])
                }
            }}

            const edgeInProject = (to != -1 && from != -1) && (Math.abs(to - from) == 1 || Math.abs(reqIds.indexOf(edge.toNode) - reqIds.indexOf(edge.fromNode)) == 1)

            //   edge nodes are in project list AND  (edges are adjacent  OR  all nodes in between edge nodes in node list are optional)
            return edgeInProject
        })

        for(let i=0;i<this.edges.length;i++) {
            if(!reqIds.includes(this.edges[i].toNode) || !reqIds.includes(this.edges[i].fromNode)) {
                // the edge is connected to an optional node
                this.optionalEdgeMask.push(true)
            } else {
                this.optionalEdgeMask.push(false)
            }
        }

        console.log(this.frontmatter.title, this.optionalEdgeMask)
        this.id = this.path
    }

    highlight() {
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlight()
        }
        for(let i=0;i<this.edges.length;i++) {
            this.edges[i].highlight(this.optionalEdgeMask[i] ? 'dashed' : 'solid')
        }
    }
    dehighlight() {
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlighted = false || this.selected
        }
        for(let i=0;i<this.edges.length;i++) {
            const highlight = false || this.selected
            if(highlight && this.optionalEdgeMask[i]) {
                this.edges[i].highlight("dashed")
            } else if(highlight) {
                this.edges[i].highlight("solid")
            } else {
                this.edges[i].dehighlight()
            }
        }
    }
    select() {
        this.selected = true
        this.highlight()
    }
    deselect() {
        this.selected = false
        for(let i=0;i<this.nodes.length;i++) {
            this.nodes[i].highlighted = false
        }
        for(let i=0;i<this.edges.length;i++) {
            this.edges[i].dehighlight()
        }
    }
    getCenterCoords():Coords {
        return this.center;
    }
}