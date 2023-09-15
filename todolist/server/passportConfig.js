const getConnection = require('../db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
   passport.use(
        new localStrategy((userID, userPassword, done) => {
            console.log(userID, userPassword)
            const sql = "SELECT * FROM member WHERE userID = ?";      
            getConnection((conn) => {
                
                conn.query(sql, [userID], (err, rows) => {
                    
                    if(err) throw err;
                    if(rows.length === 0) return done(null, false);

                    bcrypt.compare(userPassword, rows[0].userPassword, (err, rows)=> {
                        if(err) throw err;
                        if(rows === true) return done(null, rows[0]);
                        else return done(null, false);
                    })
                })
            })
        })
   ) 
   passport.serializeUser((user, done) => {
        console.log("sez")
        done(null, user.userID);
   })

   passport.deserializeUser((id, done) => {
    console.log("desi")
        const sql = "SELECT * FROM member WHERE userID = ?";
        getConnection((conn) => {
            conn.query(sql, [id], (err, result) => {
                if(err) throw err;
                const userInfo = {
                    userID : result[0].userID,
                    userName : result[0].userName
                }
                done(null, userInfo);
            })
        })
   })
}