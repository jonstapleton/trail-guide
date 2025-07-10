import type { Config } from "$lib/config"

export type Content = {
    full:string,
    quick?:string,
    prompt?:string
}

export interface Document {
    frontmatter:Frontmatter,
    file:string,
    path:string,
    content:Content,
    completed:boolean
}

export interface Frontmatter {
    title:string,
    nodes?:string[],
    video?:string,
    description?:string,
    difficulty?:number,
    start?:boolean,
    type?:string,
    icon?:string
}

export interface resNode extends Document {
    x:number,
    y:number,
    id:string
}

export interface Coords {
    x:number,
    y:number
}

export interface MapDataResponse {
    nodes:resNode[]
    edges:object[]
    projects:Document[]
}

export interface Focusable {
    getCoords():Coords
}

export class Lerpable {
    min:number = 0
    max:number = 0
    current:number = 0
    target:0|1 = 0
    constructor(min:number, max:number) {
        this.min = min
        this.max = max
    }
    setTarget(t:0|1) { this.target = t }
    update() {
        if(this.target == 0 && this.current > 0) { this.current -= 0.1 }
        if(this.target == 1 && this.current < 1) { this.current += 0.1 }
        this.current = Math.min(this.max, Math.max(this.min, this.current))
    }
    getLerp():number {
        return this.min * (1 - this.current) + this.max * this.current
    }
}

export function bezier(p5:any, p0:Coords, p1:Coords, p2:Coords, p3:Coords, t:number) {
    let o = 0
    for(let i=0;i<1.0001;i+=t) {
        const v = cubic(p5, p0,p1,p2,p3,i)
        if(o % 2 == 0) {
            p5.beginShape()
            p5.vertex(v.x,v.y)
        } else {
            p5.vertex(v.x,v.y)
            p5.endShape()
        }
        o++
    }
}

export function quadratic(p5:any, p0:Coords, p1:Coords, p2:Coords, t:number):Coords {
    const x1 = p5.lerp(p0.x, p1.x, t)
    const y1 = p5.lerp(p0.y, p1.y, t)
    const x2 = p5.lerp(p1.x, p2.x, t)
    const y2 = p5.lerp(p1.y, p2.y, t)
    const x = p5.lerp(x1, x2, t)
    const y = p5.lerp(y1, y2, t)
    return p5.createVector(x,y)
}

export function cubic(p5:any, p0:Coords, p1:Coords, p2:Coords, p3:Coords, t:number):Coords {
    const v1 = quadratic(p5, p0,p1,p2,t)
    const v2 = quadratic(p5, p1,p2,p3,t)
    const x = p5.lerp(v1.x, v2.x, t)
    const y = p5.lerp(v1.y, v2.y, t)
    return p5.createVector(x, y)
}
