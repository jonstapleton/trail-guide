<script lang='ts'>
    import { base } from "$app/paths";

    export let node:string

    let route = `${base}/map?open=${node}`
    let destination = route

    function toggleRoute() {
        setTimeout(() => {
            destination  = `${base}/map`
        }, 100)
    }

</script>

<a on:click={toggleRoute} href="{destination}">{node}</a>