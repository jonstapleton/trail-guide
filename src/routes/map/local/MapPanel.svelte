<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faMap, faLocationDot, faDownload, faGear, faUpload } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte'
    
    export let selected:string|null
    function select (name:string) {
        if(selected == name) {
            selected = ''
        } else {
            selected = name
        }
    }
</script>

<div class='map-panel'>
    <a on:click={() => select('Projects') } class='button round {selected == 'Projects'? 'highlighted' : ''}'>
        <Fa icon={faMap} size='2x' />
        <span class='button-text'>Projects</span>
    </a>
    <a on:click={() => select('Tutorials') } class='button round {selected == 'Tutorials'? 'highlighted' : ''}'>
        <Fa icon={faLocationDot} size='2x' />
        <span class='button-text'>Tutorials</span>
    </a>
    <div class='bottom'>
        <a class='button round'>
            <Fa icon={faUpload} size='1.5x' />
            <span class='button-text'>Load</span>
        </a>
        <a class='button round'>
            <Fa icon={faDownload} size='1.5x' />
            <span class='button-text'>Save</span>
        </a>
        <a class='button round'>
            <Fa icon={faGear} size='1.5x' />
            <span class='button-text'>Settings</span>
        </a>
    </div>
</div>

<style lang='scss'>
    .map-panel {
        position: relative;
        display: inline-block;
        height: 100%;
        // background-color: pink;
    }
    .button-text {
        font-style: italic;
        font-size: 80%;
    }
    .round {
        text-align: center;
        width: 6rem;
        height: 6rem;
        border-radius: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        &:hover {
            text-decoration: underline;
        }
    }
    .bottom {
        position: absolute;
        bottom: 4rem;
        .round {
            width: 4rem;
            height: 4rem;
        }
    }
    .highlighted {
        background-color: whitesmoke;
    }
</style>