<script lang='ts'>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher } from "svelte";
    import type { Tutorial } from "./mapNodes";

    export let nodes:Tutorial[] = []
    export let selectedNode:Tutorial

    let term = ''

    let filteredNodes:Tutorial[] = []

    $: filter(term)

    function filter(term:string) {
        filteredNodes = nodes.filter((node) => {
            return  node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                    || term.length == 0 //||
                    // selectedNode.path == node.path
        })
    }
</script>

<div class='location-list'>
    <!-- Search Bar -->
    <div class='field'>
        <div class='control'>
            <input bind:value={term} class='input' type='text' placeholder="Search...">
        </div>
    </div>
    <!-- // List of nodes -->
    {#each filteredNodes as node, i}
    <LocationListItem on:select bind:selected={selectedNode} node={node} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        max-height:40rem;
        overflow-y: scroll;
        pointer-events: all;
    }
</style>