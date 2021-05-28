import { writable } from 'svelte/store'

function simpleStore() {
    const { subscribe, set } = writable([])

    return {
        subscribe,
        set: (value) => set(value)
    }
}

export const tags = simpleStore()
export const open = simpleStore()
export const search = simpleStore()
export const logged = simpleStore()
export const context = simpleStore()
export const myTags = simpleStore()
export const userTags = simpleStore()
export const username = simpleStore()
export const isSideNavOpen = simpleStore()