const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId;

// Data we need to collect/confirm to have the app go.
const fields = {
  user: {type: ObjectId, ref: 'User'},

  parent: {type: ObjectId, ref: 'User'},
  children: [{type: ObjectId, ref: 'User'}],
  
  tags:[String]
}

// One nice, clean line to create the Schema.
const nodeSchema = new Schema(fields)

class NodeClass {

}

nodeSchema.loadClass(NodeClass);

module.exports = nodeSchema
