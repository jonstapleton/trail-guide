<script lang='ts'>
    import type { Question } from "$lib/parsing/directives/practice";
    import { faCheck, faPenToSquare, faQuestion, faX } from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";
    import Fa from 'svelte-fa'

    export let question:Question
    export let boxed = true

    let answer:number|null = null

    let buttonClass = ''
    let buttonText = 'Check Answer'
    let buttonIcon = faPenToSquare
    let correctAnswer:number

    onMount(() => {
        // console.log(question)
        for(let i=0;i<question.options.length;i++) {
            if(question.options[i].correct) {
                correctAnswer = i
            }
        }
        // question.title = question.title ? question.title : title
    })
    function checkAnswer() {
        if(buttonText != 'Check Answer') {
            reset()
        } else if(answer == correctAnswer) {
            buttonClass = 'is-success'
            buttonText = "Correct!"
            buttonIcon = faCheck
        } else {
            buttonClass = 'is-danger'
            buttonText = "Incorrect..."
            buttonIcon = faX
        }
    }

    function reset() {
        answer = null
        buttonClass = ''
        buttonText = "Check Answer"
        buttonIcon = faPenToSquare
    }
</script>

<svelte:options customElement={{
    tag: 'practice-question',
    shadow: 'none',
    props: {
        title: { reflect: true, type: 'String' },
        question: {reflect: true, type: 'Object'}
    }
}} />

<article class='practice-question {boxed ? 'box' : ''}'>
    <header class='question-header {buttonClass}'>
        <h3 class='my-0'>{ question.name }</h3>
    </header>
    <section class='question-body'>
        {@html question.text}
        <div on:click={reset} on:keypress={reset} role='presentation' class='field'>
            {#each question.options as option, i}
            <label class='radio'>
                <input type='radio' name='option' value={i} bind:group={answer}>
                {option.text}
            </label>
            <br>
            {/each}
        </div>
    </section>
    <div class='ui has-text-right'>
        <button on:click={checkAnswer} disabled={!answer && answer != 0} class='button {buttonClass}'>
            <Fa class='mr-2' icon={buttonIcon} />
            {buttonText}
        </button>
    </div>
    <!-- <slot /> -->
</article>

<style lang='scss'>
    article {
        margin: 3rem 2rem;
    }
    label {
        margin-left: 2rem;
        margin-bottom: 1rem;
    }
    button {
        width: 10rem;
    }
    .question-header {
        background-color: whitesmoke;
        border-radius: 10px;
        padding: 1rem 1rem;
        h3 {
            font-size: 12pt;
            font-weight: bold;
        }
    }
    .question-header.is-danger {
        // background-color: pink;
    }
    .question-header.is-success {
        // background-color: lightgreen;
    }
    .question-body {
        padding: 1rem 1rem;
    }
</style>