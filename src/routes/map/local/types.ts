export type Coords = {
    x:number,
    y:number
}

type Trail = {
    title:string,
    author:string,
    complete:boolean,
    locations:string[], // points to path
    difficulty:number
}

type Location = {
    title:string,
    author:string
}

export type Transform = {
    x:number,
    y:number,
    scale:number
}