import type { Focusable, resNode, Coords } from "./types"
import { Element } from './Element'

export class MapNode extends Element implements Focusable {
    x:number = 0
    y:number = 0
    width:number = 50
    id:string = ''
    hover:boolean = false
    primaryFont:any
    iconFont:any
    constructor(obj:resNode) {
        super(obj)
        this.x = obj.x
        this.y = obj.y
        this.id = obj.id
        this.type = "mapNode"
    }
    rehover() {
        this.hover = true
    }
    dehover() {
        this.hover = false
    }
    setSketchContext(p5:any) {
        this.p5 = p5
    }
    setFonts(primary:any, icon:any) {
        this.primaryFont = primary
        this.iconFont = icon
    }
    getCoords():Coords {
        return { x: this.x, y: this.y }
    }
}