<script lang='ts'>
	import LocationCard from '$lib/components/location/LocationCard.svelte';
import TrailPanel from '$lib/components/trail/TrailPanel.svelte';
import Map from './local/Map.svelte'
    import { onMount } from 'svelte';
    export let data

    let panelData:any

    onMount(() => {
        console.log(data)
    })
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div class='ui'>
        <!-- <TrailPanel /> -->
        <LocationCard nodeInfo={panelData} />
    </div>
    <div class='hero-body m-0 p-0'>
        <Map on:nodeSelect={(e) => { panelData = e.detail.data }} data={data} />
    </div>
</section>

<style>
    .map {
        overflow: hidden;
    }
    .ui {
        position: absolute;
        /* height: 50rem; */
        background-color: white;
    }
</style>