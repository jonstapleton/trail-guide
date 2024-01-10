<script>
    import {base} from '$app/paths';
    import CodeVA from '$lib/assets/CodeVA_Logo_Primary_White.png'
    
    let burger = {
        active: false
    }
    function toggleMenu() {
        burger.active = !burger.active;
    }
</script>

<nav class='navbar is-dark'>
    <div class='navbar-brand logo'>
        <a class="navbar-item" href="{base}/">
            <img alt="The CodeVA Logo" src="{CodeVA}" height="28">
        </a>
        <button on:click={toggleMenu} class="navbar-burger {burger.active ? 'is-active' : ''}" aria-label="menu" aria-expanded="{burger.active}" data-target="nav-menu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </button>
    </div>
    <div id='nav-menu' class="navbar-menu {burger.active ? 'is-active' : ''}">
        <div class="navbar-end">
            <a class="navbar-item"
                href='{base}/'
            >
                Home
            </a>
            <a class="navbar-item"
                href='{base}/contact'
            >
                Contact Us!
            </a>
        </div>
    </div>
</nav>

<style lang='scss'>
    nav {
        border-bottom: 1px;
        border-color: whitesmoke;
        border-bottom-style: solid;
    }
</style>