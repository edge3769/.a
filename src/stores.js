import { writable } from 'svelte/store'

function simpleStore() {
    const { subscribe, set } = writable([])

    return {
        subscribe,
        set: (value) => set(value)
    }
}

export const logged = simpleStore()
export const myTags = simpleStore()
export const groupTags = simpleStore()