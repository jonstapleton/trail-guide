<script lang='ts'>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import LocationListItem from "./LocationListItem.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import type { Tutorial } from "./mapNodes";
    import { mapData } from "../../store";

    // let nodes:Tutorial[] = $mapData.nodes
    export let selectedNode:Tutorial

    let term = ''
    let groups:string[] = []
    type GroupMap = { [key:string]: string }
    let groupLabels:GroupMap = { }

    type GroupedTutorials = { [key:string]: Tutorial[] }
    let filteredNodes:GroupedTutorials = {"none": []}

    onMount(() => {
        for(const id in $mapData.groups) {
            groups = [id, ...groups]
            groupLabels[id] = $mapData.groups[id].label
        }
        groups.sort((a,b) => {
            if(groupLabels[a].toUpperCase() < groupLabels[b].toUpperCase()) { 
                return -1
            } else if(groupLabels[a].toUpperCase() > groupLabels[b].toUpperCase()) {
                return 1
            } else {
                return 0
            }
        })
        console.log("Map has groups:",groups)
        filter(term, $mapData.nodes)
    })

    $: filter(term, $mapData.nodes)

    function filter(term:string, nodes:Tutorial[]) {
        filteredNodes = { }
        if(groups.length == 0) {
            console.log("No groups...")
            filteredNodes["none"] = nodes.filter((node) => {
            return  (node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                    || term.length == 0)
                    && !node.file.includes('activities/') //||
                    // selectedNode.path == node.path
            })
        } else {
            console.log("Sorting by group...")
            // sort by group
            for(let i=0;i<groups.length;i++) {
                filteredNodes[groups[i]] = nodes.filter((node) => {
                return  (node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                        || term.length == 0)
                        && (!node.file.includes('activities/') && node.groups.includes(groups[i]))//||
                        // selectedNode.path == node.path
                })
            }
        }
        // console.log("Filtered Nodes:",filteredNodes)
    }
</script>

<div class='location-list'>
    <!-- Search Bar -->
    <div class='field'>
        <div class='control'>
            <input bind:value={term} class='input' type='text' placeholder="Search...">
        </div>
    </div>
    <!-- // List of nodes -->
    <!-- {#each filteredNodes as node, i}
    <LocationListItem on:select bind:selected={selectedNode} node={node.id} />
    {/each} -->
    {#each groups as groupId}
        {#if filteredNodes[groupId].length > 0}
            <p>{groupLabels[groupId]}</p>
            {#each filteredNodes[groupId] as tutorial}
                <LocationListItem on:select bind:selected={selectedNode} node={tutorial.id} />
            {/each}
        {/if}
    {/each}
</div>

<style lang='scss'>
    .location-list {
        max-height:40rem;
        overflow-y: scroll;
        pointer-events: all;
    }
</style>