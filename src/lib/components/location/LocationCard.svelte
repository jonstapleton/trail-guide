<script lang='ts'>
    import { onMount } from "svelte";
    import type { Tutorial } from "../../../routes/map/local/mapNodes";
    import Video from "./Video.svelte";
    import { faArrowUpRightFromSquare, faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { mapData } from "../../../routes/map/store";
    import QuickTake from "./QuickTake.svelte";

    export let node:string|null;

    let obj:Tutorial
    onMount(() => {
        obj = $mapData.nodeObj[node]
    })

    const tabs = ["Quick Take", "Video", "Practice", "Prompt"]
    let openTab = tabs[0]
    const objs:any = {
        "Quick Take": QuickTake,
        "Video": Video,
        "Practice": null,
        "Prompt": null
    }

    function select(i:string) {
        openTab = i
    }
</script>

<div class='location-card'>
    <div class="tabs is-boxed is-fullwidth">
        <ul>
        {#each tabs as tab, i}
            <li class={tab == openTab ? 'is-active' : ''}><a on:click={() => select(tab)}>{tabs[i]}</a></li>
        {/each}
        </ul>
      </div>
    <div class='body content'>
        <svelte:component this={objs[openTab]} node={ node } />
    </div>
    <hr>
    {#if obj}
    <div class='buttons is-centered'>
        <button on:click={() => $mapData.nodeObj[node].completed = !$mapData.nodeObj[node].completed} class='button is-success'>
            <span class='icon mr-1'><Fa icon={$mapData.nodeObj[node].completed ? faSquareCheck : faSquare} /></span>
            Mark as Complete
        </button>
        <button class='button'>
            Open in New Tab
            <span class='icon ml-1'><Fa icon={faArrowUpRightFromSquare} /></span>
        </button>
    </div>
    {/if}
</div>

<style>
    li {
        border-bottom: 1px solid hsl(0, 0%, 86%);
    }
</style>