<script lang='ts'>
	import Map from './local/Map.svelte'
    import { onMount } from 'svelte';
    export let data
    

    onMount(() => {
        console.log(data)
    })
</script>
<section class='map hero is-fullheight-with-navbar'>
    <!-- <div class='ui'>
        <p>Test</p>
    </div> -->
    <div class='hero-body m-0 p-0'>
        <Map data={data} />
    </div>
</section>

<style>
    .map {
        overflow: hidden;
    }
    .ui {
        position: absolute;
        height: 50rem;
        background-color: pink;
    }
</style>