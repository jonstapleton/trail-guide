<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faLocationDot, faLocationPin, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";

    export let node:object = {
        frontmatter: { title: "no title" }
    }
    export let selected:object;

    const dispatch = createEventDispatcher();
    function focus() {
        // console.log(`Focus on ${node.frontmatter.title}`)
        dispatch('select', {
            data: node
        })
    }

    let iconsref = {
        selected: {
            icon: faLocationDot,
            condition: selected && node.path == selected.path
        },
        showing: ["selected"]
    }
    $:console.log(selected && node.path == selected.path)
</script>

<div class='location-list-item'>
    <div class='left'>
        <div class='control'>
            <label class='radio'>
                <input type='checkbox' name='complete' bind:checked={node.completed}>
            </label>
        </div>
        <a on:click={focus}>{node.frontmatter.title}</a>
    </div>
    <div class='right'>
        <span class='hoverable'>
            <Fa icon={faArrowUpRightFromSquare} />
        </span>
        <span class={selected && selected.selected && node.path == selected.path ? "visible": "invisible"}>
            <Fa icon={faLocationDot} />
        </span>
    </div>
</div>

<style lang='scss'>
    .location-list-item {
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
        span {
            visibility: hidden;
        }
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
</style>

