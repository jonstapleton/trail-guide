<script lang='ts'>
    import P5 from 'p5-svelte'
    import { onMount } from 'svelte';
    import { Camera, Cartographer, Cursor } from './utils';
    import { createEventDispatcher } from 'svelte'
    import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
    import type { Coords } from './types';
    import type { Map } from './mapNodes';

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
        y:number,
        frontmatter:object,
        selected?:boolean,
        highlighted?:boolean,
        file:string
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

    export function focus(node?:Node) {
        if(!node) {
            camera.zoom({x: camera.p5.mouseX, y: camera.p5.mouseY}, 0.5, true)   // handle camera work
            camera.setCoords({x: camera.p5.mouseX, y: camera.p5.mouseY}, center);
        } else {
            console.log("Moving camera to node...")
            node.selected = true
            // get screen coordinates for pan
            const coords = {x: node.x/2, y: node.y/2}
            const scoords = camera.getScreenCoords(coords)
            camera.zoom(scoords, 1.75, true)
            camera.setCoords(scoords, center);
        }
    }
    export function addHighlight(nodes:Node[], zoom:boolean) {
        console.log("handling highlight...")
        // let sumX = 0; let sumY = 0; let count = 0
        // for(let i=0;i<data.nodes.length;i++) {
        //     data.nodes[i].highlighted = nodes.includes('./'+data.nodes[i].file) ? true : false;
        //     if(data.nodes[i].highlighted) {
        //         sumX += data.nodes[i].x
        //         sumY += data.nodes[i].y
        //         count++
        //     }
        // }
        
        // if(nodes.length > 0 && zoom) {
        //     const avgX = sumX/count
        //     const avgY = sumY/count
        //     const coords = {x: avgX/2, y: avgY/2}
        //     const scoords = camera.getScreenCoords(coords)
        //     camera.zoom(scoords, 0.4, true)
        //     camera.setCoords(scoords, 0.66)
        // }
    }
    export function removeHighlight(nodes:Node[], zoom:boolean) {

    }
    export function zoom(nodes:Nodes[]) {
        let ysum = 0; let xsum = 0
        for(let i=0;i<nodes.length;i++) {
            ysum += nodes[i].y
            xsum += nodes[i].x
        } 
        const avgY = ysum/nodes.length
        const avgX = xsum/nodes.length
        const coords = {x: avgX/2, y: avgY/2}
        const scoords = camera.getScreenCoords(coords)
        // camera.zoom(scoords, 0.5, true)
        camera.setCoords(scoords, 0.5);
    }

    // $:console.log(interact)
    let font:any;
    export let sketch = (p5:any) => {
        p5.preload = () => {
            font = p5.loadFont('/Raleway-Regular.ttf')
        }
        p5.setup = () => {
            const c = p5.createCanvas(p5.displayWidth, p5.displayHeight*0.83)
            
            mx = p5.mouseX
            my = p5.mouseY
            cursor = new Cursor(p5);
            carto = new Cartographer(p5);
            carto.font = font
            camera = new Camera(p5, data, 0.5)

            p5.textFont(font)
            p5.textSize(28)
            p5.textWrap('WORD')
            p5.textAlign(p5.CENTER, p5.CENTER)
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
                camera.zoom({x: p5.mouseX, y: p5.mouseY}, zoom, true)   // handle camera work
                camera.setCoords({x: p5.mouseX, y: p5.mouseY}, center);
            } else {
                console.log("No new node")
                // highlight([])
            }
        }
        p5.mouseWheel = (e:any) => {
            if(!interact) { 
                return true // disable map scrolling, but allow the page to scroll 
            }
            let scaleFactor = null;
            const zoomSensitivity = 0.1
            if (e.delta < 0) {
                scaleFactor = 1 + zoomSensitivity; // Zoom in
            } else {
                scaleFactor = 1 - zoomSensitivity; // Zoom out
            }
            camera.zoom({x: camera.x, y: camera.y}, scaleFactor, false)
            return false // disable scroll on page
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