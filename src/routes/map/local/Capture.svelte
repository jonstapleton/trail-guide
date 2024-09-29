<script lang='ts'>
    import { createEventDispatcher } from "svelte";
    export let debug = false
    let el:HTMLElement;
    const dispatch = createEventDispatcher()
    function capture(flag:boolean) {
        dispatch('capture', flag)
    }
</script>

<div class='capture {debug? 'debug' :''}' bind:this={el} on:mouseenter={() => capture(false)} on:mouseleave={() => capture(true)}>
    <slot />
</div>

<style>
    .debug {
        background-color: pink;
    }
    .capture {
        /* height: 100%; */
        /* display: inline-block; */
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 0;
        padding: 0 0;
    }
</style>