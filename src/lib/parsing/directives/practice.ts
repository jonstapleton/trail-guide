import { visit } from 'unist-util-visit'
import {toHtml} from 'hast-util-to-html'
import {remove} from 'unist-util-remove'
import {h} from 'hastscript'
import { linear } from 'svelte/easing'

export interface Question {
    name:string,
    text:string,
    options:Option[],
    completed:boolean
}

export interface Option {
    text:string,
    feedback?:string,
    correct:boolean
}

export interface Feedback {
    onCorrect?:string,
    onIncorrect?:string
}

// This directive takes the slotted content of the custom element and generates props to insert into the PracticeQuestion component
export function practice(tree:any, path:string):object[] {
    let content:Question[] = []
    visit(tree, function (node:any) {
        let index = 0
        if(node.tagName == 'practice-question' && node.children) {
            const obj:any = { text: '' }
            console.log("Found practice question at", path)
            // generate hast tree for practice questions from children of practice element
            node.tagName = 'practice-question'
            if(node.properties.name) { obj.name = node.properties.name }
            for(let i=0;i<node.children.length;i++) {
                const child = node.children[i]
                if(child.tagName == 'p') { // this is content that comes before the options
                    obj.text += toHtml(child)
                }
                if(child.tagName == 'ul' || child.tagName == 'ol') {
                    obj.options = getOptions(child)
                }
                // Feedback
                if(child.tagName == 'feedback') {
                    // console.log("Found feedback")
                    // console.log(child)
                }
            }
            obj.completed = false
            content.push(obj)
            node.properties.name = obj.name
            node.properties.text = obj.text
            node.properties.question = JSON.stringify(obj)
            node.properties.path = path
            node.properties.index = index
            index++

            node.children = []
            // remove(tree, (node:any) => node.tagName == 'practice-question')
        }
    })
    return content
}

function getOptions(node:any):Option[] {
    let options:Option[] = []
    for(let i=0;i<node.children.length;i++) {
        let opt:Option;
        if(node.children[i].tagName == 'li') {
            // Found a list item, time to parse its children/peers
            opt = getOption(node.children[i])
            options.push(opt)
        }
    }
    // console.log("#### Got options ####")
    // console.log(options)
    return options
}

// It's either something like this

// > li
//     > text
//     > text (the text I'm looking for)
//     > text

// ...or something like this:

// > li
//     > text
//     > p
//         > the content I'm looking for
//     > feedback
//     > text


function getOption(node:any):Option {
    let option:Option = { text: '', correct: false }
    let foundInput = false
    let feedback = ''
    // Each list item should include at least an input and a text child element
    const children = node.children.filter((obj:any) => {
        if(obj.tagName == 'input') {
            option.correct = obj.properties.checked? true : false
            foundInput = true
        }
        if(obj.tagName == 'feedback') {
            feedback += toHtml(obj.children)
        }
        return obj.tagName != 'feedback' && obj.tagName != 'input'
    })
    if(!foundInput) {
        // the input is in a paragraph tag in `children`
        const paragraph = children.filter((obj:any) => {
            return obj.tagName == 'p' && obj.children
        })
        // console.log("Found <p> with children:",paragraph[0].children.length)
        // console.log(paragraph[0].children[i])
        const text = paragraph[0].children.filter((obj:any) => {
            if(obj.tagName == 'input') {
                foundInput = true
                option.correct = obj.properties.checked? true : false
            }
            if(obj.tagName == 'feedback') {
                feedback += toHtml(obj.children)
            }
            return obj.tagName != 'input'
        })
        option.text += toHtml(text)
    } else {
        option.text += toHtml(children)
    }
    option.feedback = feedback
    // console.log('-------------------------------------------------')
    return option
}

function getFeedback(node:any):string {
    let fb:string = ''
    for(let i=0;i<node.children.length;i++) {
        const child = node.children[i]
        if(child.tagName == 'li') {
            fb += child.children[0]
        }
    }
    return fb;
}