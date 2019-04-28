const jwt = require('jsonwebtoken');
const getCompany = require('./common/utility').getCompany;

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    const app=req.app; 
    jwt.verify(token, app.config.jwtsecret, (err, decoded) => {
      if (err) {
        return res.sendStatus(403)//Token is not valid'
      } else {
        req.user = decoded;
        const email = req.user.email.toLowerCase();
        app.cache.get(email, async function (err, result) {
          if (err || !result) {
            console.log(err);
            const company = (getCompany(email)||'').trim();
            const User = app.db.models.User;
            try {
              const u=await User.findOne({email: email}).populate('company');
              result=u.toObject();
              if (u.company.admins.indexOf(u._id)!==-1) {
                result.isAdmin=true;
              }
              //set to expire after 1 hour
              app.cache.set(email, JSON.stringify(result),'EX', 3600)
            } catch (ex) {
              console.error(ex);
              return res.sendStatus(403);
            }
            //await app.db.U
          } else {
            result = JSON.parse(result);
          }
          console.log(result);
          req.user = result;
          next();
        })
      }
    });
  } else {
    return res.sendStatus(401) //Auth token is not supplied.
  }
};

module.exports = checkToken;
