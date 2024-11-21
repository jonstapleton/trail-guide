<script lang='ts'>
    import {base} from '$app/paths'
    import { onMount } from 'svelte';
    import type { Tutorial } from '../../../routes/map/local/mapNodes';
    import { mapData } from '../../../routes/store';
    export let node:string
    let loaded = false

    let obj:Tutorial
    onMount(() => {
        obj = $mapData.nodesByPath[node]
    })

    function show() {
        loaded = true
    }
</script>

{#if obj}
<div class='video'>
    <div class='wrapper'>
        <iframe class={loaded ? 'visible' : 'hidden'} on:load={show} src="{obj.frontmatter.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <span class='{!loaded ? 'visible' : 'hidden'} is-loader'></span>
    </div>
    <div class='text'>
        <blockquote class='block is-italic'>{obj.frontmatter.description}</blockquote>
        <!-- TODO: <p class='block'>Watch the video to see someone demonstrate the basics, or <a href="{obj.path}">open the tutorial page to read a text version</a>.</p> -->
        <!-- TODO: <p>This concept is a part of several <a href='{base}/projects'>projects </a>; check them out!</p> -->
    </div>
</div>
{/if}
<style lang='scss'>
    iframe, .wrapper {
        width: 100%;
        height: 14rem;
        border-radius: 16px;
        // display: inline-block;
    }
    .text {
        margin-top: 1rem;
    }
    .wrapper {
        background-color: whitesmoke;
        position: relative;
    }
    span {
        margin: auto auto;
        // font-size: 5em;
        width: 5em;
        height: 5em;
        position: absolute;
        top: 4.5rem;
        left: calc(50% - 2.5em);
    }
    iframe {
        position: absolute;
    }
    .hidden {
        visibility: hidden;
    }
    .showing {
        visibility: visible;
    }
</style>