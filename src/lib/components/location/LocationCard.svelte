<script lang='ts'>
    import { onMount } from "svelte";
    import type { Tutorial } from "../../../routes/map/local/mapNodes";
    import Video from "./Video.svelte";
    import { faArrowUpRightFromSquare, faCircleQuestion, faGaugeSimpleHigh, faPenToSquare, faPencil, faSquare, faSquareCheck, faVideo } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { mapData } from "../../../routes/store";
    import QuickTake from "./QuickTake.svelte";
    import QuestionHost from "./QuestionHost.svelte";
    import { base } from '$app/paths'

    export let node:string|null;
    export let exclude:string[] = []
    let tabs = ["Quick Take"]
    let obj:Tutorial
    export let tabClass = 'onMap'

    onMount(() => {
        loadCard(node as string)
    })

    function loadCard(node:string) {
        obj = $mapData.nodeObj[node]
        // console.log(obj)
        tabs = ["Quick Take"]
        if(obj.frontmatter.video && !exclude.includes("Video"))   { tabs = [...tabs, "Video"]    }
        if(obj.content.practice && !exclude.includes("Practice"))    { tabs = [...tabs, "Practice"] }
        if(obj.content.prompt && !exclude.includes("Prompt"))      { tabs = [...tabs, "Prompt"]   } 
        console.log(tabs)
    }

    $: loadCard(node as string)

    let openTab = tabs[0]
    const objs:any = {
        "Quick Take": {
            component: QuickTake,
            icon: faGaugeSimpleHigh
        },
        "Video": {
            component: Video,
            icon: faVideo
        },
        "Practice": {
            component: QuestionHost,
            icon: faCircleQuestion
        },
        "Prompt": {
            icon: faPencil
        }
    }

    function select(i:string) {
        openTab = i
    }
</script>

<div class='location-card'>
    {#if tabs.length > 1}
    <div class="tabs is-boxed is-fullwidth">
        <ul class='m-0'>
        {#each tabs as tab, i}
            <li class="{tab == openTab ? 'is-active' : ''} {tabClass}">
                <a on:click={() => select(tab)}>
                    <Fa icon={objs[tab].icon} class='mr-2' />
                    {tab}
                </a>
            </li>
        {/each}
        </ul>
    </div>
    {/if}
    <div class='body content'>
        <svelte:component this={objs[openTab].component} node={ node }></svelte:component>
    </div>
    <hr>
    {#if obj}
    <div class='buttons is-centered is-fullwidth'>
        <a href={base+'tutorials/'+obj.path.replace('.md', '')} target='_blank' class='button is-fullwidth'>
            Read Detailed Tutorial
            <span class='icon ml-1'><Fa icon={faArrowUpRightFromSquare} /></span>
        </a>
        <button on:click={() => $mapData.nodeObj[node].completed = !$mapData.nodeObj[node].completed} class='button is-success is-fullwidth'>
            <span class='icon mr-1'><Fa icon={$mapData.nodeObj[node].completed ? faSquareCheck : faSquare} /></span>
            Mark as Completed
        </button>
        
    </div>
    {/if}
</div>

<style lang='scss'>
    li.onMap {
        border-bottom: 1px solid hsl(0, 0%, 86%);
    }
</style>