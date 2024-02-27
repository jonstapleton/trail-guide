<script lang='ts'>
    import { base } from '$app/paths'

    interface Frontmatter {
        title:string,
        nodes?:string[],
        video?:string,
        description?:string
    }
    export let node:any
    export let titleSize = 36;
</script>

<div class='tutorial-header p-5'>
    <div class='columns'>
        <div class='column content'>
            <h1 style="font-size: {titleSize}pt;" class='title control'>
                <label class='checkbox'>
                    <input style="width: {titleSize}px; height: {titleSize}px;" type='checkbox' name='complete' bind:checked={node.completed}>
                    {node.frontmatter.title}
                </label>
            </h1>
            <!-- <h1>{node.frontmatter.title}</h1> -->
            <blockquote class='is-italic'>{node.frontmatter.description}</blockquote>
            {#if node.frontmatter.video}
            <p>Watch the video to see someone demonstrate the basics, or read on to work through it on your own. This concept is a part of several projects; check them out on <a href="{base}/map">the map</a>!</p>
            {/if}
        </div>
        {#if node.frontmatter.video}
        <div class='video column is-half'>
            <iframe src="{node.frontmatter.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        {/if}
    </div>
</div>

<style lang='scss'>
    .video {
        // padding: 5rem 5rem;
        position: relative;
    }
    .title input {
        font-size: 36pt;
        width: 36px;
        height: 36px;
        border-radius: 8px;
    }

    .video iframe {
        border: 0;
        height: 92%;
        left: 0;
        position: absolute;
        top: 0;
        width: 92%;
        border-radius: 12px;
        margin: 1rem 1rem;
        /* min-width: 10rem; */
    }
</style>