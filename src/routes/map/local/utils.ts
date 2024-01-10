import type { Coords } from "./types";

export class Cursor {

    state:any = null
    p5:any;
    dragOffsetX:number|null = null;
    dragOffsetY:number|null = null;
    mx:number;
    my:number;
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

        this.p5.circle(this.mx, this.my, 10); // draw cursor for debugging
        if(this.dragOffsetX) {
            this.p5.line(this.mx, this.my, this.dragOffsetX, this.dragOffsetY);
        }
        
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

    draw(data:any) {
        if(this.currentScale != this.scale) {
            const lerp = (this.scale - this.currentScale) / 4
            this.currentScale += lerp;
        }
        
        this.p5.push()
        this.p5.translate(this.p5.width/4, this.p5.height/2)
        this.p5.scale(this.currentScale)
        this.p5.translate(this.x, this.y)
        
        for(let i=0;i<data.nodes.length;i++) {
            const node = data.nodes[i]
            // p5.rect(node.x/2, node.y/-2, node.width/2, node.height/2, 15, 15)
            this.p5.circle(node.x/2, node.y/-2, 50)    
        }
        this.p5.pop()
        
    }
}