const Cortex = require("../lib/cortex");

// When user start this from the console
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
        username: "your_username",
        password: "your_passwork",
        client_id: "your_cortex_client_id",
        client_secret: "your_cortex_client_secret",
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
