<script lang='ts'>
    import type { Tutorial } from "../../../routes/map/local/elements/Tutorial";
    import { mapData } from "../../../routes/store";

    export let obj:Tutorial
    export let optional:boolean = false
    // export let selected:string // this is the path to the node
</script>

<span class='{optional? "indent" : ""}'>
    <span class='control'>
        <input bind:checked={$mapData.nodesByPath[obj.path].completed} type="checkbox">
    </span>
    <span class='{optional? "is-italic":""}'>{obj.frontmatter.title}</span>
    {#if optional}
    <span class='ml-2 tag is-dark'>optional</span>
    {/if}
    {#if obj.frontmatter.type == "cache"}
    <span class='tag mx-1 is-dark'>cache</span>
    {/if}
</span>

<style lang='scss'>
    .indent {
        margin-left: 3rem;
    }
    // .is-active {
    //     background-color: whitesmoke;
    // }
</style>