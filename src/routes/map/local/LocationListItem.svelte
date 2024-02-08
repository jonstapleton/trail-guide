<script lang='ts'>
    import { onMount } from "svelte";

    export let node:object = {
        frontmatter: { title: "no title" }
    }
    onMount(() => console.log(node))
</script>

<div class='location-list-item'>
    <p>node</p>
</div>