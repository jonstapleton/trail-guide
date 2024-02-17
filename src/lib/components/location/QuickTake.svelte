<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/map/store";

    export let node:string = ''
</script>

<div class='quick-take'>
    {#if $mapData.nodeObj[node]}
    {@html $mapData.nodeObj[node].content.quick}
    {/if}
</div>