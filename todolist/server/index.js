const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const getConnection = require('../db');
const passport = require('passport');


app.use(bodyParser.json()); // 클라이언트가 보낸 json 형식의 문자열을 파싱하여 req.body에 저장한다.
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSession({secret:' mySecretKey', resave:false, saveUninitialized:false}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}));
app.use(cookieParser('mySecretKey')); // 쿠키 파싱 설정

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
function encrypt(target){
    return bcrypt.hashSync(target, 10);
}

app.get('/', (req, res) => {
    res.send('heelo World');
})

app.post('/login', (req,res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(user);
        if(err) throw err;
        if (!user) res.send(false);
        if(user){
            req.login(user, (err) => {
                if(err) throw err;
                res.send('User loggin in');
                console.log(user);
            })
        }
    })(req, res, next);
})

app.get('/getUser', (req,res)=>{
    res.send(req.user);
})
app.post("/idcheck", (req, res) => {
    const {userId} = req.body;
    let params = [userId];
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ?";
        let params = [userId];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                res.send(rows);
            })
    })
})

app.post("/join", (req, res) => {
    const {userId, userPw, userName, userMail, userNum} = req.body;  
    getConnection((conn) => {
        const sql = 'INSERT INTO member VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        let params = [userId, encrypt(userPw), userName, userMail, encrypt(userNum),null,null,null];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                res.send(rows);
            })
    })
})


app.listen(3001, () => {
    console.log("3001 start");
})