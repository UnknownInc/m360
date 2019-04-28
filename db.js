
const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');

const getPassword = function _getPassword(filename) {
  let DB_CONN = process.env.DB_CONN
  if (fs.existsSync(filename)) {
    DB_CONN = fs.readFileSync(filename).toString();
  }
  return DB_CONN;
}

const createModels = function _createModels(db) {
  let models={}
  models.Question = db.model('Question', require('./schema/question'))
  models.QuestionMap = db.model('QuestionMap', require('./schema/questionmap'))
  models.Response = db.model('Response', require('./schema/response'))
  models.User = db.model('User', require('./schema/user'))
  models.Company = db.model('Company', require('./schema/company'))
  models.Node = db.model('Node', require('./schema/node'))
  return models;
}

const getDBOptions = function _getDBOptions(){
  return {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
}

const createClient = async function _createClient(app) {
  try {
    app.status = app.status || {};
    app.status.db = app.status.db || {};

    if (app.db) {
      app.db.models  = createModels(app.db)
      return app.db;
    }


    const DB_CONN = getPassword('/etc/db/connstr');
    const options = getDBOptions();

    app.db = await mongoose.createConnection(DB_CONN, options);

    app.db.models  = createModels(app.db)

    return app.db;

  } catch (err) {
    console.error('Unable to connect to db.');
    console.error(util.inspect(err, { color: true }));
  }
}

module.exports = {
  getDBOptions,
  createModels,
  createClient,
}
