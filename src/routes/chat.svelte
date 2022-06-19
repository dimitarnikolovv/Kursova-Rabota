<script>
    import { goto } from '$app/navigation';
    import { auth, db } from '../services/firebase';
    import Chat from '../components/Chat.svelte';
    import { onDestroy } from 'svelte';
    import Filter from 'bad-words';
    import { groupes } from '../stores/group';

    const unsubscribe = db
        .collection('messages')
        .orderBy('createdAt')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    messages = [...messages, change.doc.data()];
                    setTimeout(() => {
                        if (document.getElementById('scroll-to'))
                            document
                                .getElementById('scroll-to')
                                .scrollIntoView({ behavior: 'smooth' });
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

    onDestroy(unsubscribe);
</script>

<div class="wrapper">
    {#if typeof user === 'undefined'}
        <p><i /> Loading</p>
    {:else if user}
        <button class="log-out" on:click={logout}>Log Out</button>
        <button
            class="groups"
            on:click={() => {
                goto('/group');
            }}>Groups</button
        >
        <h1>Chatroom: {$groupes}</h1>
        <div class="chat-wrap">
            <div class="chat-area">
                {#if messages.length > 0}
                    {#each messages as m}
                        <Chat {...m} self={user.uid === m.uid} />
                    {/each}
                {:else}
                    <p>Looks like nobody's sent a message. Be the first!</p>
                {/if}
                <!-- Dummy element used to scroll chat -->
                <br id="scroll-to" />
            </div>
        </div>
        <textarea
            on:keydown={messageSubmit}
            bind:value
            type="text"
            class:cooldown
            placeholder={cooldown ? '3 second cooldown' : 'Enter message and press enter'}
        />
        <br />
    {:else}
        <p>Not logged in!</p>
    {/if}
</div>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
    }
    h1 {
        text-align: center;
    }

    .chat-wrap {
        display: flex;
        align-items: flex-end;
        height: 75vh;
        overflow: hidden;
        .chat-area {
            margin: 0 auto;
            width: 60%;
            max-height: 100%;
            overflow-y: scroll;

            @media only screen and (max-width: 1024px) {
                width: 95%;
            }
        }
    }
    .cooldown {
        background-color: lightcoral;
    }

    textarea {
        resize: none;
        height: fit-content;
        margin: 0 auto;
        width: 60%;
        margin-top: 0.8rem;

        @media only screen and (max-width: 1024px) {
            width: 95%;
        }
    }

    button {
        position: fixed;
        width: fit-content;
        &.log-out {
            right: 0.5rem;
        }
        &.groups {
            left: 0.5rem;
        }
    }
</style>
