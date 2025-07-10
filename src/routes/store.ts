import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { Map } from "./map/local/elements/Map";

export const mapData:any = writable()

