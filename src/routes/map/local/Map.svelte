<script lang='ts'>
    // import P5 from 'p5-svelte'
    import P5 from './P5.svelte'
    import { onDestroy, onMount } from 'svelte';
    import { Camera, Cartographer, Cursor, getLocalCoords } from './utils';
    import { createEventDispatcher } from 'svelte'
    import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
    import type { Coords } from './types';
    import type { Map } from './elements/Map';
    import { mapData } from '../../store';

    /* API for map interactions
    | Method Name        | Description 
    | ------------------ | -------------------------------------------------------- 
    | Map.event(url:URL) | Write to map state from a URL object based on parameters
    */

    let sketch = (p5:any) => {
    };
    let mapEl;
    onMount(() => {
        sketch = mapSketch
    })

    onDestroy(() => {
        console.log("Unmounting map...")
        // if(mapEl) { mapEl.$destroy() }
    })

    const dispatch = createEventDispatcher()

    let lastIndex:number|null = null
    function sendClick(data:any, index:number) {
        dispatch('write', {
            open: data
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
    let cursor:Cursor;
    let camera:Camera;
    let carto:Cartographer;
    let mx:number, my:number;

    export let data:Map
    export let center:number = 0.5
    export let interact = true

    // $: updateCenter(center)

    function updateCenter(factor:number) {
        if(camera) { camera.setCenter(factor) }
    }

    export function readEventFrom(params:URLSearchParams) {
        console.log("Got call to read params...")
        if(params.has('open')) {
            open(params.getAll('open'), params)
        } else {
            $mapData.deselectAll()
        }
        if(params.has('xy')) {
            const str:string = params.get('xy') as string
            const comma = str.indexOf(',')
            const x = Number(str.substring(0, comma))
            const y = Number(str.substring(comma+1, str.length))
            if(isNaN(x) || isNaN(y)) {
                console.error(`Invalid coordinates ${x}, ${y}.`)
            }
            camera.moveCenterTo({x: x, y: y})
        }
        if(params.has('zoom')) {
            const scale = Number(params.get('zoom'))
            camera.zoom({x: camera.ix, y: camera.iy}, scale, true)
        }
    }

    function open(paths:string[], params:URLSearchParams) {
        if(paths.length == 0) { params.delete('open'); return } else {
            for(const path of paths) {
                const node = data.nodesByPath[path + '.md']
                node.select()
            }
            // TODO: Zoom in on the last path selected, for now
            const coords = data.nodesByPath[paths[paths.length-1] + '.md'].getCoords()
            const location = camera.getScreenCoords({x: coords.x/2, y: coords.y/2}, center)
            camera.moveCenterTo(location)
        }
    }
    export function close(path:string) {
        const node = data.nodesByPath[path + '.md']
        node.selected = false
        camera.zoom({x: camera.ix, y: camera.iy}, 0.5, true)
    }

    export function focus(node?:Node) {
        if(!node) {
            
        } else {
            console.log("Moving camera to node...")
            node.selected = true
            // get screen coordinates for focus TODO:
        }
    }

    let font:any;
    let icons:any;
    let mapSketch = (p5:any) => {
        p5.preload = () => {
            font = p5.loadFont('/Raleway-Regular.ttf')
            icons = p5.loadFont('/icons.otf')
            data.setSketchContext(p5)
            
        }
        p5.setup = () => {
            const c = p5.createCanvas(p5.displayWidth, p5.displayHeight*0.83)

            for(const node of data.nodes) {
                node.setWidth(p5, font)
                node.setFonts(font, icons)
            }
            
            mx = p5.mouseX
            my = p5.mouseY
            cursor = new Cursor(p5);
            carto = new Cartographer(p5);
            carto.font = font
            carto.icons = icons
            camera = new Camera(p5, data, 0.5)

            p5.textFont(font)
            p5.textSize(28)
            p5.textWrap('WORD')
            p5.textAlign(p5.CENTER, p5.CENTER)

            dispatch('loaded')
        };

        p5.draw = () => {
            p5.background(255);
            
            camera.display(() => {
                carto.draw(data, cursor);
                cursor.update(camera.matrix);
            })

            const offsetCoords = cursor.getDrag(interact)
            let lerpComplete = camera.offsetTransform(offsetCoords)
            // if(lerpComplete) {
            //     console.log("Lerp complete! Writing to url...") 
            //     const point = camera.getLocalCoords({x: camera.ix, y: camera.iy})
            //     dispatch('write', { x: point.x, y: point.y }) 
            // }
        }

        p5.mouseClicked = (e:any) => {
            if(!interact) { return }
            const {node, index} = cursor.click(data);
            if(node) {
                let zoom
                if(!node.selected) {
                    zoom = 0.5
                    dispatch('write', {
                        // zoom: zoom 
                    })
                    camera.zoom({x: camera.ix, y: camera.iy}, zoom, true)
                } else {
                    zoom = 1.75
                    dispatch('write', {
                        open: [node],
                        zoom: zoom 
                    })
                }
            } else {
                console.log("No new node")
                // dispatch('write', {})
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
            camera.zoom({ x: cursor.mx, y: cursor.my}, scaleFactor, false)
            return false // disable scroll on page
        }
    }
</script>

<div id='map' class='canvas'>
    <P5 bind:this={mapEl} sketch={sketch} debug={true} />
</div>

<style lang='scss'>
    .canvas {
        z-index: -99;
    }
</style>