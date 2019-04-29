const fs = require('fs');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');

const app = express();

app.status = {};

app.config = {};
app.config.jwtsecret = 'HGFLUKHUIYUJ5876587HGVHCGKV<';
app.config.account_api = `http://${process.env.ACCOUNT_SERVICE_HOST}:${process.env.ACCOUNT_SERVICE_PORT}`
app.config.port = process.env.PORT || 8080;
//app.config.env=process.env;

async function initialize(){
  try {
    app.config.VERSION = fs.readFileSync('./VERSION').toString();
  } catch (e) {
    console.error('Unable to read the VERSION file.');
    console.error( util.inspect(e, {color:true}));
  }

  require('./redisCache').createClient(app);
  await require('./db').createClient(app)
  require('./session').createSession(app);

  app.use(express.static('build'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
}

app.get('/ping', async (req, res)=>{
  //req.session.profile = {email:'rravuri@gmail.com', username:'rravuri', isAdmin: true};
  return res.send('pong');
})

app.get('/_status',async (req, res, next)=>{
    let result = Object.assign({}, app.status);
    result.config = Object.assign({},app.config);
    result.config.jwtsecret=null;
    result.health = {
      cache: app.cache.status
    };

    return res.json(result);
})


let server;

initialize().then(()=>{
  app.use(require('./routes'))
  app.get('*', function(req, res){
    res.sendFile('./build/index.html');
  });
  server = app.listen(app.config.port, () => {
      console.log(`m360 http server listening on port ${app.config.port}!`)
  });
});

function closeApplication(){
    if (server===null) return; 
    console.log('closing http server.');
    server.close(() => {
        console.log('http server closed.');
        server=null;
        try {
          console.log('closing cache connection.')
          app.cache.end(true);
        } catch(cerr) {
          console.error('ERROR: unable to end cache connection.', cerr);
        }

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
