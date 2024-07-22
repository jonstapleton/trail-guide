import type { Coords, Transform } from "./types";
import type { Edge, Map, Tutorial } from "./mapNodes";

export class Cursor {
    overNode = false
    state:any = null
    p5:any;
    dragOffsetX:number|null = null;
    dragOffsetY:number|null = null;
    mx:number;
    my:number;
    localX:number = 0;
    localY:number = 0;
    keys:string[] = []
    selectedNode:object|null = null

    constructor(p5:any) {
        this.p5 = p5
        this.mx = p5.mouseX
        this.my = p5.mouseY
    }

    update(matrix:DOMMatrix) {
        this.mx = this.p5.mouseX
        this.my = this.p5.mouseY

        const localCoords = getLocalCoords(this.p5, matrix, { x: this.mx, y: this.my })
        this.localX = localCoords.x
        this.localY = localCoords.y
    }

    getDrag(interact:boolean):Coords {
        if(!interact) {
            return { x: 0, y: 0}
        }
        if(this.p5.mouseIsPressed) {
            return {
                x: this.p5.pmouseX - this.p5.mouseX,
                y: this.p5.pmouseY - this.p5.mouseY
            } 
        }
        return {
            x: 0,
            y: 0
        }
        
    }

    click(data:any):any|null {
        let newNode = false
        let selectedNodes:number[] = []
        let index = null
        for(let i=0;i<data.nodes.length;i++) {
            const node = data.nodes[i]
            if(node.selected) {
                selectedNodes.push(i)
            }
            if(this.p5.dist(this.localX, this.localY, node.x/2, node.y/2) <= 50) {
                node.selected = !node.selected;
                this.selectedNode = node
                index = i
                newNode = true
            }
        }
        // Turn off other selected node(s)
        if(newNode) {
            for(let i=0;i<selectedNodes.length;i++) {
                data.nodes[selectedNodes[i]].selected = false
            }
        }
        return newNode ? {node: this.selectedNode, index: index} : {node: null, index: null} 
    }

    getOffset():Coords|null {
        if(!this.dragOffsetX) {
            return null
        }
        return { 
            x: (this.dragOffsetX ? this.mx-this.dragOffsetX:0), 
            y: (this.dragOffsetY ? this.my-this.dragOffsetY:0) 
        }
    }

    addKey(k:string) {
        this.keys = [k, ...this.keys]
    }
    removeKey(k:string) {
        const i = this.keys.indexOf(k)
        const keys = this.keys
        keys.splice(i, 1)
        this.keys = keys
    }

    setState(c:any) {
        this.state = c;
        this.p5.cursor(this.state)
    }

    getState() {
        return this.state
    }
}

export class Cartographer {
    
    p5:any
    x:number = 0;
    y:number = 0;
    font:any
    tick:number = 0
    offset:Coords = {
        x: 0, y: 0
    }
    scale = 0.5;

    currentScale = 0.5
    
    constructor(p5:any) {
        this.p5 = p5
    }

    move(x:number, y:number) {
        const factor = 1/this.currentScale
        this.x = x*factor+this.offset.x; this.y = y*factor+this.offset.y;
    }
    lock() {
        this.offset.x = this.x
        this.offset.y = this.y
    }

    bezier(p0:Coords, p1:Coords, p2:Coords, p3:Coords, t:number) {
        let o = 0
        for(let i=0;i<1.0001;i+=t) {
            const v = this.cubic(p0,p1,p2,p3,i)
            if(o % 2 == 0) {
                this.p5.beginShape()
                this.p5.vertex(v.x,v.y)
            } else {
                this.p5.vertex(v.x,v.y)
                this.p5.endShape()
            }
            o++
        }
    }

    cubic(p0:Coords, p1:Coords, p2:Coords, p3:Coords, t:number):Coords {
        const v1 = this.quadratic(p0,p1,p2,t)
        const v2 = this.quadratic(p1,p2,p3,t)
        const x = this.p5.lerp(v1.x, v2.x, t)
        const y = this.p5.lerp(v1.y, v2.y, t)
        return this.p5.createVector(x, y)
    }

    quadratic(p0:Coords, p1:Coords, p2:Coords, t:number):Coords {
        const x1 = this.p5.lerp(p0.x, p1.x, t)
        const y1 = this.p5.lerp(p0.y, p1.y, t)
        const x2 = this.p5.lerp(p1.x, p2.x, t)
        const y2 = this.p5.lerp(p1.y, p2.y, t)
        const x = this.p5.lerp(x1, x2, t)
        const y = this.p5.lerp(y1, y2, t)
        return this.p5.createVector(x,y)
    }

    draw(data:Map, cursor:Cursor) {
        this.tick++
        
        // Draw Edges
        for(let i=0;i<data.edges.length;i++) {
            const edge:Edge = data.edges[i]
            const node1:Tutorial = data.nodeObj[edge.fromNode]
            const node2:Tutorial = data.nodeObj[edge.toNode]
            
            this.p5.fill('rgba(0, 0, 0, 0)')
            
            const p0 = this.p5.createVector(node1.x/2, node1.y/2)
            const p1 = this.p5.createVector(edge.c1.x/2, edge.c1.y/2)
            const p2 = this.p5.createVector(edge.c2.x/2, edge.c2.y/2)
            const p3 = this.p5.createVector(node2.x/2, node2.y/2)

            // If the edge is highlighted, draw a bolder line as well
            if(edge.highlighted) {
                this.p5.stroke(this.p5.color(255, 0, 0));
                this.p5.strokeWeight(18);
                if(edge.highlighted == 'dashed') {
                    this.bezier(p0,p1,p2,p3,0.1) // TODO: set `t` based on how far apart the nodes are
                } else {
                    this.p5.bezier(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)
                }
            }
            this.p5.stroke(this.p5.color(0, 0, 0));
            this.p5.strokeWeight(1);
            this.p5.bezier(p0.x, p0.y ,p1.x, p1.y ,p2.x, p2.y, p3.x, p3.y) 
        } 
        
        // Draw Nodes
        for(let i=0;i<data.nodes.length;i++) {
            const node = data.nodes[i]
            
            // if mouse is hovering over a node, highlight it
            // let the cursor know it's in a hover state
            // cursor.overNode = false;

            let box = this.font.textBounds(node.frontmatter.title, node.x/2, node.y/2)
            const w = 200 > box.w + 25 ? box.w + 25 : 200
            const h = (Math.floor(box.w / 140)+1) * (box.h + this.p5.textLeading())

            if(node.highlighted) {
                this.p5.fill(this.p5.color(255, 0, 0))
                this.p5.circle(node.x/2, node.y/2, w + 18);
                // cursor.overNode = true
            }
            if(this.p5.dist(cursor.localX, cursor.localY, node.x/2, node.y/2) <= w/2 || node.hover) {
                this.p5.fill(this.p5.color(0, 0, 255))
                this.p5.circle(node.x/2, node.y/2, w + 18)
            }

            // Draw node
            const color = node.selected? this.p5.color(0, 255, 0) : 255            
            this.p5.fill(color)
            // this.p5.rect(node.x/2-(w/2), node.y/2-(h/2), w, h)
            this.p5.circle(node.x/2, node.y/2, w)
            
            this.p5.fill(0)
            // this.p5.text(node.frontmatter.title, node.x/2-150/2, node.y/2, 150)
            this.p5.text(`${node.x/2}, ${node.y/2}`, node.x/2-150/2, node.y/2, 150)
            
            // Icons
            if(node.completed) {
                let cx = node.x/2 + w/3
                let cy = node.y/2 - w/3
                this.p5.strokeWeight(24)
                this.p5.line(cx, cy, cx - 25, cy - 25)
                this.p5.line(cx, cy, cx + 50, cy - 50)
                this.p5.stroke('rgb(72, 199, 116)');
                this.p5.strokeWeight(18)
                this.p5.line(cx, cy, cx - 25, cy - 25)
                this.p5.line(cx, cy, cx + 50, cy - 50)
                this.p5.strokeWeight(1)
            }

            // Add "start here" callout
            if(node.frontmatter.start && !node.completed) {
                let offsetY = Math.abs((this.tick/3) % 30 - 15)
                this.p5.triangle(node.x/2 - 125/2, (node.y/2 - w*1.5) + offsetY, node.x/2 + 125/2, (node.y/2 - w*1.5) + offsetY, node.x/2, (node.y/2 - w*1.5+125) + offsetY)
                this.p5.circle(node.x/2, (node.y/2 - w*1.5) + offsetY, 125)
                this.p5.fill(255)
                this.p5.stroke(255)
                this.p5.text("Start Here", node.x/2 - 48, (node.y/2 - w*1.5) + offsetY, 100)
            }
            this.p5.stroke(0)
            
        }

        // Draw projects (debugging)
        for(let i=0;i<data.projects.length;i++) {
            const proj = data.projects[i]
            if(proj.selected) {
                this.p5.circle(proj.center.x, proj.center.y, 100)
            }
        }
               
    }
}



export class Camera {
    
    p5:any
    x:number = 0; y:number = 0;
    lx:number = 0; ly:number = 0;
    ix:number; iy:number
    transform:Transform = { x: 0, y: 0, scale: 1}
    matrix:DOMMatrix;
    offsetX:number = 0; offsetY:number = 0
    moving:boolean = false

    constructor(p5:any, data:object, scale:number) {
        this.p5 = p5;
        this.x = this.p5.width/2
        this.y = this.p5.height/2
        this.ix = this.x
        this.iy = this.y

        this.p5.push();
        this.p5.translate(this.transform.x, this.transform.y);
        this.p5.scale(this.transform.scale)
        this.matrix = this.p5.drawingContext.getTransform()
        this.p5.pop();
    }

    offsetTransform(coords:Coords):boolean {
        this.transform.x += coords.x
        this.transform.y += coords.y
        return false
    }

    display(cb:any) {
        this.p5.push()
        this.p5.translate(-this.transform.x, -this.transform.y)
        this.p5.scale(this.transform.scale)
        cb();
        this.matrix = this.p5.drawingContext.getTransform()
        this.p5.pop()

        this.p5.fill('rgba(0, 0, 0, 0')
        this.p5.circle(this.p5.width/2, this.p5.height/2, 10)
        this.p5.line(this.p5.width/2, this.p5.height/2 - 15, this.p5.width/2, this.p5.height/2 + 15)
        this.p5.line(this.p5.width/2 + 15, this.p5.height/2, this.p5.width/2 - 15, this.p5.height/2)
        this.p5.fill(0)
        this.p5.text(`${this.x},${this.y}`, this.p5.width/2, this.p5.height/2 - 30)
    }
    zoom(absoluteLocation:Coords, deltaZoom:number, absolute:boolean) {
        let factor;
        if(!absolute) {
            factor = deltaZoom
        } else {
            factor = deltaZoom/this.transform.scale
        }
        this.transform.scale = this.transform.scale * factor;
        this.transform.x = -(absoluteLocation.x - (absoluteLocation.x * factor) + (-this.transform.x * factor));
        this.transform.y = -(absoluteLocation.y - (absoluteLocation.y * factor) + (-this.transform.y * factor));
    }

    moveCenterTo(absolutePosition:Coords) {
        console.log("Got call to move to", absolutePosition)
        // figure out transformation needed to move camera to correct screen coordinate
        const dx = this.ix - absolutePosition.x
        const dy = this.iy - absolutePosition.y
        this.transform.x -= dx
        this.transform.y -= dy
    }
    getLocalCoords(coords:Coords) {
        return getLocalCoords(this.p5, this.matrix, coords)
    }
    getScreenCoords(coords:Coords) {
        const screenCoords = this.matrix
        // .inverse()
        .transformPoint(
            new DOMPoint(
                coords.x * this.p5.pixelDensity(),
                coords.y * this.p5.pixelDensity()
            )
        );
        return screenCoords
    }
}

export function getLocalCoords(p5:any, matrix:DOMMatrix, screenCoords:Coords) {
    // from https://www.reddit.com/r/p5js/comments/jo7ucf/clicking_on_a_translated_scaled_and_rotated_shape/
    const localCoord = matrix
        .inverse()
        .transformPoint(
            new DOMPoint(
                screenCoords.x * p5.pixelDensity(),
                screenCoords.y * p5.pixelDensity()
            )
        );
    return localCoord
}