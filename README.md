# The Trail Guide

The `trail-guide` is a static site builder that produces sites like the [Twine Trail Guide](https://curriculum.codevirginia.org/twine-trail-guide). The `trail-guide` repository consumes content organized within a `modules` folder and produces a static site that can be published via GitHub Pages or another similar hosting service.

## Trail Guide Terms & Assumptions

## Trail Guide Structure

The `trail-guide` is designed to be used as a git submodule within a larger repository with the following structure:

```
README.md
modules/
	meta.md
	region-map.canvas
	activities/
	applications/
	concepts/
	projects/
static/
trail-guide/
```

## Modules

The `modules` directory contains all of the text content to appear on the website. Each subdirectory has a particular purpose:

### Tutorial Elements (Concepts & Applications)

The `concepts` and `applications` directories contain tutorial elements. The `concepts` elements should detail broadly applicable programming concepts (e.g., variables, "if" statements), and `applications` elements should provide details about how those concepts should be applied in a given domain/context using a given tool. Most of the time, one Concept will be connected to several Applications. 

### Activities

The `activities` directory contains practical prompts designed to help learners practice related concepts. Each Activity should be connected to one or more Concepts or Applications in the `region-map.canvas`. Connected tutorial elements will contain a link to the activity in the "Activity" tab at the top of their associated page and map card. Some Applications will be Landmarks (i.e., tutorial elements at the end of a Project).

### Projects

Elements in the `projects` directory describe large "capstone" projects which require learners to synthesize a large number of concepts and/or applications. Projects always end with a Landmark: an Application element containing a prompt for the culminating project. They also always define an ordered list of `nodes` in the element frontmatter. These Nodes are references to the Concepts and Applications learners must draw on to successfully complete the Project.

## Directives

The `trail-guide` supports several "directives", special extensions to Markdown purpose-built for useful elements. Below, you'll find documentation for each directive supported in the `trail-guide`.

### practice-question

The `practice-question` directive allows authors to include multiple-choice questions in `Tutorials`. Here's an example practice question:

```markdown
:::practice-question{title="An Example Question"}
Here's some question text, posing a question for the reader to answer

- [x] this is the correct answer
	::feedback[Feedback to be displayed when the reader answers correctly selects this option]
- [ ] this is a distractor
	::feedback[Feedback to display if the user selects this option]
- [ ] this is a distractor
:::
```

The parser does several things with these questions:

1. Adds the questions and their data to the `Tutorial` frontmatter
2. Converts the slotted HTML content into props to pass to the `practice-question` custom element, which will render the question in the body of `Tutorial` pages
3. TODO: registers the `practice-question` data with the API, generating an endpoint and metadata about the question
