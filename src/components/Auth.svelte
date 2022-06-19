<script>
    import { fade } from 'svelte/transition';
    import ErrorAlert from './ErrorAlert.svelte';
    import { auth } from '../services/firebase';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let authMode = 'login';
    let isAuthenticated = false;
    let err = '';

    let formEmailLogIn = '';
    let formPasswordLogIn = '';
    let formEmailReg = '';
    let formPasswordReg = '';
    let formConPasswordReg = '';

    function login() {
        const email = formEmailLogIn;
        const password = formPasswordLogIn;

        // basic form validation
        if (!email || !password) {
            err = 'Fill out all fields!';
            return;
        }
        err = '';

        // sign in using firebase
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                dispatch('done');
                dispatch('auth');
            })
            .catch((e) => {
                err = `(${e.code}) ${e.message}`;
            });
    }

    function register() {
        const email = formEmailReg;
        const password = formPasswordReg;
        const cpassword = formConPasswordReg;

        // form validation
        if (!email || !password || !cpassword) {
            err = 'Fill out all fields!';
            return;
        }
        if (password !== cpassword) {
            err = "Passwords don't match!";
            return;
        }
        err = '';

        // creating the user
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                dispatch('done');
                dispatch('auth');
            })
            .catch((e) => {
                err = `(${e.code}) ${e.message}`;
            });
    }

    function logout() {
        if (auth.currentUser) {
            auth.signOut()
                .then(() => {
                    dispatch('done');
                    dispatch('logout');
                })
                .catch((e) => {
                    throw new Error(e);
                });
        }
    }

    function google() {
        auth.signInWithPopup(googleAuth)
            .then(() => {
                dispatch('auth');
                dispatch('done');
            })
            .catch((e) => {
                err = `(${e.code}) ${e.message}`;
            });
    }

    auth.onAuthStateChanged((user) => {
        isAuthenticated = !!user;
        if (user) dispatch('auth');
    });
</script>

<div class="wrap">
    {#if !isAuthenticated}
        <div>
            <h2>
                {authMode === 'login' ? 'Login' : 'Register'} to Glass Chat
            </h2>
        </div>
        <div class="container">
            <div class="actions">
                <button
                    on:click={() => (authMode = 'login')}
                    style="width: 50%;"
                    class:active={authMode === 'login'}>LOGIN</button
                >
                <button
                    on:click={() => (authMode = 'register')}
                    style="width: 50%"
                    class:active={authMode === 'register'}>REGISTER</button
                >
            </div>
            <!-- Email login/register forms -->
            {#if authMode === 'login'}
                <form in:fade on:submit|preventDefault={login}>
                    {#if err}
                        <ErrorAlert message={err} />
                    {/if}
                    <div class="wrapper">
                        <input
                            bind:value={formEmailLogIn}
                            type="email"
                            placeholder="Enter your email"
                            id="l-email"
                        />

                        <input
                            bind:value={formPasswordLogIn}
                            type="password"
                            placeholder="Enter your password"
                            id="l-password"
                        />

                        <button type="submit">Login</button>
                    </div>
                </form>
            {:else}
                <form in:fade on:submit|preventDefault={register}>
                    {#if err}
                        <ErrorAlert message={err} />
                    {/if}
                    <div class="wrapper">
                        <input
                            bind:value={formEmailReg}
                            type="email"
                            placeholder="Enter your email"
                            id="r-email"
                        />

                        <input
                            bind:value={formPasswordReg}
                            type="password"
                            placeholder="Enter a password"
                            id="r-password"
                        />
                        <input
                            bind:value={formConPasswordReg}
                            type="password"
                            placeholder="Re-enter that password"
                            id="r-cpassword"
                        />
                        <button type="submit">Register</button>
                    </div>
                </form>
            {/if}
            <hr />
            <button on:click={google} style="align-self: center;"><i /> Sign in with Google</button>
        </div>
    {:else}
        <div>
            <h2>Logged in</h2>
        </div>
        <div>
            <div><i /></div>
            <div>Logged in</div>
            <div>
                <button on:click={logout}>Log out</button>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .wrap {
        width: 40%;
        margin: 1rem auto;

        @media only screen and (max-width: 1024px) {
            width: 95%;
        }
    }
    h2 {
        text-align: center;
    }
    button {
        width: 80%;

        &:hover {
            background-color: lightgray;
        }
    }
    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-block: 3.5rem 2rem;

        input {
            width: 80%;
        }
    }
    .container {
        display: flex;
        flex-direction: column;
        .actions {
            display: flex;
            flex-direction: row;

            button {
                border-radius: 0;
                border: none;
                &.active {
                    background-color: blue;
                    color: lightgray;
                    &:hover {
                        background-color: rgba(82, 82, 247, 0.932);
                    }
                }
            }
        }
    }
</style>
