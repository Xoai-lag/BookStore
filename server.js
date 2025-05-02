const app = require("./src/app");
const mongoose = require('mongoose');


const port = process.env.DEV_APP_PORT || 3055

const server = app.listen(port,()=>{
    console.log(`WSV ecommerce start with port ${port}`)
})

process.on('SIGINT',async ()=>{
    console.log('\nGracefully shutting down...');
    await mongoose.connection.close(); // hoặc mongoose.disconnect()
    console.log('MongoDB connection closed.');
    server.close(()=>console.log('Exit Sever Express'))
})