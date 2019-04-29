const getCompany = require('../common/utility').getCompany;
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId;

exports.updateTeam = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }

  const User = req.app.db.models.User;
  const Node = req.app.db.models.Node;

  let add = req.body.add;
  let remove = req.body.remove;

  add=add||[];
  remove=remove||[];

  try {
    const query={_id: ObjectId(req.params.id)}
    let n = await Node.findOne(query)
    if (!n) {
      return res.sendStatus(404);
    }

    if (!n.user.equals(user._id) && !user.isAdmin) {
      return res.sendStatus(403);
    }

    if (req.body.name) {
      n.name=req.body.name;
    }

    const newemails=[]
    add.forEach(newuseremail => {
        newemails.push(newuseremail.trim().toLowerCase());
    });

    const newusers = await User.find({email:{'$in':newemails}});
    let i=0;
    for(i=0;i<newusers.length;i++) {
      const nu=newusers[i];
      n.children.addToSet(nu._id);
      /*
      let cn = await Node.findOne({user:nu._id})
      if (!cn) {
        cn = new Node({user:nu._id})
        cn.parents.addToSet(n._id);
        cn.save();
      } else {
        cn.parents.addToSet(n._id);
        cn.save();
      }
      */
    }

    const oldemails=[]
    remove.forEach(olduseremail => {
        oldemails.push(olduseremail.trim().toLowerCase());
    });

    const oldusers = await User.find({email:{'$in':oldemails}});
    for(i=0;i<oldusers.length;++i){
      const ou=oldusers[i];
      n.children.remove(ou._id);
      /*
      let cn = await Node.findOne({user:nu._id})
      if (cn) {
        cn.parents.remove(n._id);
        cn.save();
      }
      */
    }

    n = await n.save()
    n = await Node.populate(n,{'path':'children'})
    return res.json(n.toObject());
  }
  catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}

exports.createTeam = async (req, res)=>{
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }

  let userid=user._id;
  if (req.query.user) {
    if (!user.isAdmin) {
      return res.sendStaus(403)
    }
    userid=req.query.user;
  }

  const Node = req.app.db.models.Node;
  try {
    let n=new Node({user: ObjectId(userid)});
    n.name=req.body.name||'';
    n = await n.save()
    return res.json(n.toObject());
  } catch (err){
    console.error(err)
    return res.status(500)
  }
}

exports.getTeam = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }

  let userid=user._id;
  if (req.query.user) {
    if (!user.isAdmin) {
      return res.sendStaus(403)
    }
    userid=req.query.user;
  }

  const Node = req.app.db.models.Node;
  const query={user: ObjectId(userid)}

  if (req.query.name) {
    query.name=name;
  }

  if (req.query.id) {
    query._id=ObjectId(req.query.id);
  }
  try {
    let nl = await Node.find(query)
    if (nl.length==0) {
      let n = new Node({user: ObjectId(userid)})
      n = await n.save();
      nl.push(n);
    }

    const teams=[];
    for(let i=0;i<nl.length;i++) {
      const t = await Node.populate(nl[i],{'path':'children', options:{limit:500}})
      teams.push(t.toObject())
    }
    return res.json(teams);
  }
  catch (err) {
    console.error(err)
    return res.status(500)
  }
}
