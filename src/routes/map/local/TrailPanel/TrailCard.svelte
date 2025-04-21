<script lang='ts'>
import { mapData } from "../../../store";
import {base} from '$app/paths'
import NumberPill from "$lib/components/elements/NumberPill.svelte";
    import type { Project } from "../elements/Project";
    import Fa from 'svelte-fa'
    import { faStar, faFire, faMap } from "@fortawesome/free-solid-svg-icons";

    export let node:string // path to project index.md
    const obj:Project = $mapData.projectObj[node]

    let completed = 0
    $: completed = obj.getCompleted().length
</script>

<div class='trail-card'>
            <h1 class='title is-2'>
                <label class='checkbox'>
                    <input bind:value={$mapData.projectObj[node].completed} class='checkbox' type='checkbox'>
                    {obj.frontmatter.title}
                    {#if obj.frontmatter.recommended}
                    <span class='ml-2 rec'><Fa icon={faStar} /></span>
                    {/if}
                </label>
            </h1>
            <div class='meta'>
                <span class='tag'>
                    <span style="margin-right: 0.5rem;">Difficulty:</span> 
                    {#each {length: obj.frontmatter.difficulty} as _}
                        <span class='diff-icon'><Fa icon={faFire} /></span>
                    {/each}
                </span>
                <span class='tag'>
                    Completed: {completed} / {obj.nodes.length}
                </span>
                <!-- <a class='tag' target="_blank" href="{base}/map?open={obj.path}">View on Map<span class='ml-2'><Fa icon={faMap} /></span></a> -->
            </div>
            <div class='video'>
                <iframe src="{obj.frontmatter.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
           
</div>
<div class="tabs is-boxed is-fullwidth mt-3">
    <ul class='m-0'>
        <li class='is-active'><a>Project Overview</a></li>
        <li><a>Related Tutorials <NumberPill number='{obj.getCompleted().length} / {obj.nodes.length}' /></a></li>
    </ul>
</div>
<div class='trail-card-body'>
    <div class='content'>
        {@html obj.content.full}
    </div>
</div>

<style lang='scss'>
    li {
        border-bottom: 1px solid hsl(0, 0%, 86%);
    }
    .trail-card {
        // position: relative;
    }
    .rec {
        color: gold;
    }
    .diff-icon { color: orange }
    .title {
        /* font-size: 36pt; */
        input {
            width: 32px;
            height: 32px;
        }
    }
    .meta {
        margin-bottom: 1.5rem;
        span, a {
            font-size: 12pt;
        }
    }
    .video {
        // padding: 5rem 5rem;
        // position: relative;
    }
    .video iframe {
        border: 0;
        min-height: 15rem;
        left: 0;
        // position: absolute;
        top: 0;
        width: 100%;
        border-radius: 12px;
        // margin: 1rem 1rem;
        /* min-width: 10rem; */
    }
    .trail-card-body {
        padding: 0 1rem;
    }
</style>