const fs = require('fs');
const express = require('express');
const util = require('util');

const app = express();

app.status = {};

app.config = {};
app.config.port = process.env.PORT || 8080;
app.config.env=process.env;

function initialize(){
  try {
    app.config.VERSION = fs.readFileSync('./VERSION').toString();
  } catch (e) {
    console.error('Unable to read the VERSION file.');
    console.error( util.inspect(e, {color:true}));
  }

  require('./redisCache').createClient(app);
}

initialize();

app.use(express.static('build'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get('/_status',(req, res, next)=>{
    let result = Object.assign({}, app.status);

    result.config = Object.assign({},app.config);
    return res.json(result);
})

let server = app.listen(app.config.port, () => {
    console.log(`m360 app listening on port ${app.config.port}!`)
});

function closeApplication(){
    if (server===null) return; 
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        server=null
        app.cache.end(true);
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
