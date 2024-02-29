<script lang='ts'>
    import { faFire, faLocationDot, faMap, faStar } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { onMount } from "svelte";
    import {base } from '$app/paths'
    import LocationCard from "$lib/components/location/LocationCard.svelte";
    import CardWrap from "$lib/components/elements/CardWrap.svelte";
    import PanelCard from "$lib/components/elements/PanelCard.svelte";
    import Header from "$lib/components/location/Header.svelte";
    import QuickTake from "$lib/components/location/QuickTake.svelte";
    
    export let data
    let selectedNode = 0;
    onMount(() => {
        console.log(data)
    })
</script>

<div class='container'>
    <div class='section content'>
        <h1 class='title'>
            <label class='checkbox'>
                <input class='checkbox' type='checkbox'>
                {data.frontmatter.title}<span class='ml-2 rec'><Fa icon={faStar} /></span>
            </label>
        </h1>
        <div class='meta'>
            <span class='tag'>
                <span style="margin-right: 0.5rem;">Difficulty:</span> 
                {#each {length: data.frontmatter.difficulty} as _}
                    <span class='diff-icon'><Fa icon={faFire} /></span>
                {/each}
            </span>
            <span class='tag'>
                Completed: 0 / {data.frontmatter.nodes.length}
            </span>
            <a class='tag' target="_blank" href="{base}/map">View on Map<span class='ml-2'><Fa icon={faMap} /></span></a>
        </div>
        <div class='content'>
            {@html data.content.full}
        </div>
        <div class='level nodes'>
            {#each data.frontmatter.nodes as node, i}
            <div class='level-item {i == 0? 'first':''} {i==data.frontmatter.nodes.length-1? "last":''}'>
                {#if selectedNode == i}
                    <span class='select-icon'><Fa size="2x" icon={faLocationDot} /></span>
                {/if}
                <a on:click={() => selectedNode = i}>{node.frontmatter.title}</a>
            </div>
            {/each}
        </div>
        <div class='cards'>
            <Header titleSize="24" node={data.frontmatter.nodes[selectedNode]} />
            <hr>
            <div class='p-5'>
                <LocationCard tabClass={'onTrail'} exclude={["Video"]} node={data.frontmatter.nodes[selectedNode].id} />
            </div>
        </div>
    </div>
</div>

<style lang='scss'>
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
        & > div {
            background-color: hsl(0, 0%, 21%);
            color: white;
            margin: 0.5rem 0.5rem;
            border-radius: 8px;
            height: 3rem;
            border: 3px solid hsl(0, 0%, 21%);
            position: relative;
            a {
                color: white
            }
            &.first { margin-left: 0 }
            &.last { margin-right: 0 }
            &:hover {
                background-color: white;
                color: black;
                border: 3px dashed black;
                cursor: pointer;
                a {
                    color: black;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .nodes {
            background: linear-gradient(#000, #000) no-repeat center/6px 100%;
            & > div.first, & > div.last {
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