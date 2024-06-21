// Rough idea of what I want to make my filesystem like for the terminal
//                                                                 <-> [TeXiT, Cannons, Name the Game, Spin the Wheel, TechPrep]
//                                                                 <-> [Columbia, DeWitt Clinton HS]
// ~ <-> [projects, education, experience, leadership/development] <-> [Ceros, Good Shepherd Services]
//                                                                 <-> [KKCF, Google Code Next, & Education Fellow]

// File Node Data Structure that support features that all
// files/directories share on a File System
class FileNode {
    // type: string; name of the file
    #fileName = null;
    // type: string; contains information about the node
    #data = null;
    // type: FileNode; parent of this current FileNode
    #parent = null;
    // type: FileNode; shares root to all instances of the FileNode class
    static root = null;

    // Constructor for the File Node class
    // @param fileName : name of the file node
    // @param data     : content of the file node
    // @param parent   : parent node of the file node
    constructor(fileName, data = null, parent = null) {
        this.setFileName(fileName);
        this.setData(data);
        let isRoot = false;
        // first Directory instance will become root
        // may update this later to support reassigning root
        if (parent == null && (this instanceof Directory)) {
            isRoot = this.constructor.assignRoot();
        }
        if (!isRoot && parent != null){
            console.log("Setting " + fileName + " to " + parent.getFileName());
            parent.addChild(this);
        }
        else if(!isRoot){
            console.log("Creating a File Node with name " + fileName + " with no parent.");
        }
        else {
            console.log("The current root node is the FileNode with the name " + this.getFileName() + ".");
        }
    }
    
    // Assigning root node for the file system
    // @return true/false on whether root was assigned or not or was
    // already assigned.
    static assignRoot(){
        if (this.root == null){
            this.root = this;
            return true;
        }
        return false;
    }

    // Retrieves root of the file system
    // @return the root file node
    static getRoot(){
        return this.root;
    }

    // Retrieves the file name of the FileNode
    // @return file name of the file node
    getFileName() {
        // inform if no file name value found
        if (this.#fileName === null){
            console.log("This FileNode contains no file name value.");
        }
        return this.#fileName;
    }

    // Retrieves the data of the FileNode
    // @return data of the file node
    getData() {
        // inform if no data value found
        if (this.#data === null){
            console.log("This FileNode contains no data value.");
        }
        return this.#data;
    }

    // Retrieves the parent FileNode of the FileNode
    // @return parent file node of the file node
    getParent() {
        return this.#parent;
    }

    // Set the file name for the FileNode
    // @param fileName : the name to assign to the FileNode
    setFileName(fileName) {
        // error checking for file name: it cannot be a diff type than string
        let rootNode = FileNode.getRoot()
        if (!(typeof fileName === "string")){
            console.log("Invalid file name value.");
            return;
        }
        else if(fileName === ""){
            console.log("Cannot name a file as an empty string.");
            return;
        }
        else if(FileNode.getRoot() !== null){
            if(fileName === rootNode.getFileName()){
                console.log("Cannot have a file with the same name as root");
                return;
            }
        }
        this.#fileName = fileName;
    }

    // Set the data for the FileNode
    // @param data : the data to assign to the FileNode
    setData(data) {
        // error checking for data: it cannot be a diff type than string
        if (!(typeof data === "string")){
            console.log("Invalid data value.");
            return;
        }
        this.#data = data;
    }

    // Set the parent FileNode for the current FileNode
    // @param parent : the parent FileNode to assign to the FileNode
    setParent(parent) {
        // error checking for parent: it cannot be a diff type than FileNode or itself
        if (!(parent instanceof FileNode)) {
            console.log("Parent is not of type FileNode.");
            return;
        }
        else if(parent == this){
            console.log("Parent cannot be itself.");
            return;
        }
        this.#parent = parent;
    }
};

// Regular File Class built on FileNode
class RegFile extends FileNode {
    // Constructor for the Directory class
    // @param fileName : name of the file node
    // @param data     : content of the file node
    // @param parent   : parent node of the file node
    constructor(fileName, data = null, parent = null){
        super(fileName, data, parent);
    }
};

// Directory Class for directory exclusive methods
class Directory extends FileNode {
    // type: [FileNode]; all connecting FileNodes to this node
    #children = [];
    
    // Private method for checking if the children FileNode list is valid
    // @param children : list of file nodes to the current directory
    // @return           sorted version of children
    #validFileNodeList = function(children) {
        
        // error check children first
        if (!(Array.isArray(children))){
            console.log("Children is not an array type.");
            return [];
        }

        var checkedFileNames = new Set();
        for(let i = 0; i < children.length; i++){
            if (!(children[i] instanceof FileNode)){
                console.log("Invalid entry in children list.");
                return [];
            }
            else if (children[i] == this){
                console.log("Child in children list cannot contain itself.");
                return [];
            }
            else if (children[i] == this.getRoot()){
                console.log("Cannot add root as a child to the current FileNode list.");
                return [];
            }
            else if(children[i].getParent() !== null){
                console.log("Cannot add a child that has a parent associated with it.");
                console.log("Error comes from the node named " + this.getFileName() + ".");
                return [];
            }
            else if(children[i].getFileName() in checkedFileNames){
                console.log("Cannot have children with the same file names.");
                return [];
            }
            else{
                checkedFileNames.add(children[i].getFileName());
            }
        }
        // then children's parent can be assigned.
        for(let i = 0; i < children.length; i++){
            children[i].setParent(this);
        }
        children.sort(function(a, b){
            a = a.getFileName().toLowerCase();
            b = b.getFileName().toLowerCase();
            if(a > b){
                return 1;
            }
            if(a < b){
                return -1;
            }
            return 0;
        });
        return children;
    };
    
    // Constructor for the Directory class
    // @param fileName : name of the file node
    // @param data     : content of the file node
    // @param parent   : parent node of the file node
    // @param children : list of file nodes to the current directory
    constructor(fileName, data = null, parent = null, children = []){
        super(fileName, data, parent);
        this.#children = this.#validFileNodeList(children);
    }

    // Retrieves the list of descendant File Nodes of the FileNode
    // @return list of FileNodes for the current Directory
    getChildren() {
        return this.#children;
    }
    
    // Connects an arbitrary length of FileNodes to the current FileNode
    // @param child :  FileNodes to be inputted to the Directory
    addChild(...children){
        
        // error checking for child: it cannot be null, a diff type than FileNode, or itself,
        // a parented child, a root node, or has the same file name in the same children list
        for (let child of children){
            if (child === null){
                console.log("A null child cannot be added to the list.")
                return;
            }
            else if (!(child instanceof FileNode)){
                console.log("Child is not of type FileNode.");
                return;
            }
            else if (child == this){
                console.log("Child cannot be itself.");
                return;
            }
            else if (child == FileNode.getRoot()){
                console.log("Child cannot be the root node.");
                return;
            }
            else if (child.getParent() !== null){
                console.log("Child has an associated parent already.");
                return;
            }
            else{
                var checkedFileNames = new Set();
                var childrenList = this.getChildren();
                for(let i = 0; i < childrenList.length; i++){
                    if (childrenList[i].getFileName() in checkedFileNames){
                        console.log("Cannot add a child with an already used file name in the children list.");
                        return;
                    }
                    checkedFileNames.add(childrenList[i].getFileName());
                }
            }
        }
        // if falls through here, then child is valid and can be added
        // plus sorted
        for (let child of children){
            console.log("Adding " + child.getFileName() + " to " + this.getFileName() + ".");
            this.getChildren().push(child);
            child.setParent(this);
        }

        this.getChildren().sort(function(a, b){
            a = a.getFileName().toLowerCase();
            b = b.getFileName().toLowerCase();
            if(a > b){
                return 1;
            }
            if(a < b){
                return -1;
            }
            return 0;
        });
    }

    // Finds a certain File Node by file name
    // @param fileName : the File Node to search for with a specific name
    // @return           the File Node child with the file name on success or null on failure
    findChildByName(fileName){
        for (let child of this.getChildren()){
            if(child.getFileName() === fileName){
                return child;
            }
        }
        return null;
    }
};