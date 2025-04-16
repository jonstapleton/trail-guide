<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faMap, faLocationDot, faDownload, faGear, faUpload, faBagShopping, faFolder, faRoute } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte'
    import Save from './Save.svelte';
    import Load from './Load.svelte';
    import { mapData } from '../../store';
    import Map from './Map.svelte';
    import Capture from './Capture.svelte';
    
    export let selected:string[] = []
    function select (name:string) {
        if(selected.includes(name)) {
            // remove name from array
            selected.splice(selected.indexOf(name), 1)
            selected = selected
        } else {
            // add name to array
            selected = [...selected, name]
        }
    }

    $: console.log(selected)

    let active = false

    function loadMap(e:any) {
        console.log("Loading map...")
        console.log(e.detail)
        // TODO: $mapData = new Map(e.detail)
    }
</script>

<div class='map-panel'>
    <!-- <a class='button round'>
        <Fa icon={faFolder} size='2x' />
        <span class='button-text'>Projects</span>
    </a> -->
    <Capture on:capture>
        <a  on:click={() => select('Maps') } 
            class='button round {selected.includes("Maps") ? 'highlighted' : ''}'
        >
            <Fa icon={faRoute} size='2.5x' />
            <span class='button-text'>Projects</span>
        </a>
    </Capture>
    <Capture on:capture>
        <a on:click={() => select('Tutorials') } 
            class='button round {selected.includes('Tutorials')? 'highlighted' : ''}'
        >
            <Fa icon={faLocationDot} size='2x' />
            <span class='button-text'>Tutorials</span>
        </a>
    </Capture>
    <!-- TODO:
    <div class='bottom'>
        <Capture on:capture>
            <button on:click={() => active = true} class='button round'>
                <Fa icon={faUpload} size='1.5x' />
                <span class='button-text'>Load</span>
            </button>
            <button class='button round'>
                <Fa icon={faDownload} size='1.5x' />
                <span class='button-text'>Save</span>
            </button> -->
            <!-- <a class='button round'>
                <Fa icon={faGear} size='1.5x' />
                <span class='button-text'>Settings</span>
            </a> -->
        <!-- </Capture> -->
    <!-- </div> -->
    
    <div class="modal {active? 'is-active' : ''}">
        <div on:click={() => active = false} class="modal-background"></div>
        <Load on:load={loadMap} on:close={() => active = false} />
    </div>
</div>

<style lang='scss'>
    .map-panel {
        position: relative;
        display: inline-block;
        height: 100%;
        // background-color: white;
        // border-right: black solid 1px;
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