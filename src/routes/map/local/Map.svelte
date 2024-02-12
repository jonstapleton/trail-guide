<script lang='ts'>
    import P5 from 'p5-svelte'
    import { onMount } from 'svelte';
    import { Camera, Cartographer, Cursor } from './utils';
    import { createEventDispatcher } from 'svelte'
    import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
    import type { Coords } from './types';

    const dispatch = createEventDispatcher()

    let lastIndex:number|null = null
    function sendClick(data:any, index:number) {
        dispatch('nodeSelect', {
            data: data,
            index: index
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
    export let center:number = 0.5
    export let interact = true

    export function select(node:Node) {
        console.log("Moving camera to node...")
        
        // get screen coordinates for pan
        const coords = {x: node.x/2, y: node.y/2}
        const scoords = camera.getScreenCoords(coords)
        camera.zoom(scoords, 1.75, true)
        camera.setCoords(scoords, center);
    }

    // $:console.log(interact)

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
            const coords= cursor.getDrag(interact)

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
            if(!interact) { return }
            const {node, index} = cursor.click(data);
            if(node) {
                let zoom
                if(!node.selected) {
                    zoom = 0.5
                } else {
                    zoom = 1.75
                }
                sendClick(node, index) // send data to UI
                // handle camera work
                camera.zoom({x: p5.mouseX, y: p5.mouseY}, zoom, true)
                camera.setCoords({x: p5.mouseX, y: p5.mouseY}, center);
            } else {
                console.log("No new node")
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
            if(!interact) { return true }
            // camera.scale += e.delta / 1000
            // camera.scale = carto.scale < 0.125 ?  0.125:camera.scale
            let scaleFactor = null;
            const zoomSensitivity = 0.1
            if (e.delta < 0) {
                // Zoom in
                scaleFactor = 1 + zoomSensitivity;
            } else {
                // Zoom out
                scaleFactor = 1 - zoomSensitivity;
            }
            camera.zoom({x: camera.x, y: camera.y}, scaleFactor, false)
            return false
        }
    }
</script>

<div id='map' class='canvas'>
    <P5 {sketch} />
</div>

<style lang='scss'>
    .canvas {
        z-index: -99;
    }
</style>