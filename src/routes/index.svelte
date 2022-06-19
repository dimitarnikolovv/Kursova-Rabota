<script>
    import Auth from '../components/Auth.svelte';
</script>

<Auth on:auth={() => (window.location.href = '/group')} />
