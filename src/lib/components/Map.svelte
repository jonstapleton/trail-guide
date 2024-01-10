<script lang='ts'>
    import P5 from 'p5-svelte'
    import { onMount } from 'svelte';

    interface Node {
        x:number,
        y:number
    }

    interface Map {
        nodes:Node[],
        edges:object[]
    }
    let space = false
    let mx:number, my:number
    let offsetX = 0
    let offsetY = 0
    
    export let data:Map
    export let sketch = (p5:any) => {
        p5.setup = () => {
            p5.createCanvas(p5.displayWidth, p5.displayHeight * 0.88)
            mx = p5.mouseX
            my = p5.mouseY
        };

        p5.draw = () => {
            p5.background(255);
            if(space && p5.mouseIsPressed) {
                p5.cursor('grabbing')
                mx = p5.mouseX + offsetX
                my = p5.mouseY + offsetY
            }
            p5.push()
            p5.translate(mx, my)
            p5.scale(0.5)
            for(let i=0;i<data.nodes.length;i++) {
                const node = data.nodes[i]
                // p5.rect(node.x/2, node.y/-2, node.width/2, node.height/2, 15, 15)
                p5.circle(node.x/2, node.y/-2, 10)
                
            }
            p5.pop()
        }

        p5.keyPressed = (e:any) => {
            if(e.key == ' ') {
                space = true
                p5.cursor('grab')
                offsetX = mx - p5.mouseX
                offsetY = my - p5.mouseY
            }
        }
        p5.keyReleased = (e:any) => {
            if (e.key == ' ') {
                space = false
                p5.cursor(p5.ARROW)
            }
        }
    }
</script>

<div class='canvas'>
    <P5 {sketch} />
</div>

<style>
    .canvas {
        height: 100%;
        overflow: hidden;
    }
</style>