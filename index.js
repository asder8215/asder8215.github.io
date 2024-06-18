// Msg value for commands + metadata
const helpMsg = "Currently the commands available for this terminal are: cd [dir], help, ls [dir], pwd, stat [dir]."
const rootMetaData = "Root Placeholder";
const projMetaData = "Root Placeholder";
const expMetaData = "Experience Placeholder";
const eduMetaData = "Education Placeholder";
const devMetaData = "Development Placeholder";
const miscMetaData = "Miscellaneous Placeholder";
const testMetaData = "Test Placeholder"; // will be commented out when done

// Creating all File Nodes for the file system of terminal
let currPath = '~';
const rootFileNode = new FileNode(currPath, "dir", rootMetaData);
const projNode = new FileNode("projects", 'dir', projMetaData, rootFileNode);
const expNode = new FileNode("experiences", 'dir', expMetaData, rootFileNode);
const eduNode = new FileNode("education", 'dir', eduMetaData, rootFileNode);
const devNode = new FileNode("leadership", 'dir', devMetaData, rootFileNode);
const miscNode = new FileNode("miscellaneous", 'dir', miscMetaData, rootFileNode);
const testNode = new FileNode("test", 'file', testMetaData, rootFileNode); // will be commented out when done

// setting the terminal to the root node initially
let currNode = rootFileNode;

// returns the whole path of the node
function absolutePath(currFileNode){
    let currPath = "";
    for(let currFile = currFileNode; currFile != null; currFile = currFile.getParent()){
        currPath = currFile.getFileName() + "/" + currPath;
    }
    return currPath;
}

// on success the changeDir is resetted to empty string, changeNodeTo is sent back, isTildaBegin will always be false
// and no error given
// otherwise, changeDir/changeNodeTo is not resetted and error is sent back.
function checkFileAt(changeDir, changeNodeTo, isTildaBegin, fullDir, dirCheck, terminal){
    var childrenList = changeNodeTo.getChildren();

    // "." is just referring to current directory
    if (changeDir === "."){
        return ["", changeNodeTo, false, false];
    }
    // if we're at root, '~', then that means that parent is null
    // normal convention is that it would act like '.' in that case
    // otherwise go to parent
    else if (changeDir === ".."){
        return ["", (changeNodeTo.getParent()) ? changeNodeTo.getParent() : changeNodeTo, false, false];
    }
    // ~ is allowed to be in the beginning to cd to, but cannot be after that
    // ~/projects/TeXiT is allowed but NOT projects/~
    else if (changeDir === "~" && isTildaBegin){
        return ["", rootFileNode, false, false];
    }
    // check through the curr file directory list to see if there's a directory named
    // like changeDir value. It has to be a directory.
    else {
        for(let fileNum = 0; fileNum < childrenList.length; fileNum++){
            if(childrenList[fileNum].getFileName() === changeDir){
                // cannot cd to a file.
                if(dirCheck && childrenList[fileNum].getType() !== 'dir'){
                    break;
                }
                return ["", childrenList[fileNum], false, false];
            }
        }
        
        // if for loop falls through, no path/directory was found.
        errorPath = absolutePath(changeNodeTo);
        errorPath = errorPath + changeDir + fullDir;
        if (dirCheck){
            terminal.echo("[[;red;]" + "The directory " + errorPath + " does not exist." + "]");
        }
        else{
            terminal.echo("[[;red;]" + "The file " + errorPath + " does not exist." + "]");
        }
        return [changeDir, changeNodeTo, false, true];
    }
}

// on success, the node path to the inputted directory will be received
// on fail, either directory did not exist or more than one arg given
function parseFile(directory, dirCheck, numArgAllowed, terminal){

    // error check on directory first
    if(directory.length > numArgAllowed){
        terminal.echo("[[;red;]" + "Cannot take more than " + numArgAllowed.toString() + " argument(s)." + "]");
        return null;
    }
    else if (directory.length == 0){
        directory = ".";
    }
    else if(directory.length == numArgAllowed){
        directory = directory[0];
    }

    // call on the checkFileAt method to find out whether that path exist or not
    let changeDir = "";
    let changeNodeTo = currNode;
    let isTildaBegin = true;
    let error = false;
    for(let i = 0; i < directory.length; i++){
        if(directory[i] === "/"){
            [changeDir, changeNodeTo, isTildaBegin, error] = checkFileAt(changeDir, changeNodeTo, isTildaBegin, directory.substring(i, directory.length), dirCheck, terminal);
            if(error){
                return null;
            }
        }
        else{
            changeDir += directory[i];
        }
    }

    if(changeDir !== ""){
        [changeDir, changeNodeTo, isTildaBegin, error] = checkFileAt(changeDir, changeNodeTo, isTildaBegin, "", dirCheck, terminal);
    }
    if(error){
        return null;
    }

    return changeNodeTo;
}

$('.terminalSection').terminal({
    test: function(){
        // this.set_prompt("hello"); set_prompt is how you denote the terminal's current path
    },
    help: function(...directory){
        // parsing inputted command by user. help should not allow any additional commands.
        let options = parseFile(directory, false, 0, this);
        if(options == null){
            return;
        }

        this.echo(helpMsg);
    },
    ls: function(...directory){
        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }

        // on success, list out all the info of the given dir
        // blue are directories, white are regular files.
        var childrenList = changeNodeTo.getChildren();
        for(let i = 0; i < childrenList.length; i++){
            if (childrenList[i].getType() === 'dir'){
                this.echo('[[;blue;]' + childrenList[i].getFileName() + ']');
            }
            else{
                this.echo(childrenList[i].getFileName());
            }
        }
    },
    cd: function(...directory) {
        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }

        // on success, change the terminal path to the newly cd-ed path
        currNode = changeNodeTo;
        let currPath = absolutePath(changeNodeTo);
        this.set_prompt('$' + '[[;blue;]' + currPath + ']' + '> ');
    },
    stat: function(...directory){
        let changeNodeTo = parseFile(directory, false, 1, this);
        if(changeNodeTo == null){
            return;
        }

        // on success, print the file's metadata.
        this.echo(changeNodeTo.getMetaData());
    },
    pwd: function(... directory){
        // parsing inputted command by user. pwd should not allow any additional commands.
        let options = parseFile(directory, false, 0, this);
        if(options == null){
            return;
        }

        // on success, print current working directory.
        let currPath = absolutePath(changeNodeTo);
        this.echo(currPath);
    }
}, {
    checkArity: false,
    greetings: 'My Terminal\n',
    prompt: '$' + '[[;blue;]' + currPath + '/' + ']' + '> ',
    completion: true
});