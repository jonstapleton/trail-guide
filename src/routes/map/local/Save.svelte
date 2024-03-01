<script lang='ts'>
    import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'
    import { createEventDispatcher } from "svelte";
    import { mapData } from "../../store";

    const dispatch = createEventDispatcher()

    let value = 'map.json'
    const blob = new Blob([ JSON.stringify($mapData.toRes()) ], { type: 'application/json' });
    let url = URL.createObjectURL(blob)

    function close() {
        dispatch('close')
    }
</script>

<div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Save Your Progress</p>
      <button on:click={close} class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
        <p>Set a filename, and click the "save" button to save your map in the form of a JSON file. To load your map, click the "Load" button from the Map page.</p>
        <div class='field has-addons mt-5'>
            <div class='control is-expanded'>
                <input bind:value={value} class='input'>
            </div>
            <div class='control'>
                <a href={url} class='button is-dark' download={value}>
                    Save
                    <span class='ml-2'><Fa icon={ faSave } /></span>
                </a>
            </div>
        </div>
    </section>
    <footer class="modal-card-foot">
      <!-- <button class="button is-success">Save changes</button>
      <button class="button">Cancel</button> -->
    </footer>
</div>