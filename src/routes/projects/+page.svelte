<script lang='ts'>
    import { base } from '$app/paths'
    import { faArrowUpRightFromSquare, faFire, faLocationDot, faMap, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    import { mapData } from '../store';
    import { onMount } from 'svelte';
    import type { Project } from '../map/local/elements/Project';
    import ProjectCard from './ProjectCard.svelte';
    import { loadConfig, type Config } from '$lib/config';

    let term = ''
    let completedNodes = 0

    $: filter(term)

    function filter(term:string) {
        nodes = $mapData.projects.filter((obj:Project) => {
            return obj.frontmatter.title.toLowerCase().includes(term.toLowerCase())
        }).sort((a:Project,b:Project) => {
            if(a.frontmatter.recommended && b.frontmatter.recommended) { return 0 }
            else if(a.frontmatter.recommended) { return -1 }
            else if(b.frontmatter.recommended) { return  1 }
            else {
                return a.frontmatter.difficulty - b.frontmatter.difficulty
            }
        })
    }
    let nodes:Project[] = []
    let config:Config // TODO: need to figure out why this isn't working
    onMount(async () => {
        filter(term)
    })
</script>

<div class='container'>
    <div class='section content'>
        <h1>Projects</h1>
        {#if config}
        <p>Check out the projects below some ideas of what you might make with {config.tool}!</p>
        {/if}
        <p>Each of the projects listed below contain several tutorials. Search our whole library of tutorials on the <a href='{base}/tutorials'>Tutorials</a> page, or browse all of the trail guide resources on the <a href="{base}/map">Map</a>.</p>
        <div class='field has-addons mt-5'>
            <div class='control is-expanded'>
                <input bind:value={term} placeholder="Search by project name..." class='input is-large'>
            </div>
            <div class='control'>
                <!-- TODO: update path based on search terms -->
                <button class='button has-icon is-dark is-large'>
                    Search
                    <span class='icon ml-2'><Fa icon={faSearch} /></span>
                </button>
            </div>
        </div>
    </div>
    <div class='section'>
        {#if $mapData.projects.length == 0}
        <i>We haven't published any projects yet! Check back soon.</i>
        {/if}
        {#each nodes as node}
        <ProjectCard node={node} />
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