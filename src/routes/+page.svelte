<script lang='ts'>
    import { faLocationDot, faMap, faRoute } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    import { base } from '$app/paths'
    export let data;
</script>

<div class='homepage hero is-fullheight-with-navbar'>
    <div class='hero-body'>
        <div class='container has-text-centered'>
            <h1 class='title'>{data.config.title}</h1>
            <p class='subtitle'>A CodeVA Curriculum Trail Guide</p>
            <div class='field'>
                <div class='control is-expanded'>
                    <a href="{base}/map" class='button is-fullwidth is-large is-dark'>
                        Explore the Map
                        <span class='ml-2'><Fa icon={faMap} /></span>
                    </a>
                </div>
            </div>
            <div class='field is-grouped mt-4'>
                <div class='control is-expanded'>
                    <a href='{base}/projects' class='button is-large is-fullwidth'>
                        Try a Project
                        <span class='ml-2'><Fa icon={faRoute} /></span>
                    </a>
                </div>
                <div class='control is-expanded'>
                    <a href="{base}/tutorials" class='button is-large is-fullwidth'>
                        Browse Tutorials
                        <span class='ml-2'><Fa icon={faLocationDot} /></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang='scss'>
    h1 {
        font-size: 60pt;
    }
    p {
        font-size: 32pt;
    }
    .field {
        max-width: 700px;
        margin: auto auto;
    }
</style>