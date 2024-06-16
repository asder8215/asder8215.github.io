// Rough idea of what I want to make my filesystem like for the terminal
//                                                                -> [TeXiT, Cannons, Name the Game, Spin the Wheel, TechPrep]
//                                                                -> [Columbia, DeWitt Clinton HS]
// ~ -> [projects, education, experience, leadership/development] -> [Ceros, Good Shepherd Services]
//                                                                -> [KKCF, Google Code Next, & Education Fellow]

class FileNode {
    #fileName; // type: string; name of the file
    #type;  // type: string; directory or file)
    #metadata; // type: string; contains information about the node
    #parent; // type: FileNode; parent of this current FileNode
    #children; // type: [FileNode]; all connecting FileNodes to this node
    static #root = null; // type: FileNode; shares root to all instances of the FileNode class
    // private method for checking if the children FileNode list is valid
    #validFileNodeList = function(children) {
        // error check children first
        for(i = 0; i < children.length; i++){
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
            else if(children[i].getParent() != null){
                console.log("Cannot add a child that has a parent associated with it.");
                console.log("Error comes from the node named " + this.#fileName + ".");
                return [];
            }
        }
        // then children's parent can be assigned.
        for(i = 0; i < children.length; i++){
            children[i].setParent(this);
        }
        return children;
    };

    // scrapped code b/c I realized JS doesn't do method overloading like this ;-;
    // constructor(fileName, type) {
    //     this.#fileName = typeof fileName === "string" ? fileName : null;
    //     this.#type = typeof type === "string" ? type : null;
    //     this.#metadata = null;
    //     this.#parent = null;
    //     this.#children = [];
    // }
    
    // constructor to create a FileNode with file name, type, metadata, parent, and FileNode children, and root
    constructor(fileName, type, metadata = null, parent = null, children = [], isRoot = false) {
        this.#fileName = typeof fileName === "string" ? fileName : null;
        this.#type = typeof type === "string" ? type : null;
        this.#metadata = typeof metadata === "string" ? metadata : null;
        this.#parent = (parent instanceof FileNode) ? parent : null;
        this.#children =  Array.isArray(children) ? this.#validFileNodeList(children) : [];
        if (isRoot){
            assignRoot();
        }
    }
    
    // Assigning root node for the file system
    static assignRoot(){
        if (this.getParent() != null){
            console.log("This FileNode cannot be assigned root.");
            return;
        }
        else if (this.#root != null){
            console.log("Root has already been assigned.");
            return;
        }
        this.#root = this;
    }

    // Retrieves root of the file system
    static getRoot(){
        if (this.#root == null){
            console.log("Root has not been assigned yet.");
        }
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
        else if (type != "dir" | type != "file"){
            console.log("Type is not a 'dir' or 'file'.");
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

        // error checking for child: it cannot be null, a diff type than FileNode, or itself
        if (child === null){
            console.log("A null child cannot be added to the list.")
            return;
        }
        else if (!(child instanceof FileNode)) {
            console.log("Child is not of type FileNode.");
            return;
        }
        else if (child == this){
            console.log("Child cannot be itself.");
            return;
        }
        else if (child == this.getRoot()){
            console.log("Child cannot be the root node.");
            return;
        }
        else if (child.getParent() != null){
            console.log("Child has an associated parent already.");
            return;
        }
        this.#children.append(child);
        child.setParent(this);
    }
}