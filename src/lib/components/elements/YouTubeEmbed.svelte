<script lang='ts'>
    export let url="https://www.youtube.com/embed/14I8C6FKINQ"
</script>

<div class='video'>
    <iframe src="{url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<style lang='scss'>
    .video iframe {
        border: 0;
        min-height: 15rem;
        left: 0;
        // position: absolute;
        top: 0;
        width: 100%;
        border-radius: 12px;
        // margin: 1rem 1rem;
        /* min-width: 10rem; */
    }
</style>