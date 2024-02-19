<script lang='ts'>
    import { onMount } from 'svelte';
    import Header from './Header.svelte';

    export let data;
    onMount(() => {
        console.log(data)
    })

    const test = `<test-element>Something</test-element>`
</script>

<div class='container content'>
    <div class='section'>
        <Header />
    </div>
    <div class='section'>
        {@html test}
    </div>
</div>
