// Msg value for commands + data
const rawGitHubUrl = "https://raw.githubusercontent.com/asder8215/asder8215.github.io/main/text_files/";
const helpMsg = returnData(rawGitHubUrl + "helpMsg.txt");

// Directory data. Hardcoded here because they aren't too long.
const rootData = "The root/home directory allows you to navigate through all the paths on this website terminal.";
const projData = "The project directory contains files pertaining to projects I have done in the past.";
const expData = "The experiences directory contains files pertaining to the jobs and positions I have worked.";
const eduData = "The education directory contains files pertaining to the post secondary institutions or education I have received.";
const miscData = "The miscellaneous directory contains files or directories regarding other information about me.";
const devData = "The development directory contains files of all programs I've been involved in that contributed to my development in CS.";

// Placeholder Data
const testData = "This is a test data."; // will be commented out when done

// Creating all File Nodes for the file system of terminal
let currPath = '~';
const rootFileNode = new Directory(currPath, rootData);

rootFileNode.addChild(
    new Directory("projects", projData), 
    new Directory("experiences", expData),
    new Directory("education", eduData),
    new Directory("miscellaneous", miscData)
);

rootFileNode.findChildByName("projects").addChild(
    new RegFile("TeXiT", returnData(rawGitHubUrl + "projects/TeXiT.txt")), 
    new RegFile("Name the Game, Spin the Wheel", returnData(rawGitHubUrl + "projects/NGSW.txt")),
    new RegFile("TechPrep", returnData(rawGitHubUrl + "projects/TechPrep.txt")),
    new RegFile("Personal Website", returnData(rawGitHubUrl + "projects/Personal_Website.txt"))
);

rootFileNode.findChildByName("experiences").addChild(
    new RegFile("College Bridge Coach @ Good Shepherd Services", returnData(rawGitHubUrl + "experiences/GSS.txt")),
    new RegFile("Education Fellow @ ELiTE", returnData(rawGitHubUrl + "experiences/ELiTE.txt")),
    new RegFile("Quality Engineer @ Ceros", returnData(rawGitHubUrl + "experiences/Ceros.txt"))
);

rootFileNode.findChildByName("education").addChild(
    new RegFile("Columbia University", returnData(rawGitHubUrl + "education/Columbia_University.txt"))
);

rootFileNode.findChildByName("miscellaneous").addChild(
    new Directory("development", devData), 
    new Directory("current", null)
);

rootFileNode.findChildByName("miscellaneous").findChildByName("development").addChild(
    new RegFile("Student @ CodePath", returnData(rawGitHubUrl + "miscellaneous/development/CodePath.txt")),
    new RegFile("Karim Kharbouch Coding Fellow @ TKH", returnData(rawGitHubUrl + "miscellaneous/development/KKCF.txt")),
    new RegFile("Student @ Google Code Next", returnData(rawGitHubUrl + "miscellaneous/development/GCN.txt"))
);


// const testNode = new RegFile("test", testData, rootFileNode); // will be commented out when done

// Setting the terminal to the root node initially
let currNode = rootFileNode;

// this is the echo div tag to contain any text content on visible portion of
// the terminal (so it doesn't bleed to the right of the terminal box)
// note to self: if a text requires color, then make sure to put styling on that
// text
// src: https://stackoverflow.com/questions/24346832/echo-content-on-the-same-line-in-jquery-terminal
const echoDiv = { 
    raw: true,
    finalize: function(div) {
       div
    //    .css("width", "48vw")
      .css("display", "flex")
      .css("white-space", "pre-wrap")
      .css("word-wrap", "break-all")
    //   .css("margin-top", "0.25vh")
      .css("margin-bottom", "0.25vh")
      ;
    }, 
};

// Retrieves the html content (converted to text) from the given url as a promise
// src: https://stackoverflow.com/questions/46719974/promise-is-returning-object-promise
// @param url : the given url to retrieve content from
// @return      the Promise info of url content
function getDataFromUrl(url) {
    return new Promise(resolve => {
        setTimeout(() =>{
            const res = fetch(url);
            resolve(res);
        }, 100);
    });
}

// Returns the Promise info as actual text content
// @param url: the given url to retrieve content from
// @return     the text content from the url
async function returnData(url){
    const val = await getDataFromUrl(url);
    return val.text();
}

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
function checkFileAt(changeDir, currFileNode, isTildaBegin, fullDir, dirCheck, terminal, echoError){
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
        let child = currFileNode.findChildByName(changeDir);
        // in the events that the child is null, no path/directory was found, 
        // so raise an error.
        let errorPath = absolutePath(currFileNode);
        errorPath = errorPath + changeDir + fullDir;

        if(child != null){
            if(!dirCheck || (dirCheck && (child instanceof Directory))){
                return ["", child, false, false];
            }
        }

        // falls through if there's an error with child
        if(echoError){
            if (dirCheck){
                terminal.echo("<span style='color:red'>" + "The directory " + errorPath + " does not exist." + "</span>", echoDiv);
            }
            else{
                terminal.echo("<span style='color:red'>" + "The file " + errorPath + " does not exist." + "</span>", echoDiv);
            }
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
function parseFile(directory, dirCheck, numArgAllowed, terminal, echoError = true){

    // error check on directory first
    if(directory.length > numArgAllowed){
        terminal.echo('<span style="color:red">' + "Cannot take more than " + numArgAllowed.toString() + " argument(s)." + "</span>", echoDiv);
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
            [changeDir, changeNodeTo, isTildaBegin, error] = checkFileAt(changeDir, changeNodeTo, isTildaBegin, directory.substring(i, directory.length), dirCheck, terminal, echoError);
            if(error){
                return null;
            }
        }
        else{
            changeDir += directory[i];
        }
    }

    if(changeDir !== ""){
        [changeDir, changeNodeTo, isTildaBegin, error] = checkFileAt(changeDir, changeNodeTo, isTildaBegin, "", dirCheck, terminal, echoError);
    }
    if(error){
        return null;
    }

    return changeNodeTo;
}

// parse the inputted arguments that user puts in on terminal screen
// @param string   : contains the current string that the user is typing
// @param callback : callback function to autocompleting echo message
// @param terminal : terminal instance object 
function parseCommands(string, callback, terminal){
    let listOfArgs = terminal.get_command().split(" ");
    let allowedCmds = ["cd", "help", "ls", "pwd", "stat"]; 
    let noArgCmd = ["pwd", "help"];
    let dirCmds = ["cd", "ls"];
    if (listOfArgs.length == 1){
        callback(allowedCmds)
    }
    else if(listOfArgs.length == 2){
        if(!(noArgCmd.includes(listOfArgs[0])) && allowedCmds.includes(listOfArgs[0])){
            let lastSlashIndex = listOfArgs[1].split('').reverse().join('').indexOf("/");
            if(lastSlashIndex == -1){
                let fileNamesList = currNode.getFileNames();
                fileNamesList.push("."); // for current directory
                fileNamesList.push(".."); // for parent directory
                callback(fileNamesList);
            }
            else {
                let pathToCheckForTab = listOfArgs[1].substring(0, listOfArgs[1].length - lastSlashIndex);
                let checkNodeAt = parseFile([pathToCheckForTab], false, 1, terminal, false);
                if (checkNodeAt != null){
                    // fileNamesList & childrenList should be one to one
                    let fileNamesList = checkNodeAt.getFileNames();
                    let childrenList = checkNodeAt.getChildren();
                    let counter = 0;
                    for(let i = 0; i < childrenList.length; i++){
                        if(dirCmds.includes(listOfArgs[0]) && !(childrenList[i] instanceof Directory)){
                            fileNamesList = fileNamesList.splice(i-counter, 1);
                            counter++;
                        }
                        else{
                            fileNamesList[i-counter] = pathToCheckForTab + fileNamesList[i-counter];
                        }
                    }
                    // fileNamesList.push("."); // for current directory
                    // fileNamesList.push(".."); // for parent directory
                    callback(fileNamesList);
                }
            }
        }
    }
    
}

// formats the echo message for double tab completion
// @completions    : a list of all available options for user with given input
// @param terminal : terminal instance object
function doubleTabCompletion(completions, terminal){
    terminal.echo('$' + '<span style="color:blue">' + currPath + '/' + '</span>' + '> ' + terminal.get_command(), echoDiv);

    // sort the available options
    completions = completions.sort(function(a, b){
        a = a.toLowerCase();
        b = b.toLowerCase();
        if(a > b){
            return 1;
        }
        if(a < b){
            return -1;
        }
        return 0;
    });

    for(let cmd = 0; cmd < completions.length; cmd++){
        terminal.echo(completions[cmd], echoDiv);
    }
}

$('.terminalSection').terminal({
    // Used for testing purposes
    // test: function(){
    //     // this.set_prompt("hello"); set_prompt is how you denote the terminal's current path
    //     console.log("The command is " + this.get_command());
    //     return;
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
    // TODO: Add option to display file by chronological order.
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
        // console.log("The node is " + changeNodeTo.getFileName());
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
    greetings: 'Welcome to my terminal. Type "help" to see all commands available with this terminal currently.',
    prompt: '$' + '[[;blue;]' + currPath + '/' + ']' + '> ',
    // completion will call on parseCommands to appropriately find
    // options that user can autocomplete to
    // more info here: https://github.com/jcubic/jquery.terminal/wiki/Tab-completion
    completion: function(string, callback){
        parseCommands(string, callback, this);
    },
    // doubleTab will use a different way to echo
    // autocompleted items on screen than default
    // more info from api doc: https://terminal.jcubic.pl/api_reference.php#terminal
    doubleTab: function(string, completions, echo){
        doubleTabCompletion(completions, this);
    }
});