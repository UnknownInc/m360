const axios = require('axios');
const jwt = require('jsonwebtoken');
const getCompany = require('../common/utility').getCompany;
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId;

exports.verify = async (req, res) => {
  const email = (req.body.email||'').trim().toLowerCase();

  const company = (getCompany(email)||'').trim();

  if (company==='') {
    res.status(400).json({
      Error: 'Invalid email.'
    })
  }

  const token = req.body.token||'';

  if (token==='') {
    res.status(400).json({
      Error: 'Invalid token.'
    })
  }

  const payload ={email, token}

  try {
    await axios.post(`${req.app.config.account_api}/${company}/verify`, payload)
    const user = {email, username: email.substr(0,email.indexOf('@'))}
    let token = jwt.sign(user,
      req.app.config.jwtsecret,
      { 
        expiresIn: '365d'
      }
    );

    return res.status(200).json({
      message: 'Successfully verified.',
      token
    })
  } catch(err) {
    //fs.writeFileSync("error.json",JSON.stringify(err))
    console.error("exception:"+err);
    if (err.response) {
      return res.status(err.response.status).json(
        err.response.data
      )
    } else {
      return res.status(500).json({
        Error: 'Server error. '+err.message
      }) 
    }
  }
}

exports.register = async (req, res)=>{
  const email = (req.body.email||'').trim().toLowerCase();

  const company = getCompany(email)||'';

  if (company==='') {
    res.status(400).json({
      Error: 'Invalid email.'
    })
  }

  const payload = {
    email: email,
    companyUrl:`${req.protocol}://${req.get('host')}`
  }

  console.log(payload)
  try {
    const response = await axios.post(`${req.app.config.account_api}/${company}/register`, payload)

    if (response.status!==200) {
      console.error(respose.data);
      return res.status(response.status).json({
        Error: response.data.Error || 'Unable to register. Unknown internal error'
      })
    }

    return res.status(200).json({
      message: `Thanks for registering. Please verify as per the instructions sent to ${email}`
    })
  } catch(err) {
    console.error("exception:"+err);
    return res.status(500).json({
      Error: 'Unknown server error.'
    })
  }
}

exports.getProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }
  res.set('Cache-Control', 'public, max-age=60');
  return res.json(user)
}

exports.updateTeam = async (req, res) => {
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

  const User = req.app.db.models.User;
  const Node = req.app.db.models.Node;
  const query={user: ObjectId(userid)}

  let add = req.body.add;
  let remove = req.body.remove;

  add=add||[];
  remove=remove||[];

  try {
    let n = await Node.findOne(query)
    if (!n) {
      n = new Node({user: ObjectId(userid)})
      n= await n.save();
    }

    const newemails=[]
    add.forEach(newuseremail => {
        newemails.push(newuseremail.trim().toLowerCase());
    });

    const newusers = await User.find({email:{'$in':newemails}});
    newusers.forEach(nu=>{
      n.children.addToSet(nu._id);
    })

    const oldemails=[]
    remove.forEach(olduseremail => {
        oldemails.push(olduseremail.trim().toLowerCase());
    });

    const oldusers = await User.find({email:{'$in':oldemails}});
    oldusers.forEach(ou=>{
      n.children.remove(ou._id);
    })

    console.log(n);
    n = await n.save()
    n = await Node.populate(n,{'path':'children'})
    return res.json(n.toObject());
  }
  catch (err) {
    console.error(err)
    return res.sendStatus(500)
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

  try {
    let n = await Node.findOne(query)
    if (!n) {
      n=new Node({user: ObjectId(userid), children:[]})
      n = await n.save();
    }
    const team = await Node.populate(n,{'path':'children'})
    
    return res.json(team.toObject());
  }
  catch (err) {
    console.error(err)
    return res.status(500)
  }
}

exports.getUsers = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }

  //const company = (getCompany(email)||'').trim();
  const User = app.db.models.User;
  //TODO: validate the questions query parameters
  const query={}

  try {
    const results = await User.find(query)
    const users=[];
    results.forEach(u => {
      users.push(u.toObject())
    });
    return res.json(users);
  }
  catch (err) {
    console.error(err)
    return res.status(500)
  }
}

