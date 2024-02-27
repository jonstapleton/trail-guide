<script>
  import Nav from "$lib/components/elements/Nav.svelte";
  import Test from "$lib/components/elements/Test.svelte";
  import "../app.scss";
  // import hljs from 'highlight.js';
  import 'highlight.js/styles/a11y-light.min.css';
  import {mapData} from './store'
  import { Map } from '../routes/map/local/mapNodes'

  export let data;

  $mapData = new Map(data.res)
</script>

<Nav />
<slot />
