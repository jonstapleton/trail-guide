import { visit } from 'unist-util-visit'
import {toHtml} from 'hast-util-to-html'
import {remove} from 'unist-util-remove'
import {h} from 'hastscript'

export interface Question {
    name:string,
    text:string,
    options:Option[]
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
export function practice(tree:any):object[] {
    let content:Question[] = []
    visit(tree, function (node:any) {
        if(node.tagName == 'practice-question' && node.children) {
            const obj:any = { text: '' }
            console.log("Found practice question!")
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
            }
            content.push(obj)
            node.properties.name = obj.name
            node.properties.text = obj.text
            node.properties.question = JSON.stringify(obj)

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
            opt = getOption(node.children[i])
            options.push(opt)
        }
    }
    return options
}

function getOption(node:any):Option {
    let option:Option = { text: '', correct: false }
    for(let i=0;i<node.children.length;i++) {
        const child = node.children[i]
        if(child.tagName == 'input' && child.properties.checked) {
            option.correct = true
        }
        if(child.type == 'text' && child.value.replaceAll(' ').length > 0) {
            option.text+=child.value
        } else if(child.tagName == 'ul') {
            // get the feedback from this list
            option.feedback = getFeedback(child)
        }
    }
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