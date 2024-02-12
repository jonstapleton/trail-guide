<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faClose } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher, onMount } from 'svelte'
    import { base } from '$app/paths'
    import { slide } from 'svelte/transition'

    export let title = "No Title";
    export let loaded = true;
    export let titleSize = ''

    let frontmatter = {
        title: 'No Title!'
    }

    const dispatch = createEventDispatcher()

    function sendClose() {
        dispatch('close', {
            name: title
        })
        loaded = false;
    }
    let el:any
    
    function capture(s:boolean) {
        dispatch('capture', s)
    }
</script>

{#if loaded}
<article bind:this={el} on:mouseenter={() => capture(false)} on:mouseleave={() => capture(true)} transition:slide class='panel-card card'>
    <header class='card-header'>
        <h2 class='card-header-title mb-3 pb-0'>{title}</h2>
        <button on:click={sendClose} class="card-header-icon" aria-label="close">
            <span class="icon">
              <Fa icon={faClose} />
            </span>
        </button>
    </header>
    <section class='card-content content'>
        <slot />
    </section>
</article>
{/if}
<style lang='scss'>
    .panel-card {
        margin: 2rem;
        min-width: 20rem;
        max-width: 33rem;
        max-height: 85vh;
        overflow-y: scroll;
        background-color: white;
        display: inline-block;
        position: relative;
        vertical-align: top;
        section {
            position: static;
        }
    }
    h2.large {
        font-size: larger;
    }
</style>