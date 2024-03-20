<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/store";
    import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import * as components from '$lib/components/location/directives'

    export let node:string = ''
    export let data:any;
    export let containerized = false
    export let src:string;

    let full:string = ''
    let quick:string = ''
    let loaded = false
    onMount(() => {
        console.log(src)
        if(node) {
            console.log("Loading Quick Take from id")
            loadContent(node as string)
        } else if(data) {
            console.log("Loading Quick Take from object");
            ({full, quick} = data.content);
        }
        loaded = full && quick ? true: false
    })

    function loadContent(node:string) {
        ({full, quick} = $mapData.nodeObj[node].content)
        loaded = full && quick ? true: false
    }

    $: if(node && !loaded) {loadContent(node as string)}
</script>

<div class='quick-take {containerized ? 'columns' : ''}'>
    {#if loaded}
    {@html quick && quick.length > 0 ? quick : full }
    {/if}
    <!-- <div class='end has-text-right'>
        <a class='is-italic'>
            Read Detailed Tutorial
            <span class='icon ml-1'>
                <Fa icon={faArrowUpRightFromSquare} />
            </span>
        </a>
    </div> -->
</div>

<style>
    /* .quick-take {
        width: 500px;
    } */
</style>