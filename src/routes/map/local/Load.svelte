<script>
    import Dropzone from "svelte-file-dropzone";
    import { createEventDispatcher } from "svelte";
    import FileRow from "./FileRow.svelte";

    const dispatch = createEventDispatcher()
    let row;
    
    let files = {
        accepted: [],
        rejected: []
    };

    function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    function close() {
        dispatch('close')
    }
    function loadMap() {
        if(files.accepted.length == 1) {
            const obj = row.getContents()
            dispatch('load', obj)
            close()
        }
    }

    
</script>
  
<div class='modal-card'>
    <header class="modal-card-head">
        <p class="modal-card-title">Load a Map File</p>
        <button on:click={close} class="delete" aria-label="close"></button>
    </header>
    <section class='modal-card-body'>
        <p class='block'>Use the area below to upload files.</p>
        {#if files.accepted.length == 0}
        <Dropzone accept={['application/json']} multiple={false} on:drop={handleFilesSelect}>
            <p>Drag and drop a file here, or click to select a file.</p>
        </Dropzone>
        {/if}
        <ul class='my-5'>
        {#if files.accepted.length > 0}
        <FileRow bind:this={row} item={files.accepted[0]} />
        {/if}
        </ul>
        <p class='block'>The files must be in the correct format--do not attempt to upload files that you did not download from the Map page, and do not upload a file that contains potentially sensitive data.</p>
    </section>
    <footer class="modal-card-foot">
        <button on:click={loadMap} disabled={files.accepted.length == 0} class="is-fullwidth button is-success">Load Map</button>
    </footer> 
</div>