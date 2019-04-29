const session = require('express-session')
var RedisStore = require('connect-redis')(session);

module.exports ={
    createSession: (app)=>{
        const sessionOptions = {
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: true,
            cookie: {
            rolling: true,
            maxAge: 24 * 60 * 60 * 365
            },
            store : new RedisStore({
                client: app.cache
            })
        }

        if (app.get('env') === 'production') {
            app.set('trust proxy', 1) // trust first proxy
            //sessionOptions.cookie.secure = true // serve secure cookies
            sessionOptions.store = new RedisStore({
                client: app.cache
            })
        }
        app.use(session(sessionOptions))
    }
}
