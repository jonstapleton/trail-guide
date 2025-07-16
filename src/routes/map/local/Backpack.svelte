<script>
    import SearchBar from "$lib/components/elements/SearchBar.svelte";
    import { mapData, backpack } from "../../store";
    import LocationListItem from "./LocationListItem.svelte";
    import TrailListItem from "./TrailListItem.svelte";
</script>
<div class='backpack'>
    <!-- A search bar that searches across both categories -->
    <SearchBar />
    <!-- A section for saved projects -->
    <h3 class='cat title is-5'>My Saved Projects</h3>
    {#if $backpack.projects.length == 0}
    <p class='mt-5 is-italic'>You haven't saved any projects yet!</p>
    {/if}
    {#each $backpack.projects as project}
        <TrailListItem on:select 
            node={$mapData.projectObj[project.replace('/index.md', '')].id}
            backpack="delete"
        />
    {/each}
    
    <!-- A section for saved locations -->
    <h3 class='cat title is-5'>My Saved Tutorials</h3>
    {#if $backpack.tutorials.length == 0}
    <p class='mt-5 is-italic'>You haven't saved any tutorials yet!</p>
    {/if}
    {#each $backpack.tutorials as tutorial}
        <LocationListItem node={$mapData.nodesByPath[tutorial].id} selected={[]} />
    {/each}
</div>

<style lang='scss'>
    .cat {
        padding-top: 2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid whitesmoke;
        width: 100%;
    }
</style>