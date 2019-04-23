const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;   //this.app = express();
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            // Add your code here
            if(req.params.index ){
                let height = req.params.index ;
                let block = this.blocks[height] ; //Call Blockchain class method that retrieves the block object LevelDB
                if (block){
                    return res.status(200).json(block) ; 
                }else{
                    return res.status(404).send("Not Found");
                }
            }else{
                return  res.status(500).send("The index is required")
            }


        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
            // Add your code here
            if(req.body.data){
                //Call the method in Blockchain class addBlock(block)
                let block = new BlockClass.Block(req.body.data); 
                block.height = this.blocks.length;
                block.hash = SHA256(JSON.stringify(block)).toString();
                this.blocks.push(block);
                return res.status(200).json(this.block);
            }else{
                res.status(500).json("The data is required!");
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}