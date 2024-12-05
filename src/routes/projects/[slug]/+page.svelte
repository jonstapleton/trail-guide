<script lang='ts'>
    import { faCheck, faFire, faLocationDot, faMap, faStar } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { onMount } from "svelte";
    import {base } from '$app/paths'
    import LocationCard from "$lib/components/location/LocationCard.svelte";
    import CardWrap from "$lib/components/elements/CardWrap.svelte";
    import PanelCard from "$lib/components/elements/PanelCard.svelte";
    import Header from "$lib/components/location/banner/Header.svelte";
    import QuickTake from "$lib/components/location/banner/QuickTake.svelte";
    import { mapData } from "../../store";
    import type { Project } from "../../map/local/elements/Project";
    import TutorialBanner from "$lib/components/location/banner/TutorialBanner.svelte";
    import ProjectMap from "./ProjectMap.svelte";
    
    export let data
    let selectedNode:string; // the path of a Tutorial
    let obj:Project
    const id = 'projects/'+data.path
    onMount(() => {
        console.log('Project ID is', data.path)
        if($mapData.projectObj[id]) {
            console.log("Found project in mapData")
            obj = $mapData.projectObj[id]
            // console.log(obj.frontmatter.nodes)
            selectedNode = $mapData.projectObj[id].nodes[0].path
        }
    })
    let completed = 0;
    function countCompleted(map:any) {
        const completedNodes = map.projectObj[id].nodes.filter((obj:any) => {
            return obj.completed
        })
        return completedNodes.length
    }

    $: completed = countCompleted($mapData)
    
</script>

{#if obj}
<div class='project-header container content'>
    <!-- <div class='section content'> -->
        <h1 class='title'>
            <label class='checkbox'>
                <input bind:value={$mapData.projectObj[id].completed} class='checkbox' type='checkbox'>
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
            <a class='tag' target="_blank" href="{base}/map?open={obj.path}">View on Map<span class='ml-2'><Fa icon={faMap} /></span></a>
        </div>
        <div class='content'>
            {@html obj.content.full}
        </div>
        <ProjectMap id={id} bind:selectedNode={selectedNode} />
    <!-- </div> -->
</div>
<div class='tut-info container'>
    <!-- <Header titleSize="24" node={obj.nodes[selectedNode].id} /> -->
        <TutorialBanner tutorial={$mapData.nodesByPath[selectedNode]} />
        <div class='content tutorial'>
            <!-- <div class='section'> -->
                {#if $mapData.nodesByPath[selectedNode].content.full.length == 0}
                <p><i>We haven't written the full tutorial for this page yet! Check back soon.</i></p>
                {:else}
                {@html $mapData.nodesByPath[selectedNode].content.full}
                {/if}
            <!-- </div> -->
        </div>
</div>

{/if}

<style lang='scss'>
    .tutorial {
        margin-bottom: 10rem;
    }
    .project-header {
        margin-top: 6rem;
    }
    .completed-icon {
        position: absolute;
        color: hsl(141, 53%, 53%);
        top: -1.75rem;
        right: -10px;
    }
    .select-icon {
        position: absolute;
        color: hsl(0, 0%, 21%);
        top: -3rem;
    }
    .panel-card.horizontal {
        margin: 2rem;
        min-width: 20rem;
        max-width: 33rem;
        // max-height: 85vh;
        background-color: white;
        display: inline-block;
        position: relative;
        vertical-align: top;
        section {
            position: static;
        }
    }
    
    .title {
        font-size: 36pt;
        input {
            width: 36px;
            height: 36px;
        }
    }
    .rec {
        color: gold;
    }
    .diff-icon { color: orange }
    .meta {
        margin-bottom: 1.5rem;
        span, a {
            font-size: 12pt;
        }
    }
</style>