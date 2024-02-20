<script lang='ts'>
    import { onMount } from 'svelte';
    import Header from './Header.svelte';
    import *  as directives from '$lib/components/location/directives'

    export let data;
    onMount(() => {
        console.log(data)
    })

    const test = `<test-element>Something</test-element>`
</script>

<div class='container content tutorial'>
    <div class='section'>
        <Header />
    </div>
    <div class='section'>
        {@html data.content.full}
    </div>
</div>
