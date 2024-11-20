<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
    import { mapData } from "../../../store";
    export let node:string

    let nodesComplete = 0
    $: nodesCompleted = $mapData.projectObj[node].nodes.filter((obj:any) => obj.completed).length
</script>

<span data-tooltip="Completed Tutorials" class='has-tooltip-arrow tag { $mapData.projectObj[node].frontmatter.nodes? 'visible': 'invisible'}'>
    {nodesCompleted}/{$mapData.projectObj[node].frontmatter.nodes && $mapData.projectObj[node].frontmatter.nodes.length > 0? $mapData.projectObj[node].frontmatter.nodes.length : 0}
    <Fa style='margin-left: 4px;' icon={faLocationDot} />
</span>

<style lang='scss'>
    .visible {
        visibility: visible;
    }
    .invisible {
        visibility: hidden;
    }
</style>