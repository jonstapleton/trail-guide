import { parse } from '$lib/parsing/parser'
import { base } from '$app/paths'
import { read } from 'to-vfile'
import { loadConfig } from '$lib/config.js'
import { mapData } from '../../store.js'

export async function load({ params, fetch }) {

    return {
        path: params.slug
    }
}

export const prerender = true