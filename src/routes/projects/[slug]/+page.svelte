<script lang='ts'>
    import { faCheck, faChevronDown, faFire, faLocationDot, faMap, faStar } from "@fortawesome/free-solid-svg-icons";
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
    import ProjectMap from "$lib/components/trail/ProjectMap.svelte";
    import Video from "$lib/components/location/Video.svelte";
    import PanelMap from "$lib/components/trail/PanelMap.svelte";
    
    export let data

    let showInfo = true;
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
    function countCompleted(map:any, id:string) {
        return map.getProjectByPath(id).getCompleted().length
    }

    $: completed = countCompleted($mapData, id)
    
</script>

{#if obj}
<div class='columns'>
    <div class='column is-desktop is-narrow'>
        <div class='sticky-wrapper'>
            <PanelMap project={$mapData.projectObj[id]} bind:selected={selectedNode} />
        </div>
    </div>
    <div class='column'>
        <div class='section'>
            <!-- TODO: -->
            <!-- <div class='buttons container'>
                <button class='button'>Previous Tutorial</button>
                <button class='button is-success'>Next Tutorial</button>
            </div> -->
                <!-- <Header titleSize="24" node={obj.nodes[selectedNode].id} /> -->
            <TutorialBanner tutorial={$mapData.nodesByPath[selectedNode]} />
            <div class='content tutorial container'>
                {#if $mapData.nodesByPath[selectedNode].content.full.length == 0}
                    <p><i>We haven't written the full tutorial for this page yet! Check back soon.</i></p>
                {:else}
                    {@html $mapData.nodesByPath[selectedNode].content.full}
                {/if}
            </div>
        </div>
    </div>
</div>
{/if}

<style lang='scss'>
    .nav-wrap {
        margin-left: 6rem;
    }
    .sticky-wrapper {
        position: sticky;
    }
    .divider {
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        align-content: center;
        justify-content: center;
        border-bottom: 1px solid black;
        // animation: float 2s ease-in-out infinite;
        @keyframes float {
            0% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-15px);
            }

            100% {
                transform: translateY(0);
            }
        }
    }
    .video {
        // padding: 5rem 5rem;
        position: relative;
    }
    .video iframe {
        border: 0;
        height: 92%;
        left: 0;
        position: absolute;
        top: 0;
        width: 92%;
        border-radius: 12px;
        margin: 1rem 1rem;
        /* min-width: 10rem; */
    }
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