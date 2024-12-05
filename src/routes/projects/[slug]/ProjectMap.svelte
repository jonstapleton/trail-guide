<script lang='ts'>
    import { mapData } from "../../store";
    import Fa from 'svelte-fa'
    import { faLocationDot, faCheck } from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";
    import type { Tutorial } from "../../map/local/elements/Tutorial";
    export let id:string
    export let selectedNode:string

    // let rows:any = {
    //     "intro": {
    //         nodes: ["setup", "next", "last"],
    //         indices: [1,2,3],
    //         edges: ["edgeRight", "edgeRight", "edgeRight edgeDown"]
    //         row: 1
    //     },
    //     "animation": {
    //         nodes: ["$intro", "basic", "advanced"],
    //         indices: [null, 4,5], // last index + 1 because they will share a row
    //         row: 1
    //     }
    // }
    let rows:any = {}
    let rowsAppendCount:any = {}
    let rowNames:string[] = []
    // one row per simultaneous branch
    onMount(() => {
        let rowCount = 1
        for(const [k,v] of Object.entries($mapData.projectObj[id].map)) {
            // Copy the nodes to the `rows` object
            rows[k] = { nodes: [], indices: [], row: null, objs: [], edges: [] }
            rows[k].objs = v.nodes
            rows[k].nodes = v.list

            rows[k].row = rowCount
            rowNames = [...rowNames, k]

            rowsAppendCount[k] = 0

            // set initial edges values
            for(let i=1;i<=v.list.length;i++) {
                rows[k].edges = [...rows[k].edges, '']
            }

            // calculate indices offset
            let offset = 0
            if(v.list[0].charAt(0) == "$") {
                const key = v.list[0].replace('$', '')
                offset = rows[key].indices[rows[key].indices.length-1]
                
                rows[k].row += rowsAppendCount[key]
                rowsAppendCount[key] += 1

                if(rows[k].row != rows[key].row) {
                    rows[k].edges[0] += " edgeLeft"
                }

                // Give the new edges to the last node in the reference group
                rows[key].edges[rows[key].edges.length-1] += " edgeDown edgeRight"
            }
            // set indices
            for(let i=1;i<=v.list.length;i++) {
                const listWithoutRef = v.list.filter((e) => e.charAt(0) != "$")
                const classes = i == listWithoutRef.length ? '' : " edgeRight"
                rows[k].indices = [...rows[k].indices, i + offset]
                rows[k].edges[i-1] += classes
            }
        }
        console.log(rows)
    })

    function select(node:Tutorial) {
        selectedNode = node.path
    }


</script>

<div class='map'>
    <div class='nodes'>
        <!-- {#each $mapData.projectObj[id].nodes as node, i}
        <a on:click={() => selectedNode = i} class='level-item {i == 0? 'first':''} {i==$mapData.projectObj[id].nodes.length-1? "last":''}'>
            {#if selectedNode == i}
                <span class='select-icon'><Fa size="2x" icon={faLocationDot} /></span>
            {/if}
            <p>{node.frontmatter.title}</p>
            {#if node.completed}
            <span class='completed-icon'><Fa size="3x" icon={faCheck} /></span>
            {/if}
        </a>
        {/each} -->
        {#each rowNames as name}
            {#each rows[name].objs as node, i}
            <a 
                style="grid-column: {rows[name].indices[i]}; grid-row: {rows[name].row}"
                class='{rows[name].edges[i]}'
                on:click={() => select(node)}
            >
                {node.frontmatter.title}
                {#if $mapData.nodesByPath[node.path].completed}
                <span class='completed-icon'><Fa size="3x" icon={faCheck} /></span>
                {/if}
            </a>
            {/each}
        {/each}

    </div>
</div>

<style lang='scss'>
    .map {
        overflow-x: scroll;
        // padding-bottom: 4rem;
        border: 1px solid #dbdbdb;
        padding: 2rem;
        border-radius: 8px;
        background-color: whitesmoke;
        z-index: -90;
    }
    .nodes {
        display: grid;
        grid-template-columns: repeat(6, minmax(150px, 1fr));
        gap: 15px;
        grid-auto-rows: auto;
    }
    a {
        display:flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: auto;
        padding: 0 1rem;
        background-color: hsl(0, 0%, 21%);
        color: white;
        border: 3px solid hsl(0, 0%, 21%);
        border-radius: 8px;
        position: relative;
        &:hover {
            background-color: white;
            color: black;
            border: 3px dashed black;
            cursor: pointer;
            p {
                color: black;
            }
        }
    }
    a.edgeRight::after {
        display: inline-block;
        content: "";
        height: 10px;
        background: hsl(0, 0%, 21%);
        position: absolute;
        width: 20px;
        top: 50%;
        left: calc(100%);
        margin-top: -5px;
    }
    a.edgeDown::before {
        display: inline-block;
        content: "";
        height: 92%;
        background: hsl(0, 0%, 21%);
        position: absolute;
        width: 10px;
        top: 100%;
        left: calc(50%);
        margin-top: -5px;
        z-index: 0;
    }
    a.edgeLeft::before {
        display: inline-block;
        content: "";
        height: 10px;
        background: hsl(0, 0%, 21%);
        position: absolute;
        width: 64%;
        top: 50%;
        left: calc(-64%);
        margin-top: -5px;
        z-index: 0;
    }
    .completed-icon {
        position: absolute;
        top: -10px;
        right: 0;
        color: #75bc4a;
    }
</style>