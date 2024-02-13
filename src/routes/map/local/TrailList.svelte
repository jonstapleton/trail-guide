<script lang='ts'>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher } from "svelte";
    import TrailListItem from "./TrailListItem.svelte";

    export let nodes:object[] = []
    export let selectedNode:object;

    let term = ''

    let filteredNodes:object[] = []

    const dispatch = createEventDispatcher();

    $: filter(term)

    function filter(term:string) {
        filteredNodes = nodes.filter((node)=> {
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
    <TrailListItem node={node} selected={selectedNode} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        max-height:40rem;
        overflow-y: scroll;
        pointer-events: all;
    }
</style>