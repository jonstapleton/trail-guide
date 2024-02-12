<script lang='ts'>
    export let node = {};
</script>

<div class='location-card'>
    {#if node && node.content}
    {@html node.content}
    {node.path}
    {:else}
    <p>No content in file</p>
    {/if}
</div>