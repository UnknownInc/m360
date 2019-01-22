const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const config = {};

config.env=process.env;
config.VERSION = fs.readFileSync('./VERSION').toString();
config.REDIS_PASSWORD = fs.readFileSync('/etc/redis/redis-password').toString(); 

app.use(express.static('build'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get('/_status',(req, res, next)=>{
    let status={};
    status.config = config;
    return res.json(status);
})

let server = app.listen(port, () => {
    console.log(`m360 app listening on port ${port}!`)
});

function closeApplication(){
    if (server===null) return; 
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        server=null
        process.exit(0);
        /*
        // boolean means [force], see in mongoose doc
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
        */
    });
}

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    closeApplication();
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    closeApplication();
});