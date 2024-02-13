<script lang='ts'>
    import { onMount } from "svelte";

    export let term = ''
    export let filteredList:object[] = []
    export let nodes:object[] = []

    $: filteredList = filter(term)

    onMount(() => {
        filteredList = nodes;
    })

    function filter(term:string) {
        const filteredNodes = nodes.filter((node)=> {
            return  node.frontmatter.title.toLowerCase().includes(term.toLowerCase())
                    || term.length == 0 //||
                    // selectedNode.path == node.path
        })
        return filteredNodes;
    }
</script>

<div class='field'>
    <div class='control'>
        <input bind:value={term} class='input' type='text' placeholder="Search...">
    </div>
</div>