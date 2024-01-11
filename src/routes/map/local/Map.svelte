<script lang='ts'>
    import P5 from 'p5-svelte'
    import { onMount } from 'svelte';
    import { Cartographer, Cursor } from './utils';
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    function sendClick(data:any) {
        dispatch('nodeSelect', {
            data: data
        })
    }

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
    let cursor:Cursor;
    let carto:Cartographer;
    let canvas;

    export let data:Map

    export let sketch = (p5:any) => {
        p5.setup = () => {
            p5.createCanvas(p5.displayWidth, p5.displayHeight*0.83)
            mx = p5.mouseX
            my = p5.mouseY
            cursor = new Cursor(p5);
            carto = new Cartographer(p5);
        };

        // TODO: optimize
        p5.draw = () => {
            p5.background(255);

            cursor.update();
            
            const coords = cursor.getOffset();
            // if coords is null, it means we've finished dragging
            coords ? carto.move(coords.x, coords.y) : carto.lock()
            carto.draw(data, cursor);

        }

        p5.mouseClicked = (e:any) => {
            const selectedNode = cursor.click(data);
            if(selectedNode) {
                sendClick(selectedNode)
            }
        }

        p5.keyPressed = (e:any) => {
            if(e.key == ' ') {
                cursor.addKey('space')
            }
        }
        p5.keyReleased = (e:any) => {
            if (e.key == ' ') {
                cursor.removeKey('space')
            }
        }
        p5.mouseWheel = (e:any) => {
            carto.scale += e.delta / 1000
            carto.scale = carto.scale < 0.125 ?  0.125:carto.scale
        }
    }
</script>

<div class='canvas'>
    <P5 {sketch} />
</div>

<style>
    .canvas {
        z-index: -99;
    }
</style>