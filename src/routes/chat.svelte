<script>
    import { goto } from '$app/navigation';
    import { auth, db } from '../services/firebase';
    import Chat from '../components/Chat.svelte';
    import { onDestroy } from 'svelte';
    import Filter from 'bad-words';
    import { groupes } from '../stores/group';

    const unsubscribe = db.collection('messages').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                messages = [...messages, change.doc.data()];
                setTimeout(() => {
                    if (document.getElementById('scroll-to'))
                        document.getElementById('scroll-to').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        });
    });

    let user;
    let messages = [];
    let cooldown = false;
    let value;

    auth.onAuthStateChanged((u) => (user = u));

    $: {
        if (user === null) goto('/');
    }

    function messageSubmit(e) {
        if (e.key.toLowerCase() !== 'enter') return;
        if (cooldown) return;

        const message = new Filter().clean((value || '').trim());

        if (!message) return;

        value = '';
        cooldown = true;
        setTimeout(() => (cooldown = false), 3000);

        db.collection('messages').add({
            message,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            createdAt: Date.now(),
            group: $groupes,
        });
    }

    function logout() {
        if (auth.currentUser) {
            auth.signOut()
                .then(() => {})
                .catch((e) => {
                    throw new Error(e);
                });
        }
    }

    auth.onAuthStateChanged((u) => (user = u));

    $: {
        if (user === null) goto('/');
    }

    onDestroy(unsubscribe);
</script>

{#if typeof user === 'undefined'}
    <p class="w3-center w3-section"><i class="fas fa-spinner w3-spin fa-3x" /> Loading</p>
{:else if user}
    <h1 class="w3-jumbo w3-center">Glass</h1>
    <p class="w3-center">Chatroom {$groupes}</p>
    <p class="w3-center"><button class="w3-button w3-blue" on:click={logout}>Logout</button></p>

    <br />
    <div
        class="w3-container w3-border w3-border-gray"
        style="margin: 0 auto; width: 60%; height: 600px; overflow-y: auto;"
    >
        <br />
        {#if messages.length > 0}
            {#each messages as m}
                <Chat {...m} self={user.uid === m.uid} />
            {/each}
        {:else}
            <p class="w3-center w3-text-gray">Looks like nobody's sent a message. Be the first!</p>
        {/if}
        <!-- Dummy element used to scroll chat -->
        <br id="scroll-to" />
    </div>
    <input
        on:keydown={messageSubmit}
        bind:value
        type="text"
        style="margin: 0 auto; width: 60%; margin-top: -1px"
        placeholder={cooldown ? '3 second cooldown' : 'Enter message and press enter'}
        class="w3-input w3-border w3-border-gray {cooldown && 'w3-pale-red'}"
    />
    <br />
{:else}
    <p class="w3-center w3-section">Not logged in!</p>
{/if}
