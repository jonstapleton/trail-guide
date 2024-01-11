import { text } from "@sveltejs/kit";
import type { Coords } from "./types";

export class Cursor {

    state:any = null
    p5:any;
    dragOffsetX:number|null = null;
    dragOffsetY:number|null = null;
    mx:number;
    my:number;
    tx:number;
    ty:number;
    keys:string[] = []

    constructor(p5:any) {
        this.p5 = p5
        this.mx = p5.mouseX
        this.my = p5.mouseY
    }

    update() {
        this.mx = this.p5.mouseX
        this.my = this.p5.mouseY

        // handle mouse pressed operations
        if(this.p5.mouseIsPressed && !this.dragOffsetX) {
            this.dragOffsetX = this.p5.mouseX
            this.dragOffsetY = this.p5.mouseY
        } else if(!this.p5.mouseIsPressed) {
            this.dragOffsetX = null
            this.dragOffsetY = null
            // this.setState(this.p5.ARROW)
        }
        // this.p5.fill(0);
        // this.p5.text(`${this.mx}, ${this.my}`, this.mx, this.my)
        // this.p5.circle(this.mx, this.my, 10); // draw cursor for debugging
        if(this.dragOffsetX) {
            this.p5.line(this.mx, this.my, this.dragOffsetX, this.dragOffsetY);
        }
        
    }

    click(data:any):any|null {
        // TODO: check coordinates
        let selectedNode:any|null = null
        for(let i=0;i<data.nodes.length;i++) {
            const node = data.nodes[i]
            if(this.p5.dist(this.tx, this.ty, node.x/2, node.y/2) <= 50) {
                node.selected = true;
                selectedNode = node
            } else {
                node.selected = false;
            }
        }
        return selectedNode
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

    setTransformCoords(coords:Coords) {
        this.tx = coords.x
        this.ty = coords.y
    }
}

export class Cartographer {
    
    p5:any
    x:number = 0;
    y:number = 0;
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

    draw(data:any, cursor:Cursor) {
        if(this.currentScale != this.scale) {
            const lerp = (this.scale - this.currentScale) / 4
            this.currentScale += lerp;
        }

        
        this.p5.push()
        this.p5.translate(this.p5.width/4, this.p5.height/2)
        this.p5.scale(this.currentScale)
        this.p5.translate(this.x, this.y)

        // from https://www.reddit.com/r/p5js/comments/jo7ucf/clicking_on_a_translated_scaled_and_rotated_shape/
        const matrix = this.p5.drawingContext.getTransform()
        const localCoord = matrix
            .inverse()
            .transformPoint(
                new DOMPoint(
                    this.p5.mouseX * this.p5.pixelDensity(),
                    this.p5.mouseY * this.p5.pixelDensity()
                )
            );
        cursor.setTransformCoords(localCoord)
        
        
        // Nodes
        let nodeObj:any = {}
        for(let i=0;i<data.nodes.length;i++) {
            const node = data.nodes[i]
            
            // if mouse is hovering over a node, highlight it
            if(this.p5.dist(localCoord.x, localCoord.y, node.x/2, node.y/2) <= 50) {
                this.p5.fill(this.p5.color(255, 0, 0))
                this.p5.circle(node.x/2, node.y/2, 60);
            }
            // Draw node
            const color = node.selected? this.p5.color(0, 255, 0) : 255            
            this.p5.fill(color)
            this.p5.circle(node.x/2, node.y/2, 50)
            
            

            // this.p5.fill(0)
            // this.p5.text(`${node.x/2}, ${node.y/2}`, node.x/2, node.y/2)
            // TODO: you can optimize by moving this iteration & the creation of nodeObj to setup()
            nodeObj[node.id] = node // create the nodeObj object to help with drawing edges    
        }
        // Edges
        for(let i=0;i<data.edges.length;i++) {
            const edge = data.edges[i]
            const node1 = nodeObj[edge.fromNode]
            const controlPointKeyX = {"left":-300,"right":300,"top":0,"bottom":0}
            const controlPointKeyY = {"left":0,"right":0,"top":-300,"bottom":300}
            const controlPoint1 = {
                x: node1.x + controlPointKeyX[edge.fromSide],
                y: node1.y + controlPointKeyY[edge.fromSide]
            }

            const node2 = nodeObj[edge.toNode]
            const controlPoint2 = {
                x: node2.x + controlPointKeyX[edge.toSide],
                y: node2.y + controlPointKeyY[edge.toSide]
            }
            // this.p5.line(node1.x/2, node1.y/2, node2.x/2, node2.y/2);
            this.p5.fill('rgba(0, 0, 0, 0)')
            this.p5.bezier(
                node1.x/2, node1.y/2,
                controlPoint1.x/2, controlPoint2.y/2,
                controlPoint2.x/2, controlPoint2.y/2,
                node2.x/2, node2.y/2
            )
        }
        this.p5.pop()
        this.p5.fill(0)
        this.p5.text(`${localCoord.x}, ${localCoord.y}`, 20, this.p5.height - 25)
    }
}