const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId;

// Data we need to collect/confirm to have the app go.
const fields = {
  name: {type: String, default:''},
  user: {type: ObjectId, ref: 'User'},

  parents: [{type: ObjectId, ref: 'User'}],
  children: [{type: ObjectId, ref: 'User'}],
  
  tags:[String]
}

// One nice, clean line to create the Schema.
const nodeSchema = new Schema(fields)

class NodeClass {

}

nodeSchema.index({user:1});
nodeSchema.index({parents:1});
nodeSchema.index({children:1});
nodeSchema.loadClass(NodeClass);

module.exports = nodeSchema
