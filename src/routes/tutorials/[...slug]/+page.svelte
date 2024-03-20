<script lang='ts'>
    // import { onMount } from 'svelte';
    import Header from './Header.svelte';
    import * as components from '$lib/components/location/directives' // This is what enables custom elements in tutorial bodies
    import QuickTake from '$lib/components/location/QuickTake.svelte';
    import { onMount } from 'svelte';
    import QuestionHost from '$lib/components/location/QuestionHost.svelte';
    import QuestionCarousel from '$lib/components/location/QuestionCarousel.svelte';
    
    export let data;

    let tabs:string[] = ["Overview"]
    let activeTab = 0
    onMount(() => {
        // console.log(data)
        if(data.content.quick) { tabs = [...tabs, "Quick Take"] }
        if(data.content.practice) { tabs = [...tabs, "Practice"] }
        if(data.content.prompt) { tabs = [...tabs, "Prompt" ]}
    })

    const els = {
        "Overview": Header,
        "Quick Take": QuickTake,
        "Practice": QuestionCarousel
    }
</script>

<div class='hero banner pt-5'>
    <div class="hero-head pb-0">
            <div class='container mt-5'>
                <h1 class='title is-size-1'>Link Passages</h1>
                <nav class="tabs is-boxed">
                    <ul>
                        {#each tabs as tab, i}
                        <li class="{activeTab == i? 'is-active' : ''}">
                            <a on:click={() => activeTab = i}>{tab}</a>
                        </li>
                        {/each} 
                    </ul>
                </nav>
                
            </div>
    </div>
    <div class='hero-body pt-0 mt-0'>
        <div class='container'>
            <div class='body-wrap {activeTab == 0 ? 'three' : 'four'}'>
                <div class='el-wrap'>
                    <!-- <Header data={data} /> -->
                    <svelte:component this={els[tabs[activeTab]]} data={data} containerized={true} />
                </div>
            </div>
        </div>
    </div>
    
</div>
<div class='container content tutorial'>
    <!-- <div class='section'> -->
        {@html data.content.full}
    <!-- </div> -->
</div>

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
