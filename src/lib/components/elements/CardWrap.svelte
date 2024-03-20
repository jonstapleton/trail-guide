<article class='panel-card horizontal'>
    <!-- <header class='card-header is-dark'>
        <h2 class='card-header-title mb-3 pb-0'>A Tutorial</h2>
        <button class="card-header-icon" aria-label="close">
            <span class="icon">
              <Fa icon={faClose} />
            </span>
        </button>
    </header> -->
    <section class='card-content'>
        <slot />
    </section>
</article>

<style lang='scss'>
    .panel-card.horizontal {
        margin: 2rem;
        min-width: 20rem;
        max-width: 80hh;
        // max-height: 85vh;
        background-color: white;
        display: inline-block;
        position: relative;
        vertical-align: top;
        section {
            position: static;
        }
    }
    h2.large {
        font-size: larger;
    }
    header {
        position: relative;
        z-index: 1;
    }
    section {
        z-index: 0;
        overflow-y: scroll;
        max-height: 80vh;
    }
</style>