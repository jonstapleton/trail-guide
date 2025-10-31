# trail-guide

## auth & user data

The CodeVA version of the `trail-guide` is designed to place the responsibility for user authentication in the hands of an external system, in this case the [CodeVA Client Portal](https://portal.codevirginia.org). The authentication workflow works like this:

1. The user clicks the `Login` button on the `trail-guide`
2. The user is directed to `https://portal.codevirginia.org` to login. The user is redirected back to the `trail-guide` afterward, along with the user data and a short-lived login token indicating that the user successfully logged in to the portal site.
3. The `trail-guide` validates the login token, then issues a longer-lived token to the user. The user's data is stored locally on the client side in a cookie, which is set to expire when the `trail-guide`-issued token expires.

The portal will only accept a authentication request from approved IPs and servers. Be sure to provide a secret key in the `Authorization` header when validating the login token.

The only user data the `trail-guide` expects to use are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| email | `string` | The user's email, taking the place of their username in the UI |
| first_name | `string` | The user's first name |
| last_name | `string` | The user's last name |
| id | `int` | The user's ID, the primary key in the portal database |

The `trail-guide` handles the rest of the user-associated data by connecting users to anonymized `trail-guide` data (e.g., node completion, backpack, etc.).

---

# sv docs

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
