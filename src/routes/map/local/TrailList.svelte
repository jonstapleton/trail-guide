<script lang='ts'>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import TrailListItem from "./TrailListItem.svelte";
    import { mapData } from "../../store";
    import type { Project } from "./mapNodes";

    // export let selectedNode:string;
    export let locs:object[] = []

    let term = ''

    let filteredNodes:Project[] = []

    const dispatch = createEventDispatcher();

    $: filter(term)

    

    function filter(term:string) {
        
        filteredNodes = $mapData.projects.filter((node:Project)=> {
            return  node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                    || term.length == 0 //||
                    || node.selected
                    // selectedNode.path == node.path
        })
        filteredNodes = filteredNodes.toSorted((a:Project,b:Project) => {
            return a.difficulty - b.difficulty
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
    <TrailListItem on:select node={node.id} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        // max-height:40rem;
        overflow-y: scroll;
        // pointer-events: all;
    }
</style>