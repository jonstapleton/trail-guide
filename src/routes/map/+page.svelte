<script lang='ts'>
	import LocationCard from '$lib/components/location/LocationCard.svelte';
    import MapComponent from './local/Map.svelte'
    import MapPanel from './local/MapPanel.svelte';
    import PanelCard from '$lib/components/elements/PanelCard.svelte';
    import TrailList from './local/TrailList.svelte';
    import LocationList from './local/LocationList.svelte';
    import TrailInfo from './local/TrailInfo.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { Map, Tutorial, type MapDataResponse } from './local/mapNodes';
    import { mapData } from '../store';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import UrlDebugger from './local/UrlDebugger.svelte';
    import Capture from './local/Capture.svelte';

    let options = {}
    let interactable = true;
    
    let url:URL
    
    onDestroy(() => {
        interactable = false
    })
    let selectedNode:string|null
    let map:any

    function writeToURL(e:any) {
        let params = new URLSearchParams()
        if(e.open) { params.append('open', e.open.path.replace('.md', '')) }
        if(e.x && e.y) { params.append('xy', `${Math.round(e.x)},${Math.round(e.y)}`)}
        if(e.zoom) { params.append('zoom', `${e.zoom}`)}
        console.log("Writing new URL:", params.toString())
        goto(`?${params.toString()}`)
    }
    function writeToMap(params:URLSearchParams) {
        console.log("Sending directive to map...")
        if(map) { map.readEventFrom(params) }
    }

    function handleCapture(flag:boolean) {
        interactable = flag
    }
    function handleClose(name:string) {
        openPanels.splice(openPanels.indexOf(name), 1)
        openPanels = openPanels // reactive update
    }

    $: writeToMap($page.url.searchParams)
    $: console.log("Interactable:", interactable)

    let openPanels:string[] = []
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div  class='ui'>
         <!-- <UrlDebugger /> -->
        <MapPanel on:capture={(e) => handleCapture(e.detail)} bind:selected={openPanels} />
        <div class='panels'>
            <PanelCard 
                title="Projects"
                on:capture={(e) => handleCapture(e.detail)}
                on:close={(e) => handleClose(e.detail)}
                loaded={openPanels.includes('Maps')}
            >
                <TrailList />
            </PanelCard>
            <PanelCard title="Tutorials" on:capture={(e) => handleCapture(e.detail)}>
                Tutorial List
            </PanelCard>
            <PanelCard on:capture={(e) => handleCapture(e.detail)}>
                Tutorial Column
            </PanelCard>
        </div>
    </div>
    <div class='hero-body m-0 p-0'>
        <MapComponent
            bind:this={map}
            on:loaded={() => writeToMap($page.url.searchParams) }
            on:write={ (e) => writeToURL(e.detail) }
            data={$mapData}
            center={0.5}
            interact={interactable}
        />
    </div>
</section>

<style>
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