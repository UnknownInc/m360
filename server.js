const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('build'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());


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