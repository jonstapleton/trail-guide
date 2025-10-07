<script lang='ts'>
    const loggedIn = false;
</script>

<nav>
    <ul>
        <li>Logo & Brand</li>
    </ul>
    <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/map">Open the Map</a></li>
        <li><a href="/projects">Project Guides</a></li>
        <li><a href="/tutorials">Tutorials</a></li>
        <div class='auth'>
            {#if !loggedIn}
            <li><a class='secondary' role='button' href="/user/login">Login</a></li>
            <li><a role='button' href='/user/signup'>Sign Up</a></li>
            {:else}
            <li><a href="/user">My Account</a></li>
            {/if}
        </div>
    </ul>
</nav>

<style lang='scss'>
    nav {
        padding: 0 1rem;
    }
    .auth li {
        padding: 0;
        margin: 0;
    }
    .auth {
        margin-left: 2rem;
    }
</style>