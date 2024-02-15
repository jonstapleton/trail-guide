<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faFire, faLocationDot, faLocationPin, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import TrailCard from "$lib/components/trail/TrailCard.svelte";
    import type { Project } from "./mapNodes";

    export let node:Project

    $: console.log(`Trail ${node.frontmatter.title} select status is ${node.selected}`)

    const dispatch = createEventDispatcher();
    function focus(add:boolean) {
        // console.log(`Focus on nodes ${node.frontmatter.nodes}`)
        if(node.frontmatter.nodes) {
            dispatch('select', {
                data: node,
                type: 'trail'
            })
        }
    }

    function handleFocus(e:any) {
        switch(e.type) {
            case 'mouseenter':
                node.highlight()
                break
            case 'mouseleave':
                node.dehighlight()
                break
            case 'click':
                node.selected = !node.selected
                console.log("Got click; status", node.selected)
                break
        }
    }

    let iconsref = {
        selected: {
            icon: faLocationDot,
            condition: node.selected
        },
        showing: ["selected"]
    }
</script>

<div class='trail-item-wrapper {node.selected? "selected":""}'>
    <!-- TODO: fix a11y stuff -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a class='trail-list-item {node.selected? 'selected' : ''}' aria-expanded="{node.selected}" aria-controls='project-description'
        on:click={handleFocus} 
        on:keydown={handleFocus} 
        on:mouseenter={handleFocus} 
        on:mouseleave={handleFocus} 
    >
        <div class='trail-list-row {node.selected? 'selected' : ''}'>
            <div class='left'>
                <div class='control'>
                    <label class='radio'>
                        <input type='checkbox' name='complete' bind:checked={node.completed}>
                    </label>
                </div>
                <p>{node.frontmatter.title}</p>
            </div>
            <div class='right'>
                <span class='number { node.frontmatter.nodes? 'visible': 'invisible'}'>
                    0/{node.frontmatter.nodes && node.frontmatter.nodes.length > 0? node.frontmatter.nodes.length : 0}
                    <Fa style='margin-left: 4px;' icon={faLocationDot} />
                </span>
                <span class='number {node.frontmatter.difficulty || node.frontmatter.difficulty == 0? 'visible':'invisible'}'>
                    {node.frontmatter.difficulty || node.frontmatter.difficulty == 0? node.frontmatter.difficulty : ""}
                    <Fa style='margin-left: 4px; color: darkorange;' icon={faFire} />
                </span>
                <button class='button is-small hoverable {node.selected? "selected":""}'>
                    <span>Open</span>
                    <span class='icon'>
                        <Fa icon={faArrowUpRightFromSquare} />
                    </span>
                </button>
                <span class={node.selected ? "visible": "invisible"}>
                    <Fa icon={faLocationDot} />
                </span>
            </div>
        </div>
    </a>
    {#if node.selected}
        <div id='project-description' class='description'>
            {@html node.content}
        </div>
    {/if}
</div>

<style lang='scss'>
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
        display: block;
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

