<script lang='ts'>
	import LocationCard from '$lib/components/location/LocationCard.svelte';
    import MapComponent from './local/Map.svelte'
    import MapPanel from './local/MapPanel.svelte';
    import PanelCard from '$lib/components/elements/PanelCard.svelte';
    import TrailList from './local/TrailList.svelte';
    import LocationList from './local/LocationList.svelte';
    import TrailInfo from './local/TrailInfo.svelte';
    import { onDestroy, onMount } from 'svelte';
    import type { MapDataResponse } from './local/elements/types';
    import { Map } from './local/elements/Map';
    import { Tutorial } from './local/elements/Tutorial';
    import { mapData } from '../store';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import UrlDebugger from './local/UrlDebugger.svelte';
    import Capture from './local/Capture.svelte';
    import { parseAllDocuments } from 'yaml';
    import ProjectCard from '../projects/ProjectCard.svelte';
    import TrailCard from './local/TrailPanel/TrailCard.svelte';

    let options = {}
    let interactable = true;
    
    let url:URL
    
    onDestroy(() => {
        interactable = false
    })
    let selectedNode:string|null
    let map:any

    function writeToURL(e:any) {
        console.log(e)
        let params = new URLSearchParams()
        if(e.open) {
            for(const obj of e.open) {
                params.append('open', obj.path.replace('.md', ''))
            }
        }
        if(e.x && e.y) { params.append('xy', `${Math.round(e.x)},${Math.round(e.y)}`)}
        if(e.zoom) { params.append('zoom', `${e.zoom}`)}
        if(e.close) { params.append('close', e.close) }
        console.log("Writing new URL:", params.toString())
        goto(`?${params.toString()}`)

        console.log("Updating UI elements based on URL...")
        // TODO: oh god this is terrible
        // I need to not open a panel if it's a project click, so I'm up shit creek. Terrible job.
        const panels = params.getAll('open') // open panel
        // let cleanPanels:string[] = []
        // for(const p of panels) {
        //     console.log(p.split('/'))
        //     if(p.split('/').length <= 2) { cleanPanels = [...cleanPanels, p]}
        // }
        openTutorials = updateOpenTutorials(params)
    }
    function writeToMap(params:URLSearchParams) {
        console.log("Sending directive to map...")
        if(map) { map.readEventFrom(params) }
        // openTutorials = params.getAll('open') // open panel
        openTutorials = updateOpenTutorials(params)
    }

    function updateOpenTutorials(params:any) {
        const panels = params.getAll('open') // open panel
        let cleanPanels:string[] = []
        for(const p of panels) {
            console.log(p.split('/'))
            if(!(p.split('/').length <= 2 && p.includes('projects/'))) { cleanPanels = [...cleanPanels, p]}
        }
        return cleanPanels
    }

    function handleCapture(flag:boolean) {
        interactable = flag
    }
    function handleClose(name:string) {
        openPanels.splice(openPanels.indexOf(name), 1)
        openPanels = openPanels // reactive update
        handleCapture(true)
    }
    function handleTutorialClose(obj:any) {
        console.log("Closing tutorial", obj)
        openTutorials.splice(openTutorials.indexOf(obj.name), 1)
        openTutorials = openTutorials
        handleCapture(true)
        map.close(obj.name)

        // Remove open from URL
        const openLocs = $page.url.searchParams.getAll('open')
        openLocs.splice(openLocs.indexOf(obj.name), 1)
        const newParams = $page.url.searchParams
        newParams.delete('open')
        for(const loc in openLocs) {
            newParams.append('open', loc)
        }
        goto(`?${newParams.toString()}`)
    }
    $: writeToMap($page.url.searchParams)
    
    // $: console.log("Interactable:", interactable)

    let openPanels:string[] = []
    let openTutorials:string[] = []

    $: console.log("OpenTutorials changed state!", openTutorials)
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div  class='ui'>
         <!-- <UrlDebugger /> -->
        <MapPanel on:capture={(e) => handleCapture(e.detail)} bind:selected={openPanels} />
        <div class='panels'>
            <PanelCard 
                title="Projects"
                on:capture={(e) => handleCapture(e.detail)}
                on:close={(e) => handleClose(e.detail, openPanels)}
                loaded={openPanels.includes('Maps')}
            >
                <TrailList  />
            </PanelCard>
            <PanelCard 
                title="Tutorials"
                on:capture={(e) => handleCapture(e.detail)}
                on:close={(e) => handleClose(e.detail, openPanels)}
                loaded={openPanels.includes('Tutorials')}
            >
                <LocationList on:select={(e) => writeToURL(e.detail)} selectedNodes={openTutorials} />
            </PanelCard>
            {#each openTutorials as panel}
                <!-- {#if !panel.includes('projects/')} -->
                <PanelCard
                    title={panel}
                    on:capture={(e) => handleCapture(e.detail)}
                    on:close={(e) => handleTutorialClose(e.detail)}
                >
                    <!-- {#if !panel.includes('projects/')} -->
                        <LocationCard node={panel + '.md'} />
                    <!-- {:else} -->
                        <!-- <TrailCard node={panel} /> -->
                    <!-- {/if} -->
                </PanelCard>
                <!-- {/if} -->
            {/each}
    </div>
    </div>
    <div class='hero-body m-0 p-0'>
        <MapComponent
            bind:this={map}
            on:loaded={() => writeToMap($page.url.searchParams) }
            on:write={ (e) => writeToURL(e.detail) }
            data={$mapData}
            center={openPanels.length > 0 && openTutorials.length > 0? 0.125 : 0}
            interact={interactable}
        />
    </div>
</section>

<style lang='scss'>
    .map {
        overflow: hidden;
        padding-top: 0;
    }
    .ui {
        position: absolute;
        height: 100%;
        width: 100%;
        /* background-color: blue; */
    }
    .panels {
        position: absolute;
        display: inline-block;
        /* width: 100%; */
    }
</style>