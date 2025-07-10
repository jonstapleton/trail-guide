<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../../routes/store";
    import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import * as components from '$lib/components/location/directives'

    export let node:string = ''
    export let data:any;
    export let containerized = false
    export let src:string;

    let full:string = ''
    let quick:string = ''
    let loaded = false
    let title:string = ''
    let short:string = ''
    onMount(() => {
        console.log("Mounting quick take...")
        if(node) {
            console.log("Loading Quick Take from id")
            loadContent(node as string)
        } else if(data) {
            console.log("Loading Quick Take from object");
            ({full, quick} = data.content);
            title = data.frontmatter.title
            short = data.frontmatter.description
        }
        loaded = full || quick ? true: false
    })

    function loadContent(node:string) {
        ({full, quick} = $mapData.nodesByPath[node].content)
        title = $mapData.nodesByPath[node].frontmatter.title
        short = $mapData.nodesByPath[node].frontmatter.description
        loaded = full || quick ? true: false
    }

    $: if(node && !loaded) {loadContent(node as string)}
</script>

<div class='quick-take content'>
    <h2 class='title is-3'>{title}</h2>
    <blockquote class='blockquote'>{short}</blockquote>
    <div class='p-0 m-0 {containerized ? 'columns' : ''}'>
    {#if loaded}
    {@html quick && quick.length > 0 ? quick : full }
    {/if}
    <!-- <div class='end has-text-right'>
        <a class='is-italic'>
            Read Detailed Tutorial
            <span class='icon ml-1'>
                <Fa icon={faArrowUpRightFromSquare} />
            </span>
        </a>
    </div> -->
    </div>
</div>

<style lang='scss'>
    .quick-take {
        padding: 0;
        margin: 0;

    }
    blockquote {
        font-size: 10pt;
    }
</style>