<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
    import {base} from '$app/paths'
    import { mapData } from '../../../store';

    export let node:string
</script>

<a target="_blank" href="{base}/{$mapData.projectObj[node].path}" class='ml-2 button is-small hoverable {$mapData.projectObj[node].selected? "selected":""}'>
    <span>Open</span>
    <span class='icon'>
        <Fa icon={faArrowUpRightFromSquare} />
    </span>
</a>

<style>
    a {
        position: relative;
        top: -3pt;
    }
</style>