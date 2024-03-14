<script lang='ts'>
    import { faCheck, faFire, faLocationDot, faMap, faStar } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { onMount } from "svelte";
    import {base } from '$app/paths'
    import LocationCard from "$lib/components/location/LocationCard.svelte";
    import CardWrap from "$lib/components/elements/CardWrap.svelte";
    import PanelCard from "$lib/components/elements/PanelCard.svelte";
    import Header from "$lib/components/location/Header.svelte";
    import QuickTake from "$lib/components/location/QuickTake.svelte";
    import { mapData } from "../../store";
    
    export let data
    let selectedNode = 0;
    let obj:any = data
    const id = 'projects/'+data.path
    onMount(() => {
        console.log('Project ID is', data.path)
        if($mapData.projectObj[id]) {
            console.log("Found project in mapData")
            obj = $mapData.projectObj[id]
            // console.log(obj.frontmatter.nodes)
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

<div class='container'>
    <div class='section content'>
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
                Completed: {completed} / {obj.frontmatter.nodes.length}
            </span>
            <a class='tag' target="_blank" href="{base}/map">View on Map<span class='ml-2'><Fa icon={faMap} /></span></a>
        </div>
        <div class='content'>
            {@html obj.content.full}
        </div>
        <div class='level nodes'>
            {#each $mapData.projectObj[id].nodes as node, i}
            <a on:click={() => selectedNode = i} class='level-item {i == 0? 'first':''} {i==obj.frontmatter.nodes.length-1? "last":''}'>
                {#if selectedNode == i}
                    <span class='select-icon'><Fa size="2x" icon={faLocationDot} /></span>
                {/if}
                <p>{node.frontmatter.title}</p>
                {#if node.completed}
                <span class='completed-icon'><Fa size="3x" icon={faCheck} /></span>
                {/if}
            </a>
            {/each}
        </div>
        <div class='cards'>
            <Header titleSize="24" node={obj.nodes[selectedNode].id} />
            <hr>
            <div class='p-5'>
                <LocationCard tabClass={'onTrail'} exclude={["Video"]} node={obj.nodes[selectedNode].id} />
            </div>
        </div>
    </div>
</div>

<style lang='scss'>
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
    .nodes {
        background: linear-gradient(to bottom, white calc(50% - 3px), black calc(50% - 3px) calc(50% + 3px), white calc(50% + 3px));
        margin-top: 5rem;
        margin-bottom: 4rem;
        & > a {
            background-color: hsl(0, 0%, 21%);
            color: white;
            margin: 0.5rem 0.5rem;
            border-radius: 8px;
            height: 3rem;
            border: 3px solid hsl(0, 0%, 21%);
            position: relative;
            p {
                color: white
            }
            &.first { margin-left: 0 }
            &.last { margin-right: 0 }
            &:hover {
                background-color: white;
                color: black;
                border: 3px dashed black;
                cursor: pointer;
                p {
                    color: black;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .nodes {
            background: linear-gradient(#000, #000) no-repeat center/6px 100%;
            & > a.first, & > a.last {
                margin: 0.5rem 0.5rem;
            }
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