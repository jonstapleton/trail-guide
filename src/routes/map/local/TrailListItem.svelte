<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faFire, faLocationDot, faLocationPin, faSearch, faStar, faCheck } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import TrailCard from "$lib/components/trail/TrailCard.svelte";
    import type { Project } from "./mapNodes";
    import { mapData } from "../../store";
    import {base} from '$app/paths'

    export let node:string

    let obj:Project
    let trailLength = 0
    onMount(() => {
        obj = $mapData.projectObj[node]
        console.log(obj)
        trailLength = obj.nodes.length
    })

    onDestroy(() => {
        console.log("Destroying", obj.frontmatter.title)
        $mapData.projectObj[node].deselect()
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
    <a class='trail-list-item {$mapData.projectObj[node].selected? 'selected' : ''}' 
    on:mouseenter={handleFocus} 
    on:mouseleave={handleFocus}>
        <div class='trail-list-row {$mapData.projectObj[node].selected? 'selected' : ''}'>
            <div class='left'>
                <div class='control'>
                    <label class='radio'>
                        <input type='checkbox' name='complete' bind:checked={$mapData.projectObj[node].completed}>
                    </label>
                </div>
                <a aria-expanded="{$mapData.projectObj[node].selected}" 
                aria-controls='project-description'
                on:click={handleFocus} 
                on:keydown={handleFocus}
                >{$mapData.projectObj[node].frontmatter.title}</a>
                {#if $mapData.projectObj[node].frontmatter.recommended}
                <span style='color: gold' class='ml-2'><Fa icon={faStar} /></span>
                {/if}
            </div>
            <div class='right'>
                <span data-tooltip="Completed Tutorials" class='has-tooltip-arrow number { $mapData.projectObj[node].frontmatter.nodes? 'visible': 'invisible'}'>
                    {nodesCompleted}/{$mapData.projectObj[node].frontmatter.nodes && $mapData.projectObj[node].frontmatter.nodes.length > 0? $mapData.projectObj[node].frontmatter.nodes.length : 0}
                    <Fa style='margin-left: 4px;' icon={faLocationDot} />
                </span>
                <span data-tooltip="Difficulty" class='has-tooltip-arrow number {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? 'visible':'invisible'}'>
                    {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? $mapData.projectObj[node].frontmatter.difficulty : ""}
                    <Fa style='margin-left: 4px; color: darkorange;' icon={faFire} />
                </span>
                <a target="_blank" href="{base}/{$mapData.projectObj[node].path}" class='button is-small hoverable {$mapData.projectObj[node].selected? "selected":""}'>
                    <span>Open</span>
                    <span class='icon'>
                        <Fa icon={faArrowUpRightFromSquare} />
                    </span>
                </a>
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
                        {#if node.completed}
                        <span class='completed-icon'><Fa size="3x" icon={faCheck} /></span>
                        {/if}
                </li>
                {/each}
            </ul>
            
            
        </div>
    {/if}
</div>

<style lang='scss'>
    $dark: hsl(0, 0%, 21%);
    .completed-icon {
        position: absolute;
        color: hsl(141, 53%, 53%);
        top: -10px;
        right: -8px;
    }
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
            position: relative;
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
            span.hoverable, a.hoverable {
                visibility: visible;
            }
        }
        span.hoverable, a.hoverable {
            visibility: hidden;
        }
        span.hoverable.selected, a.hoverable.selected {
            visibility: visible;
        }
    }
    .trail-list-row.selected {
        background-color: whitesmoke;
    }
    // .trail-item-wrapper.selected {
    //     border-style: solid;
    //     border-width: 3px;
    // }
    .left {
        display: inline-flex;
        flex-grow: 1;
        margin-top: 3px;
        // background-color: pink;
    }
    .right {
        display: inline-flex;
        // background-color: lightblue;
        span, a {
            margin-left: 0.75rem;
        }
        a {
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

