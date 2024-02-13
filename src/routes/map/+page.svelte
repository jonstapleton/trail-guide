<script lang='ts'>
	import LocationCard from '$lib/components/location/LocationCard.svelte';
    import Map from './local/Map.svelte'
    import MapPanel from './local/MapPanel.svelte';
    import PanelCard from '$lib/components/elements/PanelCard.svelte';
    import TrailList from './local/TrailList.svelte';
    import LocationList from './local/LocationList.svelte';
    import TrailInfo from './local/TrailInfo.svelte';
    export let data

    let selectedNode:object|null
    let map:any

    function closeLocationPanel() {
        console.log("Closing panel...")
        selectedNode.selected = false
    }
    let openPanel:string|null = null
    let trailData:object;
    function handleNodeSelect(e:any) {
        // console.log("Handling node select...", e.detail.data)
        if(selectedNode) { selectedNode.selected = false } // turn off the old node
        if(!e.detail.data.frontmatter.nodes) {
            // Select a node
            e.detail.data.selected = true
            selectedNode = e.detail.data
            map.select(selectedNode) // Move the camera
        } else {
            // Highlight a series of nodes
            console.log("Event: ", e.detail)
            const nodeList = e.detail.select ? e.detail.data.frontmatter.nodes : []
            map.highlight(nodeList, e.detail.showInfo)
            if(!e.detail.showInfo && e.detail.select) {
                // zoom out if deselecting from trail menu
                map.zoom(data.nodes)
            }
            trailData = e.detail.showInfo ? e.detail.data : null
        }
        
    }

    function selectFromMap(e:any) {
        console.log("Select from map...")
        if(e.detail.data.selected) {
            selectedNode = e.detail.data
        } else {
            closeLocationPanel();
        }
    }

    const options = {
        "Locations": {
            obj: LocationList,
            data: data.nodes
        },
        "Trails": {
            obj: TrailList,
            data: data.projects
        }
    }

    let interactable = true;
    function handleCapture(e:any) {
        interactable = e.detail
    }

    function closePanel() {
        map.highlight([])
        openPanel = null
    }
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div  class='ui'>
        <MapPanel  bind:selected={openPanel} />
        
        <div class='panels' role='none'>
            <PanelCard on:capture={handleCapture} title={openPanel} loaded={openPanel? true:false} on:close={closePanel}>
                <!-- {#if trailData}
                <TrailInfo trail={trailData} />
                {/if} -->
                <svelte:component on:select={handleNodeSelect} this={options[openPanel].obj} nodes={options[openPanel].data} selectedNode={selectedNode} />
                
            </PanelCard>
            
            
            <!-- Location panel is a special case since it gets input from the map -->
            <PanelCard on:capture={handleCapture} title={selectedNode? selectedNode.frontmatter.title:'no title'} titleSize={'large'} loaded={selectedNode? selectedNode.selected : false} on:close={closeLocationPanel}>
                <LocationCard node={selectedNode} />
            </PanelCard>
        </div>
    </div>
    <div class='hero-body m-0 p-0'>
        <Map
            bind:this={map}    
            on:nodeSelect={selectFromMap} 
            data={data}
            center={openPanel? 0.75 : 0.5}
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