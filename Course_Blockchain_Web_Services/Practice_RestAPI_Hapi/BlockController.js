const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 * 
 *  curl -X POST \
 *  http://localhost:3000/api/block \
 *   -H 'Cache-Control: no-cache' \
 *   -H 'Content-Type: application/json' \
 *   -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
 *   -d '{
 *     "data":"Some data example"
 *  }'
 * 
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: (request, h) => {
                if(request.params.index){
                    let height = request.params.index;
                    let block = this.blocks[height];
                    if(block){
                        return h.response(block).code(200);
                    } else {
                        return h.response(null).code(404);
                    }
                }else{
                    return h.response("The index is required").code(500);
                }
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: (request, h) => {
                if(request.payload.data){
                    let block = new BlockClass.Block(request.payload.data);
                    block.height = this.blocks.length;
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    this.blocks.push(block);
                    return h.response(this.block).code(200);    
                }else{
                    return h.response("the data is required").code(500);    
                }
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
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}