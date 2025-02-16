const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const sessionConfig = (app) => {
    app.use(session({
        store: new SQLiteStore({
            db: '../db/database.sqlite',
            table: 'sessions'
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, 
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            path: '/',
        }
    }));
};

module.exports = sessionConfig;