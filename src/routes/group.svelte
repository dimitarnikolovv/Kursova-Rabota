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

    function groupSubmit(e) {
        if (e.key.toLowerCase() !== 'enter') return;

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
</script>

<h1 class="w3-jumbo w3-center">Choose or create group</h1>

<input
    on:keydown={groupSubmit}
    bind:value
    type="text"
    style="margin: 0 auto; width: 60%; margin-top: -1px"
    class="w3-input w3-border w3-border-gray"
/>
