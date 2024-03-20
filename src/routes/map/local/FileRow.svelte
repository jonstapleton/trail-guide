<script lang='ts'>
    import { faClose } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa'

    export let item:any

    let fileData = {
        projects: [],
        nodes: [],
        completedProjects: [],
        completedNodes: [],
        obj: {}
    }
    
    async function analyze(item:any) {
        var success = function ( content ) {
            // console.log(JSON.parse(content));
            fileData.obj = JSON.parse(content)
            fileData.projects = fileData.obj.projects
            fileData.nodes = fileData.obj.nodes

            for(let i=0; i<fileData.projects.length; i++) {
                if(fileData.projects[i].completed) {
                    fileData.completedProjects = [...fileData.completedProjects, fileData.projects[i]]
                }
            }
            for(let i=0; i<fileData.nodes.length; i++) {
                if(fileData.nodes[i].completed) {
                    fileData.completedNodes = [...fileData.completedNodes, fileData.nodes[i]]
                }
            }
        }

        var fileReader = new FileReader( );
        fileReader.onload = function ( evt ) { success( evt.target.result ) };
        fileReader.readAsText( item );
    }

    $: analyze(item)
    
    export function getContents() {
        return fileData.obj
    }
</script>

<li class='box is-inline-block'>
    <p>
        <span class='has-text-weight-bold is-size-5'>{item.name}</span>
        <span class='is-italic ml-4'>Projects: {fileData.completedProjects.length} / {fileData.projects.length}</span>
        <span class='is-italic ml-4'>Tutorials: {fileData.completedNodes.length} / {fileData.nodes.length}</span>
    </p>
    <button class='button is-small is-danger has-icon-right'><span><Fa size="1.5x" icon={ faClose} /></span></button>
</li>

<style lang='scss'>
    li {
        display: inline-block;
        position: relative;
        width: 100%;
        background-color: whitesmoke;
    }
    button {
        position: absolute;
        right: 0;
        top: 1rem;
        margin-right: 1rem;
    }
    span {
        position: relative;
        top: 2px;
    }
</style>