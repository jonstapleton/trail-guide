import type { Focusable, Document, Coords } from "./types"
import { Tutorial } from "./Tutorial"
import { Edge } from "./Edge"
import { Element } from "./Element"


export class Project extends Element implements Focusable {
    nodes:Tutorial[] = []
    edges:Edge[] = []
    map:any = {}
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

        // Build `map` Groups from raw data
        // Store group references for later
        const groupRefs:object[] = []
        for(const [k,v] of Object.entries(obj.frontmatter.nodes)) {
            this.map[k] = { nodes: [], optNodeMask: [], edges: [], optEdgeMask: [] }
            for(let i=0;i<v.length;i++) {
                const n = v[i]
                if(n.charAt(0) == "$") {
                    // console.log("Found Group reference in " + k + " group")
                    const newRef = {
                        parent: k,
                        name: n.substring(1),
                        to: i < v.length-1 ? v[i + 1] : null,
                        from: i > 0 ? v[i - 1] : null
                    }
                    newRef.to = newRef.to ? newRef.to.replaceAll(' ', '').replace('{optional}','').replace('./', this.path + "/") : null
                    newRef.from = newRef.from ? newRef.from.replaceAll(' ', '').replace('{optional}','').replace('./', this.path + "/") : null
                    groupRefs.push(newRef)
                } else {
                    let nodeRef = n.replaceAll(' ', '').replace('{optional}','').replace('./', this.path + "/")
                    // all the nodes have unique filepaths, so we know this will work everytime
                    const nodeObj = (nodeObjs.filter((node) => nodeRef == node.path))[0] as Tutorial
                    this.map[k].nodes.push(nodeObj)
                    this.map[k].optNodeMask.push(n.includes('{optional}'))
                    this.nodes.push(nodeObj) // push the object reference to `this.nodes:Tutorial[]`
                }
            }
        }
        this.center = this.getCenter()

        // Find edges for each group
        // TODO: if a groupRef has a `to` and a `from` the edge reference is self-contained within the group and should be added
        for(const [k,v] of Object.entries(this.map)) {
            const groupIds = this.getGroupIds(k)
            const groupEdges =  edges.filter((e) => {
                // find the indices of the nodes in each group, then filter the edges to find edges that are between two adjacent nodes
                const to = groupIds.indexOf(e.toNode)
                const from = groupIds.indexOf(e.fromNode)
                return (to != -1 && from != -1) && (Math.abs(to - from) == 1 || Math.abs(groupIds.indexOf(e.toNode) - groupIds.indexOf(e.fromNode)) == 1)
            })
            this.map[k].edges = groupEdges
        }

        // copy the edges from the groups to `this.edges:Edge[]`
        for(const [k,v] of Object.entries(this.map)) {
            for(const edge of this.map[k].edges) {
                if(this.edges.filter(e => edge.id == e.id).length == 0) {
                    this.edges.push(edge)
                }
            }
        }

        // add edges associated with references
        for(const ref of groupRefs) {
            const to = ref.to ? this.nodes.filter(n => ref.to == n.path)[0] : null
            const from = ref.from ? this.nodes.filter(n => ref.from == n.path) : this.map[ref.name].nodes[this.map[ref.name].nodes.length-1]

            if(!(to && from)) { throw new Error(`Cannot connect group reference to ${ref.to} in ${ref.parent}`) }
            const refEdges = this.getEdgesBetween(to, from, edges)
            this.edges = refEdges ? [...this.edges, ...refEdges] : this.edges
        }
        
        this.id = this.path
    }

    getGroupIds(groupName:string) {
        let ids:string[] = []
        for(const n of this.map[groupName].nodes) {
            ids.push(n.id)
        }
        return ids
    }

    getEdgesBetween(node1:Tutorial, node2:Tutorial, edges:Edge[]):Edge[]|false {
        const between = edges.filter(e => (e.toNode == node1.id || e.toNode == node2.id) && (e.fromNode == node1.id || e.fromNode == node2.id))
        if(between.length == 0) {
            console.warn(`Cannot find edge between ${node1.path} and ${node2.path}!`)
            return false
        } else {
            return between
        }
    }

    getCenter():Coords {
        if(this.nodes.length == 0) { throw new Error(`Cannot find project at ${this.path} center, no nodes loaded`)}
        // find project center
        let minX; let maxX; let minY; let maxY;
        for(let i=0;i<this.nodes.length;i++) {
            const node = this.nodes[i]
            if(!minX || node.x < minX) { minX = node.x }
            if(!maxX || node.x > maxX) { maxX = node.x }
            if(!maxY || node.y > maxY) { maxY = node.y }
            if(!minY || node.y < minY) { minY = node.y }
        }
        return { x: ((minX as number)/2) + ((maxX as number) - (minX as number))/4, y: ((minY as number)/2) + ((maxY as number) - (minY as number))/4 }
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