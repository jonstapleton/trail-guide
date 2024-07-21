<script lang='ts'>
    let zoom:string;
    let coords:string;
    let url:string = "/map?"
    function calcUrl(coords:string, zoom:string):string {
        let url = "/map?"
        let paramCount = 0
        if(coords) { url = url + "xy=" + coords; paramCount++ }
        if(zoom) { url += (paramCount > 0? "&" : "") + "zoom=" + zoom }

        return url
    }

    $: url = calcUrl(coords, zoom)
</script>

<div class='card urldebugger'>
    <div class='card-content'>
        <div class='field'>
            <label>Coords:</label>
            <input class='input' bind:value={coords} >
        </div>
        <div class='field'>
            <label>Zoom:</label>
            <input class='input' bind:value={zoom} >
        </div>
        <p>{url}</p>
    </div>
    <div class='card-footer'>
        <a href={url} class='button is-primary is-fullwidth'>Change</a>
    </div>
</div>

<style lang='scss'>
    .urldebugger {
        width: 30rem;
    }
</style>