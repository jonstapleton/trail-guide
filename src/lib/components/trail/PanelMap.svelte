<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/store";
    import type { Project } from "../../../routes/map/local/elements/Project";
    import type { Tutorial } from "../../../routes/map/local/elements/Tutorial";
    import Checkbox from "../../../routes/map/local/TrailPanel/Checkbox.svelte";
    import Recommended from "../../../routes/map/local/TrailPanel/Recommended.svelte";
    import LocationCountPill from "../../../routes/map/local/TrailPanel/LocationCountPill.svelte";
    import Difficulty from "../../../routes/map/local/TrailPanel/Difficulty.svelte";
    import LocationNavItem from "../location/LocationNavItem.svelte";
    import YouTubeEmbed from "../elements/YouTubeEmbed.svelte";

    export let selected:string; // path to an individual node
    export let project:Project
    
    function select(node:Tutorial) {
        selected = node.path
    }
</script>

{#if project}
<div class='panel'>
    <div class='panel-heading'>
        {project.frontmatter.title}
        <Recommended node={project.path} />
        <LocationCountPill node={project.path} />
        <Difficulty node={project.path} />
    </div>
    <div class="panel-block">
        <div class='block-wrap p-5'>
            <YouTubeEmbed url={project.frontmatter.video} />
            <p class='block mt-4'>{project.frontmatter.description}</p>
            <!-- TODO: -->
            <!-- <div class="control">
                <input class="input" type="text" placeholder="Search" />
            </div> -->
        </div>
    </div>
    <!-- <p class="panel-tabs">
        <a class="is-active">All</a>
        <a>Required</a>
        <a>Optional</a>
        <a>Caches</a>
    </p> -->
    {#each project.nodes as node, i}
    <a class="panel-block items {node.path == selected ? 'active':''}" on:click={() => select(node)}>
        <LocationNavItem obj={node} optional={project.optionalTutorialMask[i]} />
    </a>
    {/each}
</div>
{/if}

<style lang='scss'>
    .items {
        padding: 0.5rem 2.25rem;
    }
    .block-wrap {
        display: block;
    }
    .panel {
        max-width: 33vw;
    }
    p {
        font-size: 11pt;
    }
    .active {
        border: 4px solid;
        background-color: whitesmoke;
    }
</style>