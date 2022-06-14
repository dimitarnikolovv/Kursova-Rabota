import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const groupes = writable((browser && localStorage.getItem('group')) || '');
groupes.subscribe((val) => {
    if (browser) return (localStorage.group = val);
});
