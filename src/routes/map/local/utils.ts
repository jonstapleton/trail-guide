import { text } from "@sveltejs/kit";
import type { Coords } from "./types";

export class Cursor {
    overNode = false
    state:any = null
    p5:any;
    dragOffsetX:number|null = null;
    dragOffsetY:number|null = null;
    mx:number;
    my:number;
    tx:number;
    ty:number;
    keys:string[] = []
    selectedNode:object|null = null

    constructor(p5:any) {
        this.p5 = p5
        this.mx = p5.mouseX
        this.my = p5.mouseY
    }

    update() {
        this.mx = this.p5.mouseX
        this.my = this.p5.mouseY
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
            if(this.p5.dist(this.tx, this.ty, node.x/2, node.y/2) <= 50) {
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
            // let the cursor know it's in a hover state
            cursor.overNode = false;
            if(this.p5.dist(localCoord.x, localCoord.y, node.x/2, node.y/2) <= 50) {
                this.p5.fill(this.p5.color(255, 0, 0))
                this.p5.circle(node.x/2, node.y/2, 60);
                cursor.overNode = true
            }
            // Draw node
            // TODO: we need to see a lot more information about the node without having to interact with it
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
    }
}

export class Camera {
    
    p5:any
    currentScale:number = 1
    scale:number = 1; lscale:number = 1
    x:number = 0; y:number = 0;
    lx:number = 0; ly:number = 0;
    offsetX:number = 0; offsetY:number = 0

    constructor(p5:any, data:object, scale:number) {
        this.scale = scale;
        if(data && data.nodes) {
            let minX = 0; let minY = 0;
            for(let i=0;i<data.nodes.length;i++) {
                if(data.nodes[i].x < minX) { minX = data.nodes[i].x }
                if(data.nodes[i].y < minY) { minY = data.nodes[i].y }
            } 
            console.log(`MinX: ${minX}, MinY: ${minY}`)
            this.lx -= minX
            this.ly -= minY/4
            this.x = this.lx
            this.y = this.ly
        }
        this.p5 = p5;
    }

    setCoords(coords:Coords, centerFactor:number) {
        const dx = this.p5.width * centerFactor - this.p5.mouseX
        const dy = this.p5.height * 0.5 - this.p5.mouseY
        // console.log(`${dx}, ${dy}`)
        this.x += dx
        this.y += dy
    }

    zoom(coords:Coords, scaleFactor:number, absolute:boolean) {
        let factor;
        if(!absolute) {
            factor = scaleFactor
        } else {
            factor = scaleFactor/this.scale
        }
        this.scale = this.scale * factor;
        this.x = this.p5.mouseX - (this.p5.mouseX * factor) + (this.x * factor);
        this.y = this.p5.mouseY - (this.p5.mouseY * factor) + (this.y * factor);
    }

    display(coords:Coords, cb:any) {
        // lerp scale changes
        if(this.currentScale != this.scale) {
            const lerp = (this.scale - this.currentScale) / 4
            this.currentScale += lerp;
        } 
        // update map offset coordinates
        this.x -= coords.x; this.y -= coords.y
        
        // lerp click changes
        // this.x += lerp(this.x, this.lx, 4);
        // this.y += lerp(this.y, this.ly, 4);

        // center of screen debug marker
        // this.p5.circle(this.p5.width*centerFactor, this.p5.height*0.5, 10)
        let transformX = this.lx + ((this.x - this.lx)/4)
        let transformY = this.ly + ((this.y - this.ly)/4)
        // let lerpScale  = this.scale + ((this.scale - this.lscale)/4)
        
        this.p5.push();
        this.p5.translate(transformX, transformY);
        this.p5.scale(this.currentScale)
        cb();
        this.p5.pop();
        this.p5.fill(0)
        this.p5.text(`${this.x}, ${this.y}`, 20, this.p5.height - 25)

        this.lx = transformX; this.ly = transformY; //this.lscale = lerpScale
    }
}

function lerp(target:number, current:number, str:number):number {
    if(target != current) {
        return (current - target) / str
    }
    return 0
}