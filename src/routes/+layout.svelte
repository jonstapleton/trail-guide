<script>
  import Nav from "$lib/components/elements/Nav.svelte";
  import "../app.scss";
  import { writable } from "svelte/store"
</script>

<Nav />
<slot />
