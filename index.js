let currPath = '~';
const rootFileNode = new FileNode(currPath, "dir", "Placeholder");
const projNode = new FileNode("projects", 'dir', "Placeholder", rootFileNode);
const expNode = new FileNode("experiences", 'dir', "Placeholder", rootFileNode);
const eduNode = new FileNode("education", 'dir', "Placeholder", rootFileNode);
const devNode = new FileNode("leadership", 'dir', "Placeholder", rootFileNode);
const miscNode = new FileNode("miscellaneous", 'dir', "Placeholder", rootFileNode);

let currNode = rootFileNode;

$('.terminalSection').terminal({
    cat: function(width = 200, height = 300) {
        return $(`<img src="https://placekitten.com/${width}/${height}">`);
    },
    title: function(...args) {
        const options = $.terminal.parse_options(args);
        return fetch(options.url || 'https://terminal.jcubic.pl')
            .then(r => r.text())
            .then(html => html.match(/<title>([^>]+)<\/title>/)[1]);
    },
    test: function(){
        // this.set_prompt("hello"); set_prompt is how you denote the terminal's current path
    },
    ls: function(){
        var childrenList = currNode.getChildren();
        // console.log(currNode.getFileName());
        // console.log(currNode.getChildren());
        for(let i = 0; i < childrenList.length; i++){
            // console.log(childrenList[i].getFileName());
            if (childrenList[i].getType() === 'dir'){
                this.echo('[[;blue;]' + childrenList[i].getFileName() + ']');
            }
            else{
                this.echo(childrenList[i].getFileName());
            }
        }
    }
}, {
    checkArity: false,
    greetings: 'My Terminal\n',
    prompt: '$' + '[[;blue;]' + currPath + ']' + '> '
});