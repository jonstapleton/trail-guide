import type { Coords } from './types'
import type { Map } from './Map'
import { Tutorial } from './Tutorial'
import { bezier } from './types'
import type { MapNode } from './MapNode'

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
    getCurve(p5:any, node1:MapNode, node2:MapNode) {
        const p0 = p5.createVector(node1.x/2, node1.y/2)
        const p1 = p5.createVector(this.c1.x/2, this.c1.y/2)
        const p2 = p5.createVector(this.c2.x/2, this.c2.y/2)
        const p3 = p5.createVector(node2.x/2, node2.y/2)
        return { p0: p0, p1: p1, p2: p2, p3: p3 }
    }
    draw(p5:any, nodes:object) {
        const node1:Tutorial = nodes[this.fromNode]
        const node2:Tutorial = nodes[this.toNode]
            
        p5.fill('rgba(0, 0, 0, 0)')

        const { p0, p1, p2, p3 } = this.getCurve(p5, node1, node2)
        
        p5.stroke(p5.color(0, 0, 0));
        p5.strokeWeight(1);
        p5.bezier(p0.x, p0.y ,p1.x, p1.y ,p2.x, p2.y, p3.x, p3.y)
    }
    drawHighlight(p5:any, nodes:object) {
        // If the edge is highlighted, draw a bolder line as well
        if(this.highlighted) {
            const node1:Tutorial = nodes[this.fromNode]
            const node2:Tutorial = nodes[this.toNode]
            const { p0, p1, p2, p3 } = this.getCurve(p5, node1, node2)
            p5.stroke(p5.color(255, 0, 0));
            p5.strokeWeight(18);
            if(this.highlighted == 'dashed') {
                bezier(p5, p0,p1,p2,p3,0.1) // TODO: set `t` based on how far apart the nodes are
            } else {
                p5.bezier(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)
            }
        }
    }

    highlight(style:string) {
        this.highlighted = style
    }
    dehighlight() {
        this.highlighted = false
    }
}