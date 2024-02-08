<script lang='ts'>
    import P5 from 'p5-svelte'
    import { onMount } from 'svelte';
    import { Camera, Cartographer, Cursor } from './utils';
    import { createEventDispatcher } from 'svelte'
    import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

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
    let camera:Camera;
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
            camera = new Camera(p5, data, 0.5)
        };

        p5.draw = () => {
            p5.background(255);

            cursor.update();
            const coords= cursor.getDrag()

            camera.display(coords, () => {
                carto.draw(data, cursor);
            })
            
            // TODO: If the cursor is over a node, draw the tooltip
            if(cursor.overNode) {
                // What content should be in the tooltip?
                    // - description
            }

        }

        p5.mouseClicked = (e:any) => {
            const selectedNode = cursor.click(data);
            if(selectedNode) {
                sendClick(selectedNode) // send data to UI
                camera.setCoords({x: p5.mouseX, y: p5.mouseY});
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
            camera.scale += e.delta / 1000
            camera.scale = carto.scale < 0.125 ?  0.125:camera.scale
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