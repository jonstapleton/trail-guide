<script lang='ts'>
    export let trail:object = {
        frontmatter: { title: "No title!" }
    }
</script>

<article class='trail-info content'>
    <h2 class='card-header-title'>{trail.frontmatter.title}</h2>
    {@html trail.content}
</article>