import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { Map } from "./map/local/elements/Map";

interface Backpack {
    projects:string[], // paths to index on projectObj
    tutorials:string[], // paths to index on nodeObj
}

export const mapData:any = writable()
export const backpack:any = writable()


