<script lang='ts'>
    import Header from './Header.svelte';
    import QuickTake from '$lib/components/location/banner/QuickTake.svelte';
    import { onMount } from 'svelte';
    import QuestionHost from '$lib/components/location/QuestionHost.svelte';
    import QuestionCarousel from '$lib/components/location/banner/QuestionCarousel.svelte';
    import type { Tutorial } from '../../../../routes/map/local/elements/Tutorial';
    import { mapData } from '../../../../routes/store';
    import { faClock, faPen, faVideo } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    
    export let tutorial:Tutorial;
    export let titleSize = 24;

    let tabs:string[] = ["Overview"]
    let activeTab = 0
    onMount(() => {
        // console.log(data)
        if(tutorial.content.quick) { tabs = [...tabs, "Quick Take"] }
        // if(data.content.practice) { tabs = [...tabs, "Practice"] }
        if(tutorial.content.prompt) { tabs = [...tabs, "Prompt" ]}
    })

    const els:any = {
        "Overview": Header,
        "Quick Take": QuickTake,
        "Practice": QuestionCarousel
    }

    const icons:any = {
        "Overview": faVideo,
        "Quick Take": faClock,
        "Practice": faPen
    }
</script>

{#if tutorial}
<div class='tut-banner container'>
    <div class='hero banner pt-5'>
        <div class="hero-head pb-0">
                <div class='mt-5'>
                    <!-- <h1 class='title is-size-1'>{tutorial.frontmatter.title}</h1> -->
                    <h1 style="font-size: {titleSize}pt;" class='title control'>
                        <label class='checkbox'>
                            <input style="width: {titleSize}px; height: {titleSize}px;" type='checkbox' name='complete' bind:checked={$mapData.nodeObj[tutorial.id].completed}>
                            {tutorial.frontmatter.title}
                        </label>
                    </h1>
                    <nav class="tabs is-boxed">
                        <ul>
                            {#each tabs as tab, i}
                            <li class="{activeTab == i? 'is-active' : ''}">
                                <a on:click={() => activeTab = i}><span class='mr-3'><Fa icon={icons[tab]} /></span>{tab}</a>
                            </li>
                            {/each} 
                        </ul>
                    </nav>
                </div>
        </div>
        <div class='hero-body p-0 m-0 mb'>
            <!-- <div class='container'> -->
                <div class='body-wrap {activeTab == 0 ? 'three' : 'four'}'>
                    <div class='el-wrap'>
                        <svelte:component this={els[tabs[activeTab]]} data={tutorial} containerized={true} />
                    </div>
                </div>
            <!-- </div> -->
        </div>
    </div>
</div>
{/if}

<style lang='scss'>
    .tut-banner {
        margin-bottom: 6rem;
    }
    div.body-wrap {
        border: #dbdbdb 1px solid;
        position: relative;
        top: -1px;
        z-index: -99;
    }
    li.is-active {
        // background-color: red;
        position: relative;
        z-index: 99;
        border-bottom: 1px solid white;
    }
</style>