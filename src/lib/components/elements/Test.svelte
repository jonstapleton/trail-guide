<svelte:options customElement='test-element'></svelte:options>

<div class='box'>
    <p>Hello</p>
    <slot />
</div>

<style>
    p {
        background-color: red;
    }
</style>