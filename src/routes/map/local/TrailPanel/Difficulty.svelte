<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faFire } from '@fortawesome/free-solid-svg-icons';
    import { mapData } from "../../../store";
    import "$lib/styles/number.scss"
    export let node:string
</script>

<span data-tooltip="Difficulty" class='has-tooltip-arrow number {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? 'visible':'invisible'}'>
    {$mapData.projectObj[node].frontmatter.difficulty || $mapData.projectObj[node].frontmatter.difficulty == 0? $mapData.projectObj[node].frontmatter.difficulty : ""}
    <Fa style='margin-left: 4px; color: darkorange;' icon={faFire} />
</span>
<style lang='scss'>
    span {
    color: black;
}
span.number {
    font-size: 11pt;
    position: relative;
    top: -3pt;
    background-color: white;
    border: 1px solid lightgray;
    margin-right: 0;
}
</style>