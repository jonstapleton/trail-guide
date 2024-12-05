<script lang='ts'>
    // import { onMount } from 'svelte';
    import Header from '$lib/components/location/banner/Header.svelte';
    import * as components from '$lib/components/location/directives' // This is what enables custom elements in tutorial bodies
    import QuickTake from '$lib/components/location/banner/QuickTake.svelte';
    import { onMount } from 'svelte';
    import QuestionHost from '$lib/components/location/QuestionHost.svelte';
    import QuestionCarousel from '$lib/components/location/banner/QuestionCarousel.svelte';
    import TutorialBanner from '$lib/components/location/banner/TutorialBanner.svelte';
    import type { Tutorial } from '../../map/local/elements/Tutorial';
    import { mapData } from '../../store';

    export let data;

    let obj:Tutorial
    let tabs:string[] = ["Overview"]
    let activeTab = 0
    const id = data.path + '.md'
    onMount(() => {
        // Load the tutorial data from $mapData based on path
        if($mapData.nodesByPath[id]) {
            console.log("Found tutorial in mapData")
            obj = $mapData.nodesByPath[id]
            console.log(obj)
        }
        if(obj.content.quick) { tabs = [...tabs, "Quick Take"] }
        // if(data.content.practice) { tabs = [...tabs, "Practice"] }
        if(obj.content.prompt) { tabs = [...tabs, "Prompt" ]}
    })

    const els = {
        "Overview": Header,
        "Quick Take": QuickTake,
        "Practice": QuestionCarousel
    }
</script>

{#if obj}
<TutorialBanner tutorial={obj} />
<div class='container content tutorial'>
    <!-- <div class='section'> -->
        {#if obj.content.full.length == 0}
        <p><i>We haven't written the full tutorial for this page yet! Check back soon.</i></p>
        {:else}
        {@html obj.content.full}
        {/if}
    <!-- </div> -->
</div>
{/if}

<style lang='scss'>
    .tab-wrap {
        border-bottom: 1px solid lightgray;
    }
    .body-wrap {
        border: 1px solid lightgray;
        &.three {
            border-radius: 0 8px 8px 8px;
        }
        &.four {
            border-radius: 8px;
        }
        position: relative;
        top: -1px;
        z-index: 0;
        // border-top: none;
        // border-radius: 8px;
    }
    .banner {
        // padding-top: 5rem;
        // padding-bottom: 5rem;
        // background-color: whitesmoke;
        // border-bottom: 4px dashed black;
    }
    .hero-head {
        // background-color: pink;
    }
    ul {
        border-bottom: 1px solid lightgray;
    }
    .is-active {
        border-bottom: 1px solid white;
        z-index:99;
    }
    .el-wrap {
        margin: 1rem 2rem;
    }
</style>
