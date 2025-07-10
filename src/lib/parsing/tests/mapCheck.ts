export default function mapCheck(nodes:any, projects:any) {
    for(const project of projects) {
        for(const k of Object.entries(project.frontmatter.nodes)) {
            for(let node of k[1]) {
                node = node.replace(' {optional}', '')
                if(node.charAt(0) == '.') {
                    node = node.replace('.', project.path)
                }
                const found = nodes.filter((obj:any) => {
                    return obj.path == node
                })
                if(found.length == 0 && !(node.charAt(0) == '$')) {
                    throw new Error(`Could not find ${node} in map, but referenced in ${project.frontmatter.title}!`)
                }
            }
        }
    }
}