<script lang='ts'>
    import type { Question } from "$lib/parsing/directives/practice";
    import { faCheck, faPenToSquare, faX , faXmark} from "@fortawesome/free-solid-svg-icons";
    import { onMount } from "svelte";
    import Fa from 'svelte-fa'
    import { mapData } from "../../../routes/store";

    export let question:Question
    export let boxed = true
    export let node:string
    export let index:number

    let answer:number|null = null

    let buttonClass = ''
    let buttonText = 'Check Answer'
    let buttonIcon = faPenToSquare
    let correctAnswer:number

    onMount(() => {
        // console.log(question)
        // console.log(node)
        for(let i=0;i<question.options.length;i++) {
            if(question.options[i].correct) {
                correctAnswer = i
            }
        }
        if($mapData.nodeObj[node].content.practice[index].completed) {
            answer = correctAnswer
            checkAnswer()
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
            $mapData.nodeObj[node].content.practice[index].completed = true
        } else {
            buttonClass = 'is-danger'
            buttonText = "Incorrect..."
            buttonIcon = faXmark
            $mapData.nodeObj[node].content.practice[index].completed = false
        }
    }

    function reset() {
        answer = null
        buttonClass = ''
        buttonText = "Check Answer"
        buttonIcon = faPenToSquare
        $mapData.nodeObj[node].content.practice[index].completed = false
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
        <span class='question-status {buttonClass}'><Fa size="2x" icon={buttonIcon} /></span>
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
    
    <section class='feedback'>
        {#if (answer || answer == 0) && buttonClass.length > 0 && question.options[answer].feedback.length > 0}
        <div class='feedback-text {buttonClass}'>
            <!-- <span class='has-text-weight-bold'>Feedback:</span> -->
            {@html question.options[answer].feedback}
        </div>
        {/if}
        <div class='ui has-text-right'>
            <button on:click={checkAnswer} disabled={!answer && answer != 0} class='button {buttonClass}'>
                <Fa class='mr-2' icon={buttonIcon} />
                {buttonText}
            </button>
        </div>
    </section>
    
    <!-- <slot /> -->
</article>

<style lang='scss'>
    .question-status  {
        position: absolute;
        right: 1rem;
        top: 0.5rem;
        visibility: hidden;
        &.is-success {
            color: hsl(141, 53%, 53%);
            visibility: visible;
        }
        &.is-danger {
            color: hsl(348, 100%, 61%);
            visibility: visible;
        }
    }
    header {
        position: relative;
    }
    article {
        margin: 0 0;
        margin-bottom: 4rem;
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
    // .question-header.is-danger {
    //     background-color: hsl(347, 90%, 96%);
    // }
    // .question-header.is-success {
    //     background-color: hsl(142, 52%, 96%);
    // }
    .question-body {
        margin: 1rem 1rem;
    }
    .feedback-text {
        padding: 0.5rem 0.5rem;
        margin: 0 0;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-size: 10pt;
        &.is-success {
            background-color: hsl(142, 52%, 96%);
        }
        &.is-danger {
            background-color: hsl(347, 90%, 96%);
        }
    }
</style>