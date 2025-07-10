import { Tutorial } from "./Tutorial"
import { Edge } from "./Edge"
import { Project } from "./Project"
import { Cache } from "./Cache"
import type { MapDataResponse } from "./types"

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
            this.nodesByPath[this.projects[i].path + '.md'] = this.projects[i]
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
    deselectAll() {
        console.log("Deselecting all projects...")
        for(const proj of this.projects) {
            proj.deselect()
        }
    }
    getProjectByPath(path:string):Project {
        return this.projectObj[path]
    }
}