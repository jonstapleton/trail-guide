class Debug {
    categories:string[] = []
    selected:string[] = []
    on:boolean = true

    log(category:string, message:string) {
        if(this.selected.includes(category)) {
            console.log(`From ${category}: ${message}`)
        }
    }
    add(category:string, file?:string) {
        if(file) {
            console.warn(`Debug: Added category ${category} from file ${file}`)
        } else {
            console.warn(`Debug: Added category ${category}`)
        }
    }
}

const debug = new Debug()
debug.on = true // TODO: turn off on deployment

export default debug