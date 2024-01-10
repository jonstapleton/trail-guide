<script lang='ts'>
	import Map from '$lib/components/Map/Map.svelte'
    import { onMount } from 'svelte';
    export let data
    

    onMount(() => {
        console.log(data)
    })
</script>
<div class='map'>
    <div class='ui'>
        <p>Test</p>
    </div>
    <Map data={data} />
</div>

<style>
    .map {
        overflow: hidden;
    }
    .ui {
        position: absolute;
        height: 50rem;
        background-color: pink;
    }
    .ui > p {
    }
</style>