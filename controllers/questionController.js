const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

exports.getCurrentQuestion = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({
      error: 'Unknown user'
    })
  }

  const item = {
    _id:'75376567',
    question: "Do your teammates know how to keep Sapient & Sapient's Clients intellectual property and data safe?",
    category: "Team",
    tags:["Motivation"],
    options:[
      { option:"Always", value:"a"},
      { option:"Usually", value:"b"},
      { option:"Sometimes", value:"c"},
      { option:"Rarely", value:"d"},
      { option:"Never", value:"e"}
    ],
    targetmintenure: 0,
    targetlevels: 'all'
  }
  // const item = {
  //   _id:'75376567',
  //   question: "For what area of information security would you want more training / information?",
  //   category: "Work Environment",
  //   tags:["Motivation"],
  //   options:[
  //     { option:"Working with external parties", value:"a"},
  //     { option:"Setting up permissions", value:"b"},
  //     { option:"Discussing confidential work in public spaces", value:"c"},
  //     { option:"Working with and storing customer data|Something else", value:"d"}
  //   ],
  //   targetmintenure: 0,
  //   targetlevels: 'all'
  // }

  return res.json(item)
}

exports.getQuestions = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: "Unknown user"
    })
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      error: "Not authorized"
    }) 
  }


  const Question = req.app.db.models.Question;
  //TODO: validate the questions query parameters
  const query={}

  try {
    const results = await Question.find(query)
    const questions=[];
    results.forEach(q => {
      questions.push(q.toObject())
    });
    return res.json(questions);
  }
  catch (err) {
    console.error(err)
    return res.status(500)
  }

}


exports.updateQuestions = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: "Unknown user"
    })
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      error: "Not authorized"
    }) 
  }

  const questions=req.body.questions||[];
  //TODO: validate the questions
  const Question = req.app.db.models.Question;

  var bulk = Question.collection.initializeOrderedBulkOp();
    questions.forEach(q=>{
      bulk.find({'_id': ObjectId(q._id)}).updateOne({$set: {
        question: q.question,
        category: q.category,
        tags:q.tags,
        options: q.options,
        modifiedBy: user.email,
        modifiedAt: Date.now,
        targetlevels: q.targetlevels||'all',
        targetmintenure: q.targetmintenure||0
      }});
    })
    bulk.execute(function (error) {
      if (error) {
        console.log(error)
        return res.sendStatus(500)
      }
      return res.sendStatus(200)
    })
}

exports.addQuestions = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: "Unknown user"
    })
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      error: "Not authorized"
    }) 
  }

  const newQuestions=[];
  req.body.questions.forEach(q => {
    newQuestions.push({
      question: q.question,
      category: q.category,
      tags:q.tags,
      options: q.options,
      createdBy: user.email,
      modifiedBy: user.email,
      targetlevels: q.targetlevels||'all',
      targetmintenure: q.targetmintenure||0
    })
  });

  //TODO: validate the questions
  const Question = req.app.db.models.Question;

  Question.insertMany(newQuestions)
    .then(qlist=>{
      return res.status(200).json(qlist)
    })
    .catch(err=>{
      console.log(err);
      return res.status(500)
    })

}
