export interface FileState {
    url:string,
    uuid:number, //user!
    type:string,
    questions:any[],
    prompts:any[]
}

export interface Report {
    uuid:number, // I guess, update type later
    files:FileState[],
    percentVisited:number,
    percentComplete:number,
    startedProjects:FileState[],
    completedProjects:FileState[],
    backpack:FileState[]
}