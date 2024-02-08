<script lang='ts'>
    import LocationListItem from "./LocationListItem.svelte";

    export let nodes:object[] = []
</script>

<div class='location-list'>
    {#each nodes as node, i}
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