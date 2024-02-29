<script lang='ts'>
    export let data;
</script>

<div class='homepage hero is-fullheight-with-navbar'>
    <div class='hero-body'>
        <div class='container has-text-centered'>
            <h1 class='title'>{data.config.title}</h1>
            <p class='subtitle'>A CodeVA Curriculum Trail Guide</p>
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
</style>