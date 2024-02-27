<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faLocationDot, faLocationPin, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import type { Tutorial } from "./mapNodes";
    import { mapData } from "../../store";

    export let node:string
    export let selected:Tutorial;

    const dispatch = createEventDispatcher();
    function focus() {
        const n = $mapData.nodeObj[node]
        console.log(`Focus on ${n.frontmatter.title}`)
        dispatch('select', {
            data: $mapData.nodeObj[node],
            type: 'location'
        })
    }
</script>

<!-- TODO: a11y stuff -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class='location-list-item'>
    <div class='left'>
        <div class='control'>
            <label class='radio'>
                <input type='checkbox' name='complete' bind:checked={$mapData.nodeObj[node].completed}>
            </label>
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a on:click={focus}>{$mapData.nodeObj[node].frontmatter.title}</a>
    </div>
    <div class='right'>
        <span class='hoverable'>
            <Fa icon={faArrowUpRightFromSquare} />
        </span>
        <span class="{selected && selected.path == $mapData.nodeObj[node].path ? 'visible' : 'invisible'}">
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
        span.hoverable {
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

