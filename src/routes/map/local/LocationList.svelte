<script lang='ts'>
    import LocationListItem from "./LocationListItem.svelte";

    export let nodes:object[] = []

    let term = ''
    $: filter(term)
    let filteredNodes:object[] = []

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
    <LocationListItem node={node} />
    {/each}
</div>

<style lang='scss'>
    .location-list {
        max-height:40rem;
        overflow-y: scroll;
        pointer-events: all;
    }
</style>