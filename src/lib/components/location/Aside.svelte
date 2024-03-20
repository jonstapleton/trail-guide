<script lang='ts'>
    import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa'
</script>

<svelte:options customElement={{
    tag: 'aside-box'
}} />

<article class='box aside-card'>
    <div class='columns is-mobile is-vcentered'>
        <div class='column is-narrow'>
            <Fa icon={faExclamationTriangle} size="1.75x" />
        </div>
        <div class='column'>
            <slot />
        </div>
    </div>
</article>

<style lang='scss'>
    article.aside-card {
        font-size: 11pt;
        background-color: whitesmoke;
    }
    @import "../../../app.scss";
    
</style>