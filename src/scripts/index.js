// Msg value for commands + data
// src: https://stackoverflow.com/questions/71484264/can-you-get-the-content-of-a-github-file-with-javascript
const helpMsg = (async() => {
    const res = await axios.get("https://raw.githubusercontent.com/asder8215/asder8215.github.io/main/text_files/helpMsg.txt");
    return res.data.toString();
})()
const rootData = "The root/home directory allows you to navigate through all the paths on this website terminal.";
const projData = "The project directory contains files pertaining to projects I have done in the past.";
const expData = "The experiences directory contains files pertaining to the jobs and positions I have worked.";
const eduData = "The education directory contains files pertaining to the post secondary institutions or education I have received.";
const devData = "The development directory contains files pertaining to any programs or positions that contributed to my development.";
const miscData = "The miscellaneous directory contains files or directories regarding other information about me.";
const testData = "This is a test directory."; // will be commented out when done

// Creating all File Nodes for the file system of terminal
let currPath = '~';
const rootFileNode = new Directory(currPath, rootData);
const projNode = new Directory("projects", projData, rootFileNode);
const expNode = new Directory("experiences", expData, rootFileNode);
const eduNode = new Directory("education", eduData, rootFileNode);
const devNode = new Directory("development", devData, rootFileNode);
const miscNode = new Directory("miscellaneous", miscData, rootFileNode);
const testNode = new RegFile("test", testData, rootFileNode); // will be commented out when done

// Setting the terminal to the root node initially
let currNode = rootFileNode;


// this is the echo div tag to contain any text content on visible portion of
// the terminal (so it doesn't bleed to the right of the terminal box)
// note to self: if a text requires color, then make sure to put styling on that
// text
// src: https://stackoverflow.com/questions/24346832/echo-content-on-the-same-line-in-jquery-terminal
const echoDiv = { raw: true,
    finalize: function(div) {
       div
    //    .css("width", "48vw")
      .css("display", "flex")
      .css("white-space", "pre-wrap")
      .css("word-wrap", "break-all")
      ;
    }
};


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

        this.echo(helpMsg, echoDiv);
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
                this.echo('<span style="color:blue">' + childrenList[i].getFileName() + '</span>', echoDiv);
            }
            else if (childrenList[i] instanceof RegFile){
                this.echo(childrenList[i].getFileName(), echoDiv);
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

        this.echo(changeNodeTo.getData(), echoDiv);
    },
    // Print current working directory
    // @param <directory> : this is not allowed. this will be error checked.
    pwd: function(... directory){
        let options = parseFile(directory, false, 0, this);
        if(options == null){
            return;
        }

        let currPath = absolutePath(options);
        this.echo(currPath, echoDiv);
    }
}, {
    checkArity: false,
    greetings: 'My Terminal\n',
    prompt: '$' + '[[;blue;]' + currPath + '/' + ']' + '> ',
    completion: true
});