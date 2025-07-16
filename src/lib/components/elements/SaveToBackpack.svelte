<script lang='ts'>
    // import console from "$lib/utils/Debug";
    import { faSave, faX } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { backpack } from "../../../routes/store";
    import { base } from "$app/paths";

    export let short = false
    export let element:string
    export let status:"save"|"delete" = "save"

    let tooltip = status == 'save'? "Save to Backpack" : "Remove from Backpack"

    // console.add('backpack', 'SaveToBackpack.svelte')

    async function save() {
        if(element) {
            // pull the object from the API
            console.log('backpack', "Attempting to fetch data on " + element)
            const obj = await (await fetch(`${base}/api/file/${element}.json`)).json()
            // console.log('backpack', obj)
            if(obj && element.includes('index.md')) {
                $backpack.projects = [...$backpack.projects, element]
                console.log('backpack', `Added ${element} to $backpack.projects`)
            }
            else if(obj && (obj.frontmatter.type == 'tutorial' || obj.type == 'cache')) {
                $backpack.tutorials = [...$backpack.tutorials, element]
                console.log('backpack', `Added ${element} to $backpack.tutorials`)
            }
        }
    }

    function remove() {
        if(element) {
            console.log('backpack', `Removing ${element} from $backpack...`)
            if(element.includes('index.md')) {
                $backpack.projects = $backpack.projects.filter((el:string) => el != element)
            } else {
                $backpack.tutorials = $backpack.tutorials.filter((el:string) => el != element)
            }
        }
    }
</script>

<button on:click={status == 'save'? save : remove} data-tooltip={tooltip} class='button is-secondary ml-2 is-small hoverable {short? 'has-tooltip-arrow':''}'>
    {#if !short}
    <span>{tooltip}</span>
    {:else}
    <span><Fa icon={status=='save'? faSave:faX} size="1.5x" /></span>
    {/if}
</button>

<style>
    button {
        position: relative;
        top: -3pt;
        border-radius: 8px;
    }
    .hidden {
        display: none;
    }
</style>