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

    let options = {}
    let interactable = true;
    let map:any
    let url:URL

    onDestroy(() => {
        interactable = false
    })

    function initInterface() {
        
    }

    function writeToMap(url:URLSearchParams) {
        // Create the URL object from the route params
        console.log(`Writing new params ${url.toString()} to map state...`)
        if(map) { map.readEventFrom(url) } else { console.log("Map not yet loaded...") }
    }
    function writeToURL(url:URLSearchParams, data:any) {
        console.log("Writing to URL...", data)
        $page.url.searchParams.set('xy', `${Math.round(data.x)},${Math.round(data.y)}`)
        $page.url.searchParams.set('zoom', `${Math.round(data.zoom * 100) / 100}`)
        goto(`?${$page.url.searchParams.toString()}`)
    }

    $: writeToMap($page.url.searchParams)

    

    // function closeLocationPanel() {
    //     if(selectedNode) {
    //         $mapData.nodeObj[selectedNode].selected = false
    //         selectedNode = null
    //         map.focus()
    //     }
    // }
    // let openPanel:string|null = null
    // function selectFromMap(e:any) {
    //     console.log("Select from map...")
    //     if(e.detail.data.selected) {
    //         selectedNode = e.detail.data.id
    //     } else {
    //         closeLocationPanel();
    //     }
    // }

    
    function handleCapture(e:any) {
        interactable = e.detail
    }

    // function closePanel() {
    //     openPanel = null
    // }

    // function handlePanelSelect(e:any) {
    //     console.log(e.detail.type)
    //     if(e.detail.type == 'location') {
    //         selectLocation(e)
    //     } else if(e.detail.type == 'trail') {
    //         selectTrail(e)
    //     }
    // }
    // function selectLocation(e:any) {
    //     selectedNode = e.detail.data.id
    //     $mapData.nodeObj[selectedNode].selected = true
    //     // zoom into node
    //     map.focus(e.detail.data)
    // }
    // function selectTrail(e:any) {
    //     e.detail.data.highlight()
    // }
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div  class='ui'>
        <!-- <a href="/map?xy=400,300&zoom=5">Change</a> -->
         <UrlDebugger />
        <!-- <MapPanel  bind:selected={openPanel} />
        
        <div class='panels'>
            <PanelCard on:capture={handleCapture} title={openPanel} loaded={openPanel? true:false} on:close={closePanel}>
                <svelte:component
                    this={options[openPanel].obj}
                    on:select={handlePanelSelect}
                    bind:selectedNode={$mapData.nodeObj[selectedNode]}
                />
            </PanelCard>
            
            <PanelCard on:capture={handleCapture}
                title={selectedNode? $mapData.nodeObj[selectedNode].frontmatter.title:'no title'} 
                titleSize={'large'} 
                loaded={selectedNode? $mapData.nodeObj[selectedNode].selected : false} 
                on:close={closeLocationPanel}
            >
                <LocationCard node={selectedNode} />
            </PanelCard>
        </div> -->
    </div>
    <div class='hero-body m-0 p-0'>
        <!-- <MapComponent
            bind:this={map}    
            on:nodeSelect={selectFromMap}
            data={$mapData}
            center={openPanel? 0.75 : 0.5}
            interact={interactable} 
        /> -->
        <MapComponent
            bind:this={map}
            on:loaded={() => writeToMap($page.url.searchParams) }
            on:write={ (e) => writeToURL($page.url.searchParams, e.detail) }
            data={$mapData}
            center={0.5}
            interact={interactable}
        />
        <!-- TODO: move `interactable` to be property of `map` -->
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