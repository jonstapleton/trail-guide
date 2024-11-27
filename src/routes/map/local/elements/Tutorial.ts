import { MapNode } from './MapNode'
import type { resNode } from './types'
import type { Cursor } from '../utils'
import { Lerpable } from './types'

export class Tutorial extends MapNode {
    highlighted:boolean = false
    selected:boolean = false
    edges:string[] = []
    width:number = 200
    widthOffset = new Lerpable(0,50)
    constructor(obj:resNode) {
        super(obj)
        this.type = "tutorial"
    }
    select() {
        this.selected = true;
    }
    highlight() {
        this.highlighted = true
    }
    dehighlight() {
        this.highlighted = false
    }
    setWidth(p5:any, font:any) {
        this.width = this.getWidth(p5, font)
    }
    getWidth(p5:any, font:any) {
        // find the longest series of words that will be displayed on one line (<= 150px)
        const words = this.frontmatter.title.split(' ')
        const lengths:number[] = []
        let lineHeight = -1;
        for(let i=0;i<words.length;i++) {
            words[i] += ' '
            let box = font.textBounds(words[i], this.x/2, this.y/2, 28)
            lengths.push(box.w)
            if(box.h > lineHeight) { lineHeight = box.h * 2 }
        }
        let lines = [
            {
                text: '',
                lineLength: 0
            }
        ]
        let linesIndex = 0
        for(let i=0;i<words.length;i++) {
            if(lines[linesIndex].text == "" || lines[linesIndex].lineLength + lengths[i] < 150) {
                lines[linesIndex].text += words[i]
                lines[linesIndex].lineLength += lengths[i]
            } else {
                lines.push({
                    text: words[i],
                    lineLength: lengths[i]
                })
                linesIndex += 1
            }
        }

        let maxLength = -1
        let index = 0
        for(let i=0;i<lines.length;i++) {
            if(maxLength < lines[i].lineLength) {
                maxLength = lines[i].lineLength
                index = i
            }
        }

        // width of longest word is in `maxLength`, now need to scale the width based on how high or low that word is in the circle using `index`
        const offsetY = (index - (lines.length -1) / 2) * lineHeight
        console.log(this.frontmatter.title, offsetY)
        return Math.sqrt(offsetY*offsetY + (maxLength)*(maxLength)) + 30
    }
    draw(p5:any, cursor:Cursor) {
        this.widthOffset.update()
        // draw highlighted circle (red)
        this.handleHighlight(p5)
            
        // handle hover state
        this.handleHover(p5, cursor)

        // determine node fill color
        this.setFill(p5)
        
        // draw node & display text
        p5.circle(this.x/2, this.y/2, this.width + this.widthOffset.getLerp())
        p5.fill(0)
        p5.text(this.frontmatter.title, this.x/2-150/2, this.y/2, 150)

        if(this.completed) { 
            this.drawCheck(p5)
        }
    }

    drawCheck(p5:any) {
        let cx = this.x/2 + this.width/3
        let cy = this.y/2 - this.width/3
        p5.strokeWeight(24)
        p5.line(cx, cy, cx - 25, cy - 25)
        p5.line(cx, cy, cx + 50, cy - 50)
        p5.stroke('rgb(72, 199, 116)');
        p5.strokeWeight(18)
        p5.line(cx, cy, cx - 25, cy - 25)
        p5.line(cx, cy, cx + 50, cy - 50)
        p5.strokeWeight(1)
    }
    handleHighlight(p5:any) {
        if(this.highlighted) {
            p5.fill(p5.color(0, 0, 0))
            p5.circle(this.x/2, this.y/2, this.width + 18);
        }
    }
    handleHover(p5:any, cursor:Cursor, buffer:number=0):boolean {
        let hovering = cursor.over(this, buffer)
        this.widthOffset.setTarget(hovering || this.hover ? 1 : 0)
        return hovering || this.hover
    }
    setFill(p5:any) {
        let color = this.selected? p5.color(0, 255, 0) : 255
        p5.fill(color)
    }
    toggleCompleted() {
        console.log("Marking tutorial complete...")
        this.completed = true
    }
}