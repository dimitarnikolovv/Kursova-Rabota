<script>
    import Auth from '../components/Auth.svelte';

    export let qs;
</script>

<h1>Authenticate to Glass</h1>
<Auth on:auth={() => (window.location.href = qs.next || '/')} />
