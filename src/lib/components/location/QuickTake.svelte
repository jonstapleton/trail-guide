<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/store";
    import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import * as components from '$lib/components/location/directives'

    export let node:string = ''
    let full:string = ''
    let quick:string = ''
    onMount(() => {
        loadContent(node as string)
    })

    function loadContent(node:string) {
        ({full, quick} = $mapData.nodeObj[node].content)
    }

    $: loadContent(node as string)
</script>

<div class='quick-take'>
    {#if $mapData.nodeObj[node]}
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

<!-- <style lang='scss'>
    a {
        color: black;
        &:hover {
            text-decoration: underline;
        }
    }
</style> -->