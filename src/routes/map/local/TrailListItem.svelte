<script lang='ts'>
    import { base } from "$app/paths";
    import { mapData } from "../../store";
    import { onDestroy, onMount } from "svelte";
    import type { Project } from "./elements/Project";
    import LocationCountPill from "./TrailPanel/LocationCountPill.svelte";
    import Checkbox from "./TrailPanel/Checkbox.svelte";
    import Recommended from "./TrailPanel/Recommended.svelte";
    import Difficulty from "./TrailPanel/Difficulty.svelte";
    import Open from "./TrailPanel/Open.svelte";
    import Selected from "./TrailPanel/Selected.svelte";
    import Video from "$lib/components/location/Video.svelte";
    import YouTubeEmbed from "$lib/components/elements/YouTubeEmbed.svelte";
    import SaveToBackpack from "$lib/components/elements/SaveToBackpack.svelte";

    export let node:string
    export let backpack:'save'|'delete' = 'save'

    let obj:Project

    let route = `${base}/map?open=${node}`
    let destination = route

    $: obj = $mapData.projectObj[node]
    onMount(() => {
        obj = $mapData.projectObj[node]
    })

    onDestroy(() => {
        // console.log("Destroying", obj.frontmatter.title)
        obj.deselect()
    })

    function toggleRoute() {
        setTimeout(() => {
            if(destination == `${base}/map`) {
                destination = route
            } else {
                destination  = `${base}/map`
            }
        }, 100)
    }

    function select() {
        const obj = $mapData.projectObj[node]
        obj.highlight()
    }
    function deselect() {
        const obj = $mapData.projectObj[node]
        obj.dehighlight()
    }

    

</script>

{#if obj}
<div class='trail-list-item'>
    <span
        on:mouseenter={select} 
        on:mouseleave={deselect} 
    >
        <Checkbox node={node} />
        <a
            on:click={toggleRoute} 
            href="{destination}"
        >{obj.frontmatter.title}</a>
        
        <Recommended node={node} />
        <LocationCountPill node={node} />
        <Difficulty node={node} />
        <SaveToBackpack status={backpack} short={true} element={obj.path+'/index.md'} />
        <Open node={node} />
        
        <!-- <Selected node={node} /> -->
</span>
    {#if destination != route}
    <div class='trail-info'>
        {#if obj.frontmatter.video}
        <YouTubeEmbed url={obj.frontmatter.video} />
        {/if}
        <p class='block'>{obj.frontmatter.description}</p>
        <hr style="color: black;">
    </div>
    {/if}
</div>
{/if}

<style lang='scss'>
    span {
        padding-top: 1rem;
        padding-bottom: 0.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        display: flex;
    }
    .trail-list-item:hover {
        background-color: whitesmoke;
    }
    p {
        font-size: 11pt;
        padding-top: 0.5rem;
    }
    .trail-info {
        padding-bottom: 0.5rem;
        padding-top: 1rem;
        margin-left: 2rem;
        padding-right: 2rem;
    }
</style>