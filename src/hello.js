const Cortex = require("../lib/cortex");
const CONFIG = require("../config.json");

// Run from Nodejs console
//      When a file is run directly from Node.js, require.main is set to its module. 
//      That means that it is possible to determine whether a file has been run directly by testing require.main === module.
//      else it is required as a module
//      see doc at https://nodejs.org/docs/latest/api/all.html#modules_accessing_the_main_module
if (require.main === module) {

    // Unhandled errors
    process.on("unhandledRejection", err => {
        throw err;
    });

    // Tell the console what it is doing
    // - verbose
    // - create a new Cortex client
    const verbose = process.env.LOG_LEVEL || 1;
    const options = {verbose};
    const client = new Cortex(options);

    const auth = {
        username: CONFIG.username,
        password: CONFIG.password,
        client_id: CONFIG.client_id,
        client_secret: CONFIG.client_secret,
        debit:1 // first time you run example debit should > 0
    };
    
    // Requests
    // - Wait for client to be ready
    // - Wait for client to be init with auth
    // - Start async process, await for resquests to fulfill
    client.ready.then(() => 
    client.init(auth).then(async () => {
        try {
            const user = await client.getUserLogin();
            console.log("User logged in : " + user[0]);
        } catch (e) {
            showError(e)
        }
        }).then(() => 
    client.close().then(console.warn("Client closed.")))
    )
    ;
}
