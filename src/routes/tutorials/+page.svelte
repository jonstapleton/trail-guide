<script lang='ts'>
    import { base } from '$app/paths'
    import { faArrowUpRightFromSquare, faLocationDot, faMap, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    import { mapData } from '../store';
    import { onMount } from 'svelte';
    import type { Tutorial } from '../map/local/mapNodes';

    let term = ''

    $: filter(term)

    function filter(term:string) {
        nodes = $mapData.nodes.filter((obj:Tutorial) => {
            return obj.frontmatter.title.toLowerCase().includes(term.toLowerCase()) && obj.frontmatter.type == 'tutorial'
        })
    }
    let nodes:Tutorial[] = []
    onMount(() => {
        filter(term)
    })
</script>

<div class='container'>
    <div class='section content'>
        <h1>Tutorials</h1>
        <p>Check out the tutorials below for quick reference guides, video walkthroughs, written tutorials, and other resources to help you learn how to create stories with Twine!</p>
        <p>Each of the tutorials listed below are a part of one or more projects. Read about them on the <a href='{base}/projects'>Projects</a> page, or browse all of the trail guide resources on the <a href="{base}/map">Map</a>.</p>
    </div>
    <div class='section'>
        <div class='field has-addons'>
            <div class='control is-expanded'>
                <input bind:value={term} placeholder="Search by Tutorial Name..." class='is-large input'>
            </div>
            <div class='control'>
                <!-- TODO: update path based on search terms -->
                <button class='button has-icon is-dark is-large'>
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
                <div class='column ml-4 mr-2'>
                    <heading class='subtitle'>
                        <label class='checkbox'>
                            <input bind:checked={$mapData.nodesByPath[node.path].completed} type="checkbox">
                            
                            <a href="{base}/tutorials/{node.path.replace('.md','')}" target="_blank">{node.frontmatter.title}</a>
                            <!-- <span class='ml-2'><Fa icon={icon} /></span> -->
                            <!-- <span class='type is-italic'>Tutorial</span> -->
                        </label>
                    </heading>
                    <section class='description py-3'>
                        <p>{node.frontmatter.description}</p>
                    </section>
                </div>
                
            </div>
            <div class='field is-grouped mt-4'>
                <div class='control is-expanded'>
                    <a href="{base}/{node.path}" target="_blank" class='button is-fullwidth is-dark'>Read Detailed Tutorial<span class='ml-2'><Fa icon={faArrowUpRightFromSquare} /></span></a>
                </div>
                <div class='control is-expanded'>
                    <a href="{base}/map" target="_blank" class='button is-fullwidth'>View on the Map<span class='ml-2'><Fa icon={faMap} /></span></a>
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