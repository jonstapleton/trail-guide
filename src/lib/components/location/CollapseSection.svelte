<script lang='ts'>
    export let title = "Click Me!"
    let collapse = false;
</script>

<svelte:options customElement={{
    tag: 'collapse-section'
}} />

<div class='collapse'>
    <div class='has-text-centered'>
        <button on:click={() => collapse = !collapse} class='button is-fullwidth is-dark'>{title}</button>
    </div>
    {#if collapse}
    <div class='collapsible'>
        <slot />
    </div>
    {/if}
</div>

<style lang='scss'>
    @import "../../../app.scss";
</style>