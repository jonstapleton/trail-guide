<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../../routes/store";
    import PracticeQuestion from "../PracticeQuestion.svelte";
    import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'

    export let node:string
    export let data:any
    let obj;
    let id:string;
    let questions:any[] = []
    let selected = 0

    onMount(() => {
        // console.log($mapData)
        if(node) {
            obj = $mapData.nodeObj[node]
            id = node
        } else if(data) {
            obj = data
            id = $mapData.nodesByPath[data.path+'.md'].id
        }
        
        console.log(obj)
        if(obj) {
            questions = obj.content.practice
        }
    })
</script>

{#if id}
<div class='question-carousel'>
    <div on:click={() => selected = (selected - 1) % obj.content.practice.length} class='left px-3 mr-2'>
        <div><Fa size="3x" icon={faChevronLeft} /></div>
    </div>
    <div class='center'>
        <!-- {#each $mapData.nodeObj[id].content.practice as question, i} -->
        {#key selected}
        <PracticeQuestion boxed={false} question={$mapData.nodeObj[id].content.practice[Math.abs(selected)]} node={id} index={Math.abs(selected)} />
        <!-- {/each} -->
        {/key}
    </div>
    <div on:click={() => selected = (selected + 1) % obj.content.practice.length} class='right px-3 ml-2'>
        <div><Fa size="3x" icon={faChevronRight} /></div>
    </div>
</div>
{/if}

<style lang='scss'>
    .question-carousel {
        display: flex;
        // justify-content: space-between;
    }
    .left, .right {
        display: flex;
        // background-color: pink;
        border: 1px solid transparent;
        border-radius: 8px;
        // & > div {
        //     align-self: center;
        
        // }
        padding-top: 5rem;
        &:hover {
            // background-color: whitesmoke;
            cursor: pointer;
            border: 1px solid gray;
        }
    }
    .left {
        margin-right: auto;
        // align-items: center;
    }
    .right {
        margin-left: auto;
    }
    .center {
        // background-color: lightblue;
        flex-grow: 1;
        padding: 1rem 2rem;
        & * {
            display: block;
        }
    }
    // .question-carousel:first-of-type > div:last-child { order: -1; }
</style>