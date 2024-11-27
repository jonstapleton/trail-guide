<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faFire, faArrowUpRightFromSquare, faMap, faStar } from '@fortawesome/free-solid-svg-icons';
    import type { Project } from "../map/local/elements/Project";
    import { base} from '$app/paths'
    import { onMount } from 'svelte';
    import { mapData } from '../store';

    export let node:Project

    onMount(() => {

    })

    let completed = 0;
    function countCompleted(map:any) {
        const completedNodes = map.projectObj[node.id].nodes.filter((obj:any) => {
            return obj.completed
        })
        return completedNodes.length
    }

    $: completed = countCompleted($mapData)
</script>

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
                    <input bind:checked={$mapData.projectObj[node.id].completed} type="checkbox">
                    <a class='ml-2 mr-5' target="_blank" href="{base}/{node.path}">{node.frontmatter.title}</a>
                    {#if node.frontmatter.recommended}
                    <span class='tag is-medium'>
                        <span class='rec-icon mr-2'>
                            <Fa icon={faStar} />
                        </span>
                        Recommended
                    </span>
                    {/if}
                    <span class='tag is-medium'>Difficulty:
                        {#each {length: node.frontmatter.difficulty} as _}
                        <span class='ml-1 diff-icon'><Fa icon={faFire} /></span>
                        {/each}
                    </span>
                    <span class='tag is-medium'>Completed: {completed} / {node.frontmatter.nodes.length}</span>
                    <!-- <span class='ml-2'><Fa icon={icon} /></span> -->
                    <!-- <span class='type is-italic'>Tutorial</span> -->
                </label>
            </heading>
            <section class='description py-3'>
                <p>{node.frontmatter.description}</p>
                <div class='field is-grouped mt-4'>
                    <div class='control is-expanded'>
                        <a href="{base}/{node.path}" target="_blank" class='button is-fullwidth is-dark'>Read Detailed Tutorial<span class='ml-2'><Fa icon={faArrowUpRightFromSquare} /></span></a>
                    </div>
                    <div class='control is-expanded'>
                        <a href="{base}/map" target="_blank" class='button is-fullwidth'>View on the Map<span class='ml-2'><Fa icon={faMap} /></span></a>
                    </div>
                </div>
            </section>
        </div>
    </div>
</article>

<style lang='scss'>
    .diff-icon {
        color: darkorange;
    }
    .rec-icon {
        color: gold;
    }
    .checkbox > input {
        width: 18px;
        height: 18px;
    }
</style>