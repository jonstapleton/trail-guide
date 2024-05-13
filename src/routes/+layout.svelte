<script lang='ts'>
  import Nav from "$lib/components/elements/Nav.svelte";
  import Test from "$lib/components/elements/Test.svelte";
  import "../app.scss";
  // import hljs from 'highlight.js';
  import 'highlight.js/styles/a11y-light.min.css';
  import {mapData} from './store'
  import { Map } from '../routes/map/local/mapNodes'
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  export let data;

  // console.log("Group Count:", (data.map.nodes.filter((obj:any) => obj.type == "group")).length)
  console.log(data.map.groups)

  let local
  if(browser) {
      console.log("Trying to read localStorage...")
      local = window.localStorage.getItem('map')
  }

  mapData.subscribe((value:Map) => {
      if (browser && value) {
          console.log("Saving data...")
          window.localStorage.setItem('map', JSON.stringify(value.toRes()));
      }
  });
 
  if(data.config.local && local) {
    console.log("Got localStorage!")
    $mapData = new Map(JSON.parse(local))
  } else {
    $mapData = new Map(data.map)
  }
</script>

<Nav />
<slot />
