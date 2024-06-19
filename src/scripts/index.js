// Msg value for commands + data
const helpMsg = "Currently the commands available for this terminal are: cd [dir], help, ls [dir], pwd, stat [dir]."
const rootData = "Root Placeholder";
const projData = "Root Placeholder";
const expData = "Experience Placeholder";
const eduData = "Education Placeholder";
const devData = "Development Placeholder";
const miscData = "Miscellaneous Placeholder";
const testData = "Test Placeholder"; // will be commented out when done

// Creating all File Nodes for the file system of terminal
let currPath = '~';
const rootFileNode = new Directory(currPath, rootData);
const projNode = new Directory("projects", projData, rootFileNode);
const expNode = new Directory("experiences", expData, rootFileNode);
const eduNode = new Directory("education", eduData, rootFileNode);
const devNode = new Directory("leadership", devData, rootFileNode);
const miscNode = new Directory("miscellaneous", miscData, rootFileNode);
const testNode = new RegFile("test", testData, rootFileNode); // will be commented out when done

// Setting the terminal to the root node initially
let currNode = rootFileNode;

// Retrieves the whole absolute path of the given node
// @param currFileNode : the curr file node to expand the full path to
// @return               the absolute path of the FileNode
function absolutePath(currFileNode){
    let currPath = "";
    for(let currFile = currFileNode; currFile != null; currFile = currFile.getParent()){
        currPath = currFile.getFileName() + "/" + currPath;
    }
    return currPath;
}

// On success the changeDir is resetted to empty string, currFileNode is sent back, 
// isTildaBegin will always be false and no error given. otherwise, changeDir/currFileNode 
// is not resetted and error is sent back
// @param changeDir    : the file name of the directory to switch to
// @param currFileNode : the curr file node to examine
// @param isTildaBegin : boolean value to check if changeDir is '~' or not  
// @param fullDir      : full path of the directory that the user inputted
// @param dirCheck     : boolean value to check if changeDir refers to a directory or not
// @param terminal     : the terminal object on the website 
// @return               resetted value to changeDir, the file node to switch to, 
//                       bool val for starting at tilda, and whether an error was caused. 
function checkFileAt(changeDir, currFileNode, isTildaBegin, fullDir, dirCheck, terminal){
    var childrenList = currFileNode.getChildren();

    // "." is just referring to current directory
    if (changeDir === "."){
        return ["", currFileNode, false, false];
    }
    // if we're at root, '~', then that means that parent is null
    // normal convention is that it would act like '.' in that case
    // otherwise go to parent
    else if (changeDir === ".."){
        return ["", (currFileNode.getParent()) ? currFileNode.getParent() : currFileNode, false, false];
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
                if(dirCheck && !(childrenList[fileNum] instanceof Directory)){
                    break;
                }
                return ["", childrenList[fileNum], false, false];
            }
        }
        
        // if for loop falls through, no path/directory was found.
        errorPath = absolutePath(currFileNode);
        errorPath = errorPath + changeDir + fullDir;
        if (dirCheck){
            terminal.echo("[[;red;]" + "The directory " + errorPath + " does not exist." + "]");
        }
        else{
            terminal.echo("[[;red;]" + "The file " + errorPath + " does not exist." + "]");
        }
        return [changeDir, currFileNode, false, true];
    }
}

// On success, the node path to the inputted directory will be received
// On fail, either directory did not exist or more than one arg given
// @param directory     : the provided directory argument to parse through
// @param dirCheck      : boolean value to check if changeDir refers to a directory or not
// @param numArgAllowed : how many positional arguments is allowed for the calling command
// @param terminal      : the terminal object on the website
// @return                the file node to switch to
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
    // Used for testing purposes
    // test: function(){
    //     // this.set_prompt("hello"); set_prompt is how you denote the terminal's current path
    // },

    // Displays a message that tells you what command the website supports
    // @param <directory> : this is not allowed. this will be error checked.
    help: function(...directory){
        let options = parseFile(directory, false, 0, this);
        if(options == null){
            return;
        }

        this.echo(helpMsg);
    },
    // List out all the info of the given dir
    // Blue are directories, white are regular files
    // @param <directory> : optional argument to check one specific directory path
    ls: function(...directory){
        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }

        var childrenList = changeNodeTo.getChildren();
        for(let i = 0; i < childrenList.length; i++){
            if (childrenList[i] instanceof Directory){
                this.echo('[[;blue;]' + childrenList[i].getFileName() + ']');
            }
            else if (childrenList[i] instanceof RegFile){
                this.echo(childrenList[i].getFileName());
            }
        }
    },
    // Change the terminal path to the newly cd-ed path
    // @param <directory> : optional argument to check one specific directory path
    cd: function(...directory) {
        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }

        currNode = changeNodeTo;
        let currPath = absolutePath(changeNodeTo);
        this.set_prompt('$' + '[[;blue;]' + currPath + ']' + '> ');
    },
    // Print the content of a directory/file
    // @param <directory> : optional argument to check one specific directory path
    stat: function(...directory){
        let changeNodeTo = parseFile(directory, false, 1, this);
        if(changeNodeTo == null){
            return;
        }

        this.echo(changeNodeTo.getData());
    },
    // Print current working directory
    // @param <directory> : this is not allowed. this will be error checked.
    pwd: function(... directory){
        let options = parseFile(directory, false, 0, this);
        if(options == null){
            return;
        }

        let currPath = absolutePath(options);
        this.echo(currPath);
    }
}, {
    checkArity: false,
    greetings: 'My Terminal\n',
    prompt: '$' + '[[;blue;]' + currPath + '/' + ']' + '> ',
    completion: true
});