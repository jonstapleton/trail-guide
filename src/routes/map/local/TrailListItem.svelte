<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faLocationDot, faLocationPin, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import TrailCard from "$lib/components/trail/TrailCard.svelte";

    export let node:object = {
        frontmatter: { title: "no title", nodes: [] },
        selected: false
    }

    $: console.log(`Trail ${node.frontmatter.title} select status is ${node.selected}`)

    const dispatch = createEventDispatcher();
    function focus(select:boolean) {
        // console.log(`Focus on nodes ${node.frontmatter.nodes}`)
        if(node.frontmatter.nodes) {
            dispatch('select', {
                data: node,
                select: select,
                showInfo: node.selected
            })
        }
    }

    function handleFocus(e:any) {
        switch(e.type) {
            case 'mouseenter':
                if(!node.selected) {
                    focus(true)
                }
                break
            case 'mouseleave':
                if(!node.selected) {
                    focus(false)
                }
                break
            case 'click':
                node.selected = !node.selected
                focus(true)
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

<div on:mouseenter={handleFocus} on:mouseleave={handleFocus} class='trail-list-item {node.selected? 'selected' : ''}'>
    <div class='trail-list-row {node.selected? 'selected' : ''}'>
        <div class='left'>
            <div class='control'>
                <label class='radio'>
                    <input type='checkbox' name='complete' bind:checked={node.completed}>
                </label>
            </div>
            <a on:click={handleFocus}>{node.frontmatter.title}</a>
        </div>
        <div class='right'>
            <span class='hoverable {node.selected? "selected":""}'>
                <Fa icon={faArrowUpRightFromSquare} />
            </span>
            <span class={node.selected ? "visible": "invisible"}>
                <Fa icon={faLocationDot} />
            </span>
        </div>
    </div>
    {#if node.selected}
    <div class='description'>
        {@html node.content}
    </div>
    {/if}
</div>

<style lang='scss'>
    .trail-list-row {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: whitesmoke;
        padding: 1rem 1rem;
        display: flex;
        &:hover {
            background-color: whitesmoke;
            cursor: pointer;
            span.hoverable {
                visibility: visible;
            }
        }
        span.hoverable {
            visibility: hidden;
        }
        span.hoverable.selected {
            visibility: visible;
        }
    }
    .trail-list-row.selected {
        background-color: whitesmoke;
    }
    .trail-list-item.selected {
        border-color: red;
        border-style: solid;
        border-width: 3px;
    }
    .left {
        display: inline-flex;
        flex-grow: 1;
        // background-color: pink;
    }
    .right {
        display: inline-flex;
        // background-color: lightblue;
        span {
            margin-left: 0.75rem;
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
    }
    .trail-list-item {
        display: block
    }
</style>

