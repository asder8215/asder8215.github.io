// Rough idea of what I want to make my filesystem like for the terminal
//                                                                -> [TeXiT, Cannons, Name the Game, Spin the Wheel, TechPrep]
//                                                                -> [Columbia, DeWitt Clinton HS]
// ~ -> [projects, education, experience, leadership/development] -> [Ceros, Good Shepherd Services]
//                                                                -> [KKCF, Google Code Next, & Education Fellow]

class FileNode {
    #fileName = null; // type: string; name of the file
    #type = null;  // type: string; directory or file)
    #metadata = null; // type: string; contains information about the node
    #parent = null; // type: FileNode; parent of this current FileNode
    #children = []; // type: [FileNode]; all connecting FileNodes to this node
    static #root = null; // type: FileNode; shares root to all instances of the FileNode class
    // private method for checking if the children FileNode list is valid
    #validFileNodeList = function(children) {
        
        // error check children first
        if (!(Array.isArray(children))){
            console.log("Children is not an array type.");
            return [];
        }

        if (this.#type !== "dir"){
            console.log("Current Node is not a dir type to have children.");
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
                console.log("Error comes from the node named " + this.#fileName + ".");
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
            if(a.getFileName() > b.getFileName()){
                return 1;
            }
            if(a.getFileName() < b.getFileName()){
                return -1;
            }
            return 0;
        });
        return children;
    };
    
    // constructor to create a FileNode with file name, type, metadata, parent, and FileNode children, and root
    constructor(fileName, type, metadata = null, parent = null, children = []) {
        // this.#fileName = typeof fileName === "string" ? fileName : null;
        // this.#type = (typeof type === "string" && (type === 'dir' | type === 'file')) ? type : null;
        // this.#metadata = typeof metadata === "string" ? metadata : null;
        // this.#parent = (parent instanceof FileNode) ? parent : null;
        this.setFileName(fileName);
        this.setType(type);
        this.setMetaData(metadata)
        this.#validFileNodeList(children);
        //this.#children =  (Array.isArray(children) && this.#type == 'dir') ? this.#validFileNodeList(children) : [];
        let isRoot = false;
        if (parent == null) {
            isRoot = this.constructor.assignRoot();
        }
        if (!isRoot){
            console.log("Setting " + fileName + " to " + parent.getFileName());
            // this.setParent(parent);
            parent.addChild(this);
        }
        else {
            console.log("The current root node is the FileNode with the name " + this.getFileName() + ".");
        }
    }
    
    // Assigning root node for the file system
    static assignRoot(){
        if (this.#root == null){
            this.#root = this;
            return true;
        }
        return false;
    }

    // Retrieves root of the file system
    static getRoot(){
        return this.#root;
    }

    // Retrieves the file name of the FileNode
    getFileName() {
        // inform if no file name value found
        if (this.#fileName === null){
            console.log("This FileNode contains no file name value.");
        }
        return this.#fileName;
    }

    // Retrieves the type of the FileNode
    getType() {
        // inform if no type value found
        if (this.#type === null){
            console.log("This FileNode contains no type value.");
        }
        return this.#type;
    }

    // Retrieves the metadata of the FileNode
    getMetaData() {
        // inform if no metadata value found
        if (this.#metadata === null){
            console.log("This FileNode contains no metadata value.");
        }
        return this.#metadata;
    }

    // Retrieves the parent FileNode of the FileNode
    getParent() {
        return this.#parent;
    }
    
    // Retrieves the list of descendant File Nodes of the FileNode
    getChildren() {
        return this.#children;
    }

    // Set the file name for the FileNode
    setFileName(fileName) {
        // error checking for file name: it cannot be a diff type than string
        if (!(typeof fileName === "string")){
            console.log("Invalid file name value.");
            return;
        }
        this.#fileName = fileName;
    }

    // Set the type for the FileNode
    setType(type) {
        // error checking for type: it cannot be a diff type than string or something else
        // from 'dir' or 'file'
        if (!(typeof type === "string")){
            console.log("Invalid type value.");
            return;
        }
        else if (type !== "dir" && type !== "file"){
            console.log("Type is not a 'dir' or 'file'.");
            return;
        }
        else if (this.#type !== null){
            console.log("Cannot re-type a FileNode type.");
            return;
        }
        this.#type = type;
    }

    // Set the metadata for the FileNode
    setMetaData(metadata) {
        // error checking for metadata: it cannot be a diff type than string
        if (!(typeof metadata === "string")){
            console.log("Invalid metadata value.");
            return;
        }
        this.#metadata = metadata;
    }

    // Set the parent FileNode for the current FileNode
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

    // Connects a child FileNode to the current FileNode
    addChild(child){

        // error checking for child: it cannot be null, a diff type than FileNode, or itself,
        // a parented child, a root node, or has the same file name in the same children list
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
        else if (this.getType() !== 'dir'){
            console.log("Child is not of type directory.");
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
        this.#children.push(child);
        child.setParent(this);
        this.#children.sort(function(a, b){
            if(a.getFileName() > b.getFileName()){
                return 1;
            }
            if(a.getFileName() < b.getFileName()){
                return -1;
            }
            return 0;
        });
    }
}