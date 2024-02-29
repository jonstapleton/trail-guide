<script lang='ts'>
    import { base } from '$app/paths'
    import { faLocationDot, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    import { mapData } from '../store';
    import { onMount } from 'svelte';
    import type { Project } from '../map/local/mapNodes';

    let term = ''

    $: filter(term)

    function filter(term:string) {
        nodes = $mapData.projects.filter((obj:Project) => {
            return obj.frontmatter.title.toLowerCase().includes(term.toLowerCase())
        })
    }
    let nodes:Project[] = []
    onMount(() => {
        filter(term)
    })
</script>

<div class='container'>
    <div class='section content'>
        <h1>Projects</h1>
        <p>Check out the projects below for fun story ideas to create with Twine!</p>
        <p>Each of the projects listed below contain several tutorials. Search our whole library of tutorials on the <a href='{base}/tutorials'>Tutorials</a> page, or browse all of the trail guide resources on the <a href="{base}/map">Map</a>.</p>
    </div>
    <div class='section'>
        <div class='field has-addons'>
            <div class='control is-expanded'>
                <input bind:value={term} placeholder="Search by Project Name..." class='input'>
            </div>
            <div class='control'>
                <!-- TODO: update path based on search terms -->
                <button class='button has-icon is-dark'>
                    Search
                    <span class='icon ml-2'><Fa icon={faSearch} /></span>
                </button>
            </div>
        </div>
        <hr>
        {#each nodes as node}
        <article class='box'>
            <div class='columns'>
                {#if node.frontmatter.video}
                <div class='column mr-5 is-one-third is-hidden-mobile'>
                    <div class='video-wrap'>
                        <iframe src="{node.frontmatter.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <!-- <span class='video-icon'><Fa icon={faVideo} size="2x" /></span> -->
                    </div>
                </div>
                {/if}
                <div class='column'>
                    <heading class='subtitle'>
                        <label class='checkbox'>
                            <input type="checkbox">
                            {node.frontmatter.title}
                            <!-- <span class='ml-2'><Fa icon={icon} /></span> -->
                            <!-- <span class='type is-italic'>Tutorial</span> -->
                        </label>
                    </heading>
                    <section class='description py-3'>
                        <p>{node.frontmatter.description}</p>
                    </section>
                </div>
            </div>
            
        </article>
        {/each}
    </div>
</div>

<style lang='scss'>
    .type {
        float: right;
    }
    .description {
        font-size: 11pt;
    }
    .video-wrap {
        border-radius: 12px;
        background-color: whitesmoke;
        position: relative;
        // z-index: -99;
        height: 100%;
    }
    .video-icon {
        position: absolute;
        top: calc(50% - 1rem);
        left: calc(50% - 0.5rem);
        z-index: 0
    }
    iframe {
        border-radius: 12px;
        z-index: 99;
        height: 100%;
    }
    .checkbox > input {
        margin-right: 0.5rem;
        width: 18px;
        height: 18px;
    }
</style>