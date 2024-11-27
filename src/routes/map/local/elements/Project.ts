import type { Focusable, Document, Coords } from "./types"
import { Tutorial } from "./Tutorial"
import { Edge } from "./Edge"
import { Element } from "./Element"

export class Project extends Element implements Focusable {
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
        this.type = "project"
        this.difficulty = obj.frontmatter.difficulty ? obj.frontmatter.difficulty : 0
        if(!obj.frontmatter.nodes) { throw new Error(`Document ${obj.frontmatter.title} does not define nodes!`)}
        let objIds:string[] = []
        let objArray:(string|Tutorial)[] = []
        for(let i=0;i<obj.frontmatter.nodes.length;i++) {
            let nodeRef = obj.frontmatter.nodes[i].replaceAll(' ', '').replace('{optional}','').replace('./', this.path + "/")
            objArray.push(nodeRef)
            objIds.push(nodeRef)
            this.optionalTutorialMask.push(obj.frontmatter.nodes[i].includes('{optional}'))
        }
        // console.log(objArray)
        for(let i=0;i<nodeObjs.length;i++) {
            const nodeFilePath = nodeObjs[i].path
            if(objArray.includes(nodeFilePath)) {
                const index = objArray.indexOf(nodeFilePath)
                objArray[index] = nodeObjs[i]
                objIds[index] = nodeObjs[i].id
            }
        }
        for(const obj of objArray) {
            if(typeof(obj) == typeof("string")) { throw Error(obj + " not found, could not create Element")}
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
        this.center = { x: ((minX as number)/2) + ((maxX as number) - (minX as number))/4, y: ((minY as number)/2) + ((maxY as number) - (minY as number))/4 }

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
            this.nodes[i].dehighlight()
        }
        for(let i=0;i<this.edges.length;i++) {
            this.edges[i].dehighlight()
        }
    }
    getCenterCoords():Coords {
        return this.center;
    }
    getCoords(): Coords {
        return this.getCenterCoords()
    }
}