<script>
    import md5 from 'md5';
    import { groupes } from '../stores/group';

    export let photoURL = '';
    export let group = '';
    export let createdAt = 0;
    export let email = '';
    export let message = '';
    export let uid = '';
    export let self = false;
</script>

{#if group === $groupes}
    <div
        title={`${email} (${uid}) at ${new Date(createdAt)}`}
        class="wrapper"
        style={self && 'flex-direction: row-reverse;'}
    >
        <img
            src={photoURL || `https://www.gravatar.com/avatar/${md5(email)}?d=mp&s=32&r=g`}
            style="width: 36px; height: 36px; border-radius: 100vw 100vw {self
                ? '100vw 0'
                : '0 100vw'};"
            alt="avatar"
        />
        <span class:self class="message" style="margin: 0 6px;">{message}</span>
    </div>
{/if}

<style lang="scss">
    .wrapper {
        display: flex;
        align-items: flex-end;
        margin-bottom: 0.5rem;
    }
    .message {
        background-color: rgb(211, 211, 211);
        padding-inline: 1.2em;
        padding-block: 0.4em;
        border-radius: 20px 20px 20px 0;
        max-width: 92%;
    }
    .self {
        background-color: rgb(50, 50, 104);
        color: white;
        border-radius: 20px 20px 0 20px;
    }
</style>
