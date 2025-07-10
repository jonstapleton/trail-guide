import { Tutorial } from "./Tutorial"
import { Lerpable, type resNode } from "./types"
import type { Coords } from "./types"
import { Cursor } from "../utils"

export class Cache extends Tutorial {
    constructor(obj:resNode) {
        super(obj)
        this.type = "cache"
    }
    setWidth(p5:any, font:any) {
        this.width = 75
        this.widthOffset = new Lerpable(0, this.getWidth(p5, font))
    }

    draw(p5:any, cursor:Cursor) {
        
        this.handleHighlight(p5)

        // Update hover animation
        
        this.widthOffset.update()
        const currentOffset = this.widthOffset.getLerp()
        const hovering = this.handleHover(p5, cursor, currentOffset)
        this.widthOffset.setTarget(hovering || this.selected ? 1 : 0)

        this.setFill(p5)
        p5.circle(this.x/2, this.y/2, this.width + currentOffset)

        // Draw the title
        const c = p5.color(0)
        c.setAlpha(p5.map(this.widthOffset.current, 0, 1, 0, 255))
        p5.stroke(c)
        p5.fill(c)
        p5.text(`${this.frontmatter.title}`, this.x/2 - this.width/2, this.y/2, this.width)

        // Draw the icon
        this.drawIcon(p5, hovering || this.selected)

        // reset font
        p5.textFont(this.primaryFont)
    }
    drawIcon(p5:any, expanded:boolean) {
        p5.stroke(0)
        p5.textFont(this.iconFont)
        const lerpValue = this.widthOffset.getLerp()
        const position:Coords = { x: (this.x/2 - this.width/2) - lerpValue/2, y: (this.y/2) + lerpValue/2 }
        
        // Draw the badge
        if(expanded) {
            p5.fill(255)
            p5.circle(this.x/2 - lerpValue/2, position.y, this.width)
        }
        p5.fill(0)
        p5.text(this.frontmatter.icon, position.x, position.y, this.width)
    }
}