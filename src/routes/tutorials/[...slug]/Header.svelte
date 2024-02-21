<script lang='ts'>
    import { base } from '$app/paths'

    interface Frontmatter {
        title:string,
        nodes?:string[],
        video?:string,
        description?:string
    }
    export let frontmatter:Frontmatter;
</script>

<div class='tutorial-header p-5'>
    <div class='columns'>
        <div class='column content'>
            <h1>{frontmatter.title}</h1>
            <blockquote class='is-italic'>{frontmatter.description}</blockquote>
            {#if frontmatter.video}
            <p>Watch the video to see someone demonstrate the basics, or read on to work through it on your own. This concept is a part of several projects; check them out on <a href="{base}/map">the map</a>!</p>
            {/if}
        </div>
        {#if frontmatter.video}
        <div class='video column is-half'>
            <iframe src="{frontmatter.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        {/if}
    </div>
</div>

<style lang='scss'>
    .video {
        // padding: 5rem 5rem;
        position: relative;
    }

    h1 {
        font-size: 36pt;
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