import type { Focusable, Document, Coords } from "./types"
import { Tutorial } from "./Tutorial"
import { Edge } from "./Edge"
import { Element } from "./Element"

class Group {
    name:string
    references:string[] = []
    list:Tutorial[] = []
    listMask:boolean[] = []
    edges:Edge[] = []
    edgeMask:boolean[] = []
    to:string[] = []
    parent:Project

    constructor(name:string, refs:string[], parent:Project, nodeObjs:Tutorial[], edges:Edge[]) {
        this.name = name
        this.references = refs
        this.parent = parent

        // Generate the clean paths and the tutorial mask for the group
        const paths = (refs as unknown as string[]).filter(item => !(item.charAt(0) == '$')) // get all the Tutorials referenced in the group, excluding group references
        for(const item of paths) {
            let cleanPath = this.cleanPath(item)
            const groupObj = (nodeObjs.filter((node) => cleanPath == node.path))[0] as Tutorial
            this.list.push(groupObj)
            if(item.includes('{optional}')) {
                this.listMask.push(true)
            } else {
                this.listMask.push(false)
            }
        }
        if(this.listMask.length != this.references.length || this.listMask.length != this.list.length) { throw new Error(`Failed to generate mask for group ${this.name} in project ${this.parent.frontmatter.title}!`) }

        // Handle local edges & generate the mask
        const groupIds = this.getTutorialIds()
        this.edges = edges.filter((e) => {
            // find the indices of the nodes in each group, then filter the edges to find edges that are between two adjacent nodes
            let to = groupIds.indexOf(e.toNode)
            let from = groupIds.indexOf(e.fromNode)
            const nodesAreAdjacent = (to != -1 && from != -1) && (Math.abs(to - from) == 1 || Math.abs(groupIds.indexOf(e.toNode) - groupIds.indexOf(e.fromNode)) == 1)

            let idsWithoutOptional:string[] = []
            for(const id of groupIds) {
                const r = this.getReferenceFromId(id)
                if(r && !r.includes('{optional}')) {
                    idsWithoutOptional.push(id)
                }
            }
             
            const nodesAreAdjacentWithoutOptionalNodes = (to != -1 && from != -1) && (Math.abs(to - from) == 1 || Math.abs(idsWithoutOptional.indexOf(e.toNode) - idsWithoutOptional.indexOf(e.fromNode)) == 1)
            return nodesAreAdjacent || nodesAreAdjacentWithoutOptionalNodes
        })
        for(const edge of this.edges) {
            const to = this.getReferenceFromId(edge.toNode)
            const from = this.getReferenceFromId(edge.fromNode)
            if((to && from) && (to.includes('{optional}') || from.includes('{optional}'))) {
                this.edgeMask.push(true)
            } else {
                this.edgeMask.push(false)
            }
        }

        // Find and add the edges that skip optional tutorials
        
    }

    getAllPaths() {
        const paths = this.references.filter(item => !(item.charAt(0) == '$')) // get all the Tutorials referenced in the group, excluding group references
        let cleanPaths:string[] = []
        for(const path of paths) {
            cleanPaths.push(this.cleanPath(path))
        }
        return cleanPaths
    }

    cleanPath(path:string):string {
        return path.replaceAll(' ', '').replace('{optional}','').replace('./', this.parent.path + "/")
    }

    getList():Tutorial[] {
        return this.list
    }

    getTutorialIds():string[] {
        let ids:string[] = []
        for(const element of this.list) {
            ids.push(element.id)
        }
        return ids
    }
    
    getLocalTutorials():Tutorial[] {
        return this.list
    }


    getReferenceFromId(id:string):string|false {
        const node = this.list.find(obj => obj.id == id) as Tutorial
        const ref = this.references.find(ref => this.cleanPath(ref) == node.path)
        return ref ? ref : false
    }
}


export class Project extends Element implements Focusable {
    nodes:Tutorial[] = []
    edges:Edge[] = []
    optionalTutorialMask:boolean[] = []
    optionalEdgeMask:boolean[] = []
    selected:boolean = false
    difficulty:number
    id:string
    center:Coords

    // groups data structures
    groups:Group[] = []

    constructor(obj:Document, nodeObjs:Tutorial[], edges:Edge[]) {
        super(obj)
        this.type = "project"
        this.difficulty = obj.frontmatter.difficulty ? obj.frontmatter.difficulty : 0
        if(!obj.frontmatter.nodes) { throw new Error(`Document ${obj.frontmatter.title} does not define nodes!`)}
        let objIds:string[] = []
        let objArray:(string|Tutorial)[] = []

        // Get all the Project Tutorials by iterating over the group references
        let tutorialsAdded:string[] = []
        for(const [k,list] of Object.entries(obj.frontmatter.nodes)) {
            this.groups.push(new Group(k, (list as unknown as string[]), this, nodeObjs, edges)) // make the group
        }

        // Now, collate the info from the groups into the Project
        for(const group of this.groups) {
            this.nodes = [...this.nodes, ...group.list]
            this.optionalTutorialMask = [...this.optionalTutorialMask, ...group.listMask]

            this.edges = [...this.edges, ...group.edges]
            this.optionalEdgeMask = [...this.optionalEdgeMask, ...group.edgeMask]
        }

        // Find the center of the project
        this.center = this.findCenter()
        
        this.id = this.path
    }

    getTutorialIdsFromGroup(groupName:string) {
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

    private findCenter():Coords {
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
    getCompleted():Element[] {
        return this.nodes.filter((obj:Element) => {
            return obj.completed
        })
    }
}