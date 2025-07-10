<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
    import { mapData } from "../../../store";

    export let node:string;
</script>

<span class={$mapData.projectObj[node].selected ? "visible": "invisible"}>
    <Fa icon={faLocationDot} />
</span>

<style>
    .visible {
        visibility: visible;
    }
    .invisible {
        visibility: hidden;
    }
</style>