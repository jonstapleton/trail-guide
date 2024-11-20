<script lang='ts'>
    import { mapData } from "../../../store";
    import Fa from 'svelte-fa'
    import { faStar } from "@fortawesome/free-solid-svg-icons";
    export let node:string
</script>

{#if $mapData.projectObj[node].frontmatter.recommended}
    <span style='color: gold' class='ml-2'><Fa icon={faStar} /></span>
{/if}