<script lang='ts'>
    import {onMount} from 'svelte'
    import {base} from '$app/paths'

    export let name:string, src:string;
    export let alt = "The output of the code above";
    export let tabs:string[] = [];

    let selected = 0
    function changeTab(i:number) {
        console.log("changing tabs...")
        childElems[selected].classList.remove('visible')
        childElems[selected].classList.add('hidden')
        selected = i
        childElems[selected].classList.remove('hidden')
        childElems[selected].classList.add('visible')
    }
    let childElems:HTMLElement[] = []
    onMount(() => {
        for(let i=0;i<tabs.length;i++) {
            let el = document.getElementById(tabs[i]) as HTMLElement
            el.classList.add('hidden')
            childElems = [...childElems, el]
        }
        childElems[0].classList.remove('hidden')
        childElems[0].classList.add('visible')
        console.log(childElems)
    })
</script>

<svelte:options customElement={{
    tag: 'code-and-image',
    props: {
        name: { reflect: true, type: 'String' },
        tabs: {reflect: true, type: 'Array'}
    }
}} />

<article class='card code-and-image-card'>
    {#if name}
    <header class='card-header code-example pl-5 pt-2 pb-0'>
        <h4>{name}</h4>
    </header>
    {/if}
    <section class='card-content'>
        <div class='cell code m-0 {tabs.length <= 1 ? 'no-border' : ''}'>
            {#if tabs.length > 1}
            <div class='tabs is-boxed m-0'>
                <ul>
                    {#each tabs as tab, i}
                    <li class={i == selected ? 'is-active' : ''}><a href='#/' on:click={() => {changeTab(i)}}>{tab.substring(0, tab.indexOf('_'))}</a></li>
                    {/each}
                </ul>
            </div>
            {/if}
            <slot />
        </div>
        {#if src}
        <div class='cell has-text-centered m-0'>
            <img src="{base}{src}" alt={alt}>
        </div>
        {/if}
    </section>
</article>

<style lang='scss'>
    $tabs-boxed-link-hover-background-color: white;
    $tabs-boxed-link-active-background-color: whitesmoke;

    @import "../../../app.scss";

    .card-header.code-example {
        background-color: hsl(0, 0%, 21%);
        h4 {
            color: white;
            font-style:italic;
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
    }
    .tabs li {
        font-size: 10pt;
    }
    img {
        border-radius: 8px;
        border: 2px dashed black;
    }
    // section {
    //     display: grid;
    //     gap: 1rem;
    //     grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
    // }
    article {
        margin: 3rem 0;
    }
</style>