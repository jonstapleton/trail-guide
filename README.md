# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## practice-question

The `practice-question` directive allows authors to include multiple-choice questions in `Tutorials`. Here's an example practice question:

```markdown
:::practice-question{title="An Example Question"}
Here's some question text, posing a question for the reader to answer

a. [x] this is the correct answer
+ Feedback to be displayed when the reader answers correctly selects this option
b. [ ] this is a distractor
- Feedback to display when the reader incorrectly selects this option
c. [ ] this is a distractor
:::
```

The parser does several things with these questions:

1. Adds the questions and their data to the `Tutorial` frontmatter
2. Converts the slotted HTML content into props to pass to the `practice-question` custom element, which will render the question in the body of `Tutorial` pages
3. TODO: registers the `practice-question` data with the API, generating an endpoint and metadata about the question