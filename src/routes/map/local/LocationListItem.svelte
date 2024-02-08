<script lang='ts'>
    import { onMount } from "svelte";
    import { faArrowUpRightFromSquare, faBoxOpen, faSearch } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'

    export let node:object = {
        frontmatter: { title: "no title" }
    }

    function focus() {
        console.log(`Focus on ${node.frontmatter.title}`)
    }
</script>

<div class='location-list-item'>
    <div class='control'>
        <label class='radio'>
            <input type='checkbox' name='complete'>
        </label>
    </div>
    <a on:click={focus}>{node.frontmatter.title}</a>
    <span>
        <Fa icon={ faArrowUpRightFromSquare } />
    </span>
    <span>
        <Fa icon={ faSearch } />
    </span>
    
</div>

<style lang='scss'>
    .location-list-item {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: whitesmoke;
        padding: 1rem 1rem;
        
        & > * {
            display: inline-block;
        }
        &:hover {
            background-color: whitesmoke;
            cursor: pointer;
            span {
                color: black;
                visibility: visible;
            }
        }
        span {
            float:right;
            margin-left: 1rem;
            visibility: hidden;
        }
    }
    .control {
        margin-right: 0.5rem;
    }
</style>

