<script lang='ts'>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import TrailListItem from "./TrailListItem.svelte";
    import type { Nodes } from "rehype-format/lib";

    export let nodes:object[] = []
    export let selectedNode:object;
    export let locs:object[] = []

    let term = ''

    let filteredNodes:object[] = []

    const dispatch = createEventDispatcher();

    function select(e:any) {
        dispatch('select', e.detail)
    }

    $: filter(term)

    function filter(term:string) {
        filteredNodes = nodes.filter((node)=> {
            return  node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                    || term.length == 0 //||
                    || node.selected
                    // selectedNode.path == node.path
        })
    }
</script>

<div class='trail-list'>
    <!-- Search Bar -->
    <div class='field'>
        <div class='control'>
            <input bind:value={term} class='input' type='text' placeholder="Search...">
        </div>
    </div>
    <!-- // List of nodes -->
    {#each filteredNodes as node, i}
    <TrailListItem on:select={select} node={node} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        // max-height:40rem;
        overflow-y: scroll;
        // pointer-events: all;
    }
</style>