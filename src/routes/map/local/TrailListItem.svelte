<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faFire, faLocationDot, faLocationPin, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import TrailCard from "$lib/components/trail/TrailCard.svelte";
    import type { Project } from "./mapNodes";
    import { mapData } from "../store";

    export let node:string

    let obj:Project
    let trailLength = 0
    onMount(() => {
        obj = $mapData.projectObj[node]
        console.log(obj)
        trailLength = obj.nodes.length
    })

    // $: console.log(`Trail ${node.frontmatter.title} select status is ${node.selected}`)
    let nodesComplete = 0
    $: nodesCompleted = $mapData.projectObj[node].nodes.filter((obj:any) => obj.completed).length

    const dispatch = createEventDispatcher();
    function focus(i:number) {
        // console.log(`Focus on nodes ${node.frontmatter.nodes}`)
        if(obj.frontmatter.nodes) {
            dispatch('select', {
                data: $mapData.projectObj[node].nodes[i],
                type: 'location'
            })
        }
    }

    function handleFocus(e:any) {
        switch(e.type) {
            case 'mouseenter':
                $mapData.projectObj[node].highlight()
                break
            case 'mouseleave':
                $mapData.projectObj[node].dehighlight()
                break
            case 'click':
                $mapData.projectObj[node].selected = !$mapData.projectObj[node].selected
                console.log("Got click; status", $mapData.projectObj[node].selected)
                break
        }
    }

    let iconsref = {
        selected: {
            icon: faLocationDot,
            condition: $mapData.projectObj[node].selected
        },
        showing: ["selected"]
    }
</script>

<div class='trail-item-wrapper {$mapData.projectObj[node].selected? "selected":""}'>
    <!-- TODO: fix a11y stuff -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a class='trail-list-item {$mapData.projectObj[node].selected? 'selected' : ''}' aria-expanded="{$mapData.projectObj[node].selected}" aria-controls='project-description'
        on:click={handleFocus} 
        on:keydown={handleFocus} 
        on:mouseenter={handleFocus} 
        on:mouseleave={handleFocus} 
    >
        <div class='trail-list-row {$mapData.projectObj[node].selected? 'selected' : ''}'>
            <div class='left'>
                <div class='control'>
                    <label class='radio'>
                        <input type='checkbox' name='complete' bind:checked={$mapData.projectObj[node].completed}>
                    </label>
                </div>
                <p>{$mapData.projectObj[node].frontmatter.title}</p>
            </div>
            <div class='right'>
                <span class='number { $mapData.projectObj[node].frontmatter.nodes? 'visible': 'invisible'}'>
                    {nodesCompleted}/{$mapData.projectObj[node].frontmatter.nodes && $mapData.projectObj[node].frontmatter.nodes.length > 0? $mapData.projectObj[node].frontmatter.nodes.length : 0}
                    <Fa style='margin-left: 4px;' icon={faLocationDot} />
                </span>
                <span class='number {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? 'visible':'invisible'}'>
                    {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? $mapData.projectObj[node].frontmatter.difficulty : ""}
                    <Fa style='margin-left: 4px; color: darkorange;' icon={faFire} />
                </span>
                <button class='button is-small hoverable {$mapData.projectObj[node].selected? "selected":""}'>
                    <span>Open</span>
                    <span class='icon'>
                        <Fa icon={faArrowUpRightFromSquare} />
                    </span>
                </button>
                <span class={$mapData.projectObj[node].selected ? "visible": "invisible"}>
                    <Fa icon={faLocationDot} />
                </span>
            </div>
        </div>
    </a>
    {#if $mapData.projectObj[node].selected}
        <div id='project-description' class='description'>
            <div class='trail-text'>
                <div class='content wrap'>
                    <!-- Content from file -->
                    {@html $mapData.projectObj[node].content.full}
                </div>
            </div>
            <ul class='timeline has-text-centered'>
                <!-- Node display -->
                {#each $mapData.projectObj[node].nodes as node, i}
                <li 
                    on:click={() => focus(i)}
                    on:mouseenter={()=>node.rehover()} 
                    on:mouseleave={()=>node.dehover()} 
                    class='{i == trailLength-1 ? "last" : ""} {obj.optionalTutorialMask[i]}'
                >
                        {node.frontmatter.title}
                </li>
                {/each}
            </ul>
            
            
        </div>
    {/if}
</div>

<style lang='scss'>
    $dark: hsl(0, 0%, 21%);
    .wrap {
        display: block;
    }
    .trail-text {
        margin-right: 1rem;
        display: inline-flex;
        * {
            display: block;
        }
    }
    .timeline {
        display: inline-block;
        height: 100%;
        background-color: pink;
        width: 5rem;
        background: linear-gradient(#000, #000) no-repeat center/2px 100%;
        li {
            width: 100%;
            font-size: 9pt;
            display: block;
            background-color: $dark;
            color: white;
            font-weight: bold;
            border-radius: 4px;
            margin-bottom: 1rem;
            padding: 0.5em 0.5em;
            cursor: pointer;
            &.true {
                background-color: white;
                border: 2px dashed $dark;
                color: $dark;
                &:hover {
                    background-color: whitesmoke;
                }
            }
            &.last {
                margin-bottom: 0;
            }
            &:hover {
                background-color: gray;
            }
        }
    }
    span {
        color: black;
    }
    span.number {
        font-size: 11pt;
        background-color: white;
        border: 1px solid lightgray;
        margin-right: 0;
    }
    .trail-list-row {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: whitesmoke;
        padding: 1rem 1rem;
        display: flex;
        
        &:hover {
            background-color: whitesmoke;
            cursor: pointer;
            span.hoverable, button.hoverable {
                visibility: visible;
            }
        }
        span.hoverable, button.hoverable {
            visibility: hidden;
        }
        span.hoverable.selected, button.hoverable.selected {
            visibility: visible;
        }
    }
    .trail-list-row.selected {
        background-color: whitesmoke;
    }
    .trail-item-wrapper.selected {
        border-color: red;
        border-style: solid;
        border-width: 3px;
    }
    .left {
        display: inline-flex;
        flex-grow: 1;
        margin-top: 3px;
        // background-color: pink;
    }
    .right {
        display: inline-flex;
        // background-color: lightblue;
        span, button {
            margin-left: 0.75rem;
        }
        button {
            // margin-top: -2px;
            span {
                margin: 0 0;
            }
        }
        margin-left: auto;
    }
    .control {
        margin-right: 0.5rem;
    }
    .invisible {
        visibility: hidden;
    }
    .visible {
        visibility: visible;
    }
    .description {
        display: flex;
        position: static;
        padding: 1rem 1rem;
        border-bottom: 1px solid whitesmoke;
    }
    .trail-list-item {
        display: block;
        background-color: white;
        border: none;
        box-shadow: none;
        outline: none;
        font-size: 12pt;
    }
</style>

