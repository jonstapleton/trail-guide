<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/store";
    import PracticeQuestion from "./PracticeQuestion.svelte";

    export let node:string
    export let data:any
    let obj;
    let id:string;
    let questions:any[] = []
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
<div class='quiz'>
    {#each $mapData.nodeObj[id].content.practice as question, i}
    <PracticeQuestion boxed={false} question={question} node={id} index={i} />
    {/each}
</div>
{/if}