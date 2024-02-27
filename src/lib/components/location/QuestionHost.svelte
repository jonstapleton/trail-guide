<script lang='ts'>
    import { onMount } from "svelte";
    import { mapData } from "../../../routes/store";
    import PracticeQuestion from "./PracticeQuestion.svelte";

    export let node:string
    let obj;
    let questions:any[] = []
    onMount(() => {
        obj = $mapData.nodeObj[node]
        console.log(obj)
        if(obj) {
            questions = obj.content.practice
        }
    })
</script>

<div class='quiz'>
    {#each questions as question}
    <PracticeQuestion boxed={false} question={question} node={node} />
    {/each}
</div>