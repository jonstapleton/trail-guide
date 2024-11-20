<script lang='ts'>
    import { mapData } from "../../../store";
    export let node:string
</script>

<div class='control px-2'>
    <label class='radio'>
        <input type='checkbox' name='complete' bind:checked={$mapData.projectObj[node].completed}>
    </label>
</div>