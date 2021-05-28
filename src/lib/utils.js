import marked from 'marked'
marked.setOptions({breaks: true, gfm: true})

export {marked}

export let telegram_link_regex = /https:\/\/t.me\//
export let not_empty_telegram_link_regex = /https:\/\/t.me\/\S+/
export let abslink = /\S+:\/\//

export function get(endpoint) {
    return fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json())
}

export function post(endpoint, data) {
    return fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json())
}