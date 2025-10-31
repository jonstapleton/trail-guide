<script lang='ts'>
  import type { PageProps } from './$types'
  let { data }: PageProps = $props()
</script>

<div class='container'>
  <h1>Guides</h1>
  {#each data.guides as guide}
    <article>
      <p>{guide.title}</p>
    </article>
  {/each}
</div>
