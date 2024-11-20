<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
    import { mapData } from "../../../store";
    import type { Project } from '../mapNodes';
    export let node:string

    let obj:Project;
    $: obj = $mapData.projectObj[node]

    let nodesCompleted = 0
    $: nodesCompleted = $mapData.projectObj[node].nodes.filter((obj:any) => obj.completed).length
</script>

<span data-tooltip="Completed Tutorials" class='has-tooltip-arrow tag { $mapData.projectObj[node].frontmatter.nodes? 'visible': 'invisible'}'>
    {nodesCompleted}/{obj.nodes.length}<Fa style='margin-left: 4px;' icon={faLocationDot} />
</span>

<style lang='scss'>
    .visible {
        visibility: visible;
    }
    .invisible {
        visibility: hidden;
    }
</style>