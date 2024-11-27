<script lang='ts'>
  import Nav from "$lib/components/elements/Nav.svelte";
  import Test from "$lib/components/elements/Test.svelte";
  import "../app.scss";
  // import hljs from 'highlight.js';
  import 'highlight.js/styles/a11y-light.min.css';
  import {mapData} from './store'
  import { Map } from '../routes/map/local/elements/Map'
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  export let data;


  let local
  if(browser) {
      console.log("Trying to read localStorage...")
      local = window.localStorage.getItem('map')
  }

  // TODO: fix local storage
  // mapData.subscribe(async (value:Map) => {
  //     if (browser && value) {
  //         console.log("Saving data...")
  //         const d = await JSON.stringify(await value.toRes())
  //         window.localStorage.setItem('map', d);
  //     }
  // });
 
  if(data.config.local && local) {
    console.log("Got localStorage!")
    $mapData = new Map(JSON.parse(local))
  } else {
    $mapData = new Map(data.map)
  }
</script>

<Nav />
{#if data.config.status == 'draft'}
<aside class='warning'>
  <p class='mb-2'><strong>⚠️ This website is still in progress!</strong></p>
  <p>
    You may notice bugs, weird behavior, and missing content. If you have questions or requests, please email <a href="mailto:jonstapleton@codevirginia.org">jonstapleton@codevirginia.org</a>.
  </p>
</aside>
{/if}
<slot />

<style lang='scss'>
  aside {
    width: 300px;
    position: absolute;
    right: 0;
    border: 1px solid black;
    border-radius: 8px;
    padding: 1rem 1rem;
    margin: 1rem 1rem;
    background-color: whitesmoke;
    p > strong {
      font-size: 11pt
    }
    p {
      font-size: 9pt;
    }
  }
</style>
