// initial welcome msg bool check 
let welcome = 0;

// Msg value for commands + data
const rawGitHubUrl = "https://raw.githubusercontent.com/asder8215/asder8215.github.io/main/text_files/";
const rawGitHubUrlHTML = "https://raw.githubusercontent.com/asder8215/asder8215.github.io/main/src/content/content.html"
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
    new RegFile("TeXiT", returnData(rawGitHubUrl + "projects/TeXiT.txt"), null, "2023,08,13"), 
    new RegFile("Name the Game, Spin the Wheel", returnData(rawGitHubUrl + "projects/NGSW.txt"), null, "2022,05,01"),
    new RegFile("TechPrep", returnData(rawGitHubUrl + "projects/TechPrep.txt"), null, "2022,11,12"),
    new RegFile("Personal Website", returnData(rawGitHubUrl + "projects/Personal_Website.txt"), null, "2024,06,30")
);

rootFileNode.findChildByName("experiences").addChild(
    new RegFile("College Bridge Coach @ Good Shepherd Services", returnData(rawGitHubUrl + "experiences/GSS.txt"), null, "2022,06,25"),
    new RegFile("Education Fellow @ ELiTE", returnData(rawGitHubUrl + "experiences/ELiTE.txt"), null, "2024,06,22"),
    new RegFile("Quality Engineer @ Ceros", returnData(rawGitHubUrl + "experiences/Ceros.txt"), null, "2022,08,19")
);

rootFileNode.findChildByName("education").addChild(
    new RegFile("Columbia University", returnData(rawGitHubUrl + "education/Columbia_University.txt"))
);

rootFileNode.findChildByName("miscellaneous").addChild(
    new Directory("development", devData), 
    new Directory("current", null)
);

rootFileNode.findChildByName("miscellaneous").findChildByName("development").addChild(
    new RegFile("CodePath", returnData(rawGitHubUrl + "miscellaneous/development/CodePath.txt"), null, "2022,11,15"),
    new RegFile("TKH", returnData(rawGitHubUrl + "miscellaneous/development/KKCF.txt"), null, "2020,08,29"),
    new RegFile("Google Code Next", returnData(rawGitHubUrl + "miscellaneous/development/GCN.txt"), null, "2021,06,25")
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

// Changes the content displayed in .bioWrapper class from index.html
// @param id: the given id to retrieve content from within content.html to change .bioWrapper innerHTML with
function changeHTMLBioContent(id){
    // inner code inspired from: https://stackoverflow.com/questions/36631762/returning-html-with-fetch
    returnData(rawGitHubUrlHTML).then(function(html){
        // Initialize the DOM parser
        var parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");

        // slight exit effect alongside fade in effect for the text on the left
        $('.bioWrapper').animate({opacity: 0}, 500);
        var htmlFadeInEffect = '<div>' + doc.getElementById(id).innerHTML + '</div>'
        setTimeout(function(){
            $('.bioWrapper').html(htmlFadeInEffect);
            $('.bioWrapper').animate({opacity: 1}, 250);
        }, 500);
        
    })
    .catch(function(err) {  
        console.log('Failed to fetch page: ', err);  
    });
}

// Changes the file/folder explorer UI (the bottom right box section on website) based on
// if user cd's to a diff directory from terminal or clicks on the folders or files.
// Clicking on a folder or file will also change content displayed on the .bioWrapper class div
// from index.html.
// @param fileName : the File Node to search for with a specific name
// @param execTerm : whether to make terminal exec a command or not (yes if coming from file explorer clicks, no if from terminal side)
function changeFolder(fileName, execTerm){
    let fileNode = currNode;

    let infoFileName = fileName;

    // fileName = fileName.replace(" ", "");
    // console.log("name of file " + fileName);
    fileName = fileName.split('/');

    for (let i = 0; i < fileName.length; i++){
        if (i == 0 && fileName[0] === "~"){
            fileNode = rootFileNode;
        }
        else if(fileName[i] === "."){
            continue;
        }
        else if (fileNode.getParent() !== null && fileName[i] === "..") {
            fileNode = fileNode.getParent();
        }
        else if(fileName[i] !== ".."){
            fileNode = fileNode.findChildByName(fileName[i]);
        }
    }

    let resultingFiles = ""

    if(fileNode != rootFileNode){
        resultingFiles += '<div id="back'  + 'File" class="file hoverOutline" onclick="changeFolder(\'..\', \'1\')"><i class="bi bi-arrow-return-left backIcon"></i><br><br><span class="fileName"> Back </span></div>'
    }
    
    if (fileNode instanceof Directory){
        let childrenNodes = fileNode.getChildrenByDate();
        for(let i= 0; i < childrenNodes.length; i++){
            if (childrenNodes[i] instanceof Directory){
                resultingFiles += '<div id="' + childrenNodes[i].getFileName().replaceAll(" ", "") + 'Folder" class="file hoverOutline" onclick="changeFolder(\'' + childrenNodes[i].getFileName() + '\', \'1\')"><i class="bi bi-folder fileIcon"></i><br><br><span class="fileName">' + childrenNodes[i].getFileName() +'</span></div>'
            }
            else if(childrenNodes[i] instanceof RegFile){
                resultingFiles += '<div id="' + childrenNodes[i].getFileName().replaceAll(" ", "") + 'File" class="file hoverOutline" onclick="changeFolder(\'' + childrenNodes[i].getFileName() + '\', \'1\')"><i class="bi bi-files fileIcon"></i><br><br><span class="fileName">' + childrenNodes[i].getFileName() +'</span></div>'
            }
        }
        if (execTerm === "1"){
            term.exec("cd \"" + infoFileName + "\"");
        }

        // slight exit effect alongside fade in effect for the text on the left
        $('#folderExplorer').animate({opacity: 0}, 400);
        setTimeout(function(){
            $('#folderExplorer').html(resultingFiles);
            $('#folderExplorer').animate({opacity: 1}, 250);
        }, 400);
    }
    else{
        if (execTerm === "1"){
            term.exec("stat \"" + infoFileName + "\"");
        }
    }
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
            else{
                terminal.echo("<span style='color:red'>" + errorPath + " appears to be a file and not a directory. Try 'stat' instead?" + "</span>", echoDiv);
                return [changeDir, currFileNode, false, true];
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

// On success, the node path to the inputted directory will be receive
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

// TODO (not urgent): Has to autocomplete words with spaces properly
// i.e. miscellaneous/development/Student @ CodePath & miscellaneous/development/Student @ Google Code Next
// If you autocomplete for Student, it'll do miscellaneous/development/Student\ @\  but it'll no longer be able
// to autocomplete for CodePath or Google Code Next after typing C or G.
// parse the inputted arguments that user puts in on terminal screen
// @param string   : contains the current string that the user is typing
// @param callback : callback function to autocompleting echo message
// @param terminal : terminal instance object 
function parseCommands(string, callback, terminal){
    let listOfArgs = terminal.get_command().split(" ");
    let allowedCmds = ["cd", "help", "ls", "pwd", "stat"]; 
    let noArgCmd = ["pwd", "help"];
    let dirCmds = ["cd", "ls"];
    let cmdsWithOpts = ["ls"];
    let optsWithCmds = {
        "ls": ['-d']
    };

    if (listOfArgs.length == 1){
        callback(allowedCmds);
    }

    // if there exist option flags for commands, then shift the arr so that autocompletion operates on directory path.
    if(listOfArgs.length == 3){
        if(cmdsWithOpts.includes(listOfArgs[0]) && optsWithCmds[listOfArgs[0]].includes(listOfArgs[1])){
            listOfArgs.splice(1, 1);
        }
    }

    if(listOfArgs.length == 2){
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
    terminal.echo('$' + '<span style="color:green">' + currPath + '/' + '</span>' + '> ' + terminal.get_command(), echoDiv);

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

var term = $('.terminalSection').terminal({
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
    // TODO: Add Created Time when echoing file names on the terminal with -d flag.
    // List out all the info of the given dir
    // Green are directories, white are regular files
    // @param <:d> <directory> : optional argument to check one specific directory path possibly with
    //                           sorting it by chronological order or alphabetically.
    ls: function(...directory){
        let dateFlag = false;
        if(directory.length != 0){
            if(directory[0] === "-d"){
                dateFlag = true;
                directory.shift();
            }
            else if(directory[0][0] === "-"){
                this.echo('<span style="color:red">Unrecognized flag ' + directory[0] + '.</span>', echoDiv);
                return;
            }
        }

        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }

        var childrenList;
        if (dateFlag){
            childrenList = changeNodeTo.getChildrenByDate();
        }
        else{
            childrenList = changeNodeTo.getChildren();
        }

        for(let i = 0; i < childrenList.length; i++){
            if (childrenList[i] instanceof Directory){
                this.echo('<span style="color:green">' + childrenList[i].getFileName() + '</span>', echoDiv);
            }
            else if (childrenList[i] instanceof RegFile){
                this.echo(childrenList[i].getFileName(), echoDiv);
            }
        }
    },
    // Change the terminal path to the newly cd-ed path, & change file explorer UI as well
    // @param <directory> : optional argument to check one specific directory path
    cd: function(...directory) {
        // may want this in the future
        // let affectFileExplorerFlag = true;
        // if(directory.length != 0){
        //     if(directory[0] === "-n"){
        //         affectFileExplorerFlag = false;
        //         directory.shift();
        //     }
        //     else if(directory[0][0] === "-"){
        //         this.echo('<span style="color:red">Unrecognized flag ' + directory[0] + '.</span>', echoDiv);
        //         return;
        //     }
        // }
        let changeNodeTo = parseFile(directory, true, 1, this);
        if(changeNodeTo == null){
            return;
        }
        changeFolder(directory[0], "0");
        currNode = changeNodeTo;
        let currPath = absolutePath(changeNodeTo);
        this.set_prompt('$' + '[[;green;]' + currPath + ']' + '> ');
        changeHTMLBioContent(currNode.getFileName().replaceAll(" ", ""));
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
        // console.log(changeNodeTo.getFileName().replace(" ", ""))
        changeHTMLBioContent(changeNodeTo.getFileName().replaceAll(" ", ""));
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
    greetings: false,
    // This onInit utilizes the custom echoDiv to ensure word-wrapping in the terminal
    onInit: function(term){
        term.echo('Welcome to my terminal. Type "help" to see all commands available with this terminal currently.', echoDiv);
    },
    // TODO: find out how to prevent text from initially overflowing outside the terminal div box
    prompt: '$' + '[[;green;]' + currPath + '/' + ']' + '> ',
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
    },
    wrap:true
});