<script>
    import Filter from 'bad-words';
    import { auth } from '../services/firebase';
    import { groupes } from '../stores/group';
    import { goto } from '$app/navigation';

    let user;
    let value;

    auth.onAuthStateChanged((u) => (user = u));

    $: {
        if (user === null) goto('/');
    }

    if (user === null) {
        goto('/');
    }

    function submitGroup() {
        let group = new Filter().clean(value || '').trim();

        if (!group) return;

        group = group.toLowerCase();

        value = '';

        if (localStorage.getItem('group') === group) {
            goto('/chat');
            return;
        }

        $groupes = group;

        setTimeout(() => {
            goto('/chat');
        }, 200);
    }

    function groupSubmitonEnter(e) {
        if (e.key.toLowerCase() !== 'enter') return;
        submitGroup();
    }
</script>

<div class="wrapper">
    <h1>Choose or create group</h1>

    <input
        on:keydown={groupSubmitonEnter}
        bind:value
        type="text"
        style="margin: 0 auto; width: 60%; margin-top: -1px"
    />

    <button type="button" on:click={submitGroup}>Enter Group</button>
</div>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        button {
            padding-inline: 1.2em;
            &:hover {
                background-color: lightgray;
            }
        }
    }
</style>
