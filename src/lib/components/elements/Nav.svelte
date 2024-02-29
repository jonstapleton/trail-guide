<script>
    import {base} from '$app/paths';
    import CodeVA from '$lib/assets/CodeVA_Logo_Primary_White.png'
    import { faHammer, faHome, faLocationDot, faMap } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa'
    
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
                <Fa icon={faHome} /><span class='ml-3'>Home</span>
            </a>
            <a class="navbar-item"
                href='{base}/map'
            >
                <Fa icon={faMap} /><span class='ml-3'>Map</span>
            </a>
            <a class="navbar-item"
                href='{base}/projects'
            >
                <Fa icon={faHammer} /><span class='ml-3'>Projects</span>
            </a>
            <a class="navbar-item"
                href='{base}/tutorials'
            >
                <Fa icon={faLocationDot} /><span class='ml-3'>Tutorials</span>
            </a>
            <a class="navbar-item"
                href='https://curriculum.codevirginia.org/contact'
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