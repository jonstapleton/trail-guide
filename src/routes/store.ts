import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { Map } from "./map/local/mapNodes";

export const mapData:any = writable()

