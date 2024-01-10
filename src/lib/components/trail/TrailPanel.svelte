<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
    import TrailCard from './TrailCard.svelte';
</script>
<div class="panel m-2">
    <p class="panel-heading">
        Trails
        <span class='icon'><Fa icon={faChevronDown} /></span>
    </p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Search">
        <!-- <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span> -->
      </p>
    </div>
    <p class="panel-tabs">
      <a class='is-active'>Trails</a>
      <a>Locations</a>
      <a>Sources</a>
      <a>Forks</a>
    </p>
    <div class='p-2'>
        <TrailCard />
    </div>
</div>

<style>
    .icon {
        float: right;
    }
</style>