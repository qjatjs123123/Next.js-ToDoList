const getConnection = require('../db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
   passport.use(
        new localStrategy({usernameField:'userID',
                            passwordField:'userPassword'},
            (userID, userPassword, done) => {
            const sql = "SELECT * FROM member WHERE userID = ?";      
            getConnection((conn) => {         
                conn.query(sql, [userID], (err, rows) => {
                    
                    if(err) throw err;
                    if(rows.length === 0) return done(null, false);

                    bcrypt.compare(userPassword, rows[0].userPassword, (err, row)=> {
                        if(err) throw err;
                        if(row === true){console.log(rows); return done(null, rows[0]);}
                        else return done(null, false);
                    })
                    conn.release();
                })
            })
        })
   ) 
   passport.serializeUser((user, done) => {
        console.log("sez")
        done(null, user.userID);
   })

   passport.deserializeUser((id, done) => {
    
        const sql = "SELECT * FROM member WHERE userID = ?";
        getConnection((conn) => {
            conn.query(sql, [id], (err, result) => {
                if(err) throw err;
                const userInfo = {
                    userID : result[0].userID,
                    userName : result[0].userName
                }
                conn.release();
                done(null, userInfo);
            })
        })
   })
}

// passport.serializeUser(function (user, done) {
//     console.log('serialize', user);
//     // done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     console.log('deserialize', id);
//     // User.findById(id, function (err, user) {
//     //     done(err, user);
//     // });
// });

// passport.use(new LocalStrategy(
//     {usernameField:'userID',
//     passwordField:'userPassword'},
//     function (userID, userPassword, done) {
//         const authData = {
//             email:'rudwns273@naver.com',
//             password:'12345'
//         }
//         console.log(userID, userPassword);
//         if (userID === authData.email && userPassword === authData.password) {
//             // 인증 성공 시 done 함수를 호출하고 사용자 정보를 전달
//             return done(null, authData);
//         } else {
//             // 인증 실패 시 done 함수를 호출하고 실패 메시지를 전달
//             return done(null, true, { message: 'Incorrect credentials' });
//         }
//     }
// ));