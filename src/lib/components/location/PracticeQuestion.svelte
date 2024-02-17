<script lang='ts'>

</script>

<svelte:options customElement="practice-question" />

<div class='practice-question'>
    <slot />
    <div class='ui has-text-right'>
        <button class='button'>Check Answers</button>
    </div>
</div>

<style lang='scss'>
    @import "../../../app.scss"
</style>