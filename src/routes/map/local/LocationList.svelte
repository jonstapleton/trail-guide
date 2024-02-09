<script lang='ts'>
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher } from "svelte";

    export let nodes:object[] = []

    let term = ''
    $: filter(term)
    let filteredNodes:object[] = []

    const dispatch = createEventDispatcher();

    function select(e:any) {
        console.log("Sending select...")
        dispatch('select', {
            data: e.detail.data
        })
    }

    function filter(term:string) {
        filteredNodes = nodes.filter((node)=> {
            return node.frontmatter.title.toLowerCase().includes(term.toLowerCase()) || term.length == 0
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
    <LocationListItem on:select={select} node={node} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        max-height:40rem;
        overflow-y: scroll;
        pointer-events: all;
    }
</style>