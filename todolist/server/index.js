const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const getConnection = require('../db');
const passport = require('passport');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
app.use(bodyParser.json()); // 클라이언트가 보낸 json 형식의 문자열을 파싱하여 req.body에 저장한다.
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSession({secret:' mySecretKey', resave:false, saveUninitialized:false, cookie:{maxAge:3600000 }}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}));
app.use(cookieParser('mySecretKey')); // 쿠키 파싱 설정

const CLIENT_ID = '241966183545-i1kij6ck37n9l4so3sra5388tvogb3jf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04QHZb5xG3aO2CgYIARAAGAQSNwF-L9Ir6MhzKY5BPQbpI8b6YktMkTziND-02gpcCHeZ0VQkoXF2X8cDO_zKWN5lAfnnwq--kZI';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const SECRET_KEY = '1234';


app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
function encrypt(target){
    return bcrypt.hashSync(target, 10);
}


async function sendMail(userName, email){
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service :'gmail',
            auth:{
                type: 'OAuth2',
                user: 'qjatjs123123@gmail.com',
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const mailOptions = {
            from: '관리자 <qjatjs123123@gmail.com>',
            to: email,
            subject: "비밀번호 인증입니다.",
            text: '비밀번호 인증입니다.',
            html: `<h1>비밀번호 인증입니다.<h1><br/><h3>임시비밀번호 : ${randomBytes}<h3>`
        };
        await ChangeTmpPassword(randomBytes,userName);
        const result = await transport.sendMail(mailOptions);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

function ChangeTmpPassword(code, userID){
    return new Promise((resolve, reject) => {
        getConnection((conn) => {
            const sql = "UPDATE member SET userPassword = ? WHERE userID = ?"
            const params = [encrypt(code), userID]
            conn.query(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
                conn.release();
            })
        })
    })
}

app.post("/sendEmail", (req, res) => {
    const {userName, userNum, userEmail} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ? AND userMail = ?";
        let params = [userName, userEmail];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                let flg = false;
                rows.forEach((row) => {      
                    if(bcrypt.compareSync(userNum,row.userNum)){
                        flg = true;
                        sendMail(userName, userEmail)
                            .then((result) => res.send('이메일을 발송하였습니다.'))
                            .catch((error) => res.send('이메일 발송 중 에러가 발생하였습니다.'));
                    }
                })
                if (!flg) res.send('존재하지 않는 정보입니다.');

            })
    })
})


app.post('/changePw', (req, res) => {
    const {userPw, userID, pwcurrent} = req.body;  
    getConnection((conn) => {
        let sql = "SELECT * FROM member WHERE userID = ?";
        let params = [userID];
        conn.query(sql, params, (err, rows) => {
            console.log(rows);
            if (err || !bcrypt.compareSync(pwcurrent, rows[0].userPassword)) {res.send(false);conn.release();}
            else{
                sql = "UPDATE member SET userPassword = ? WHERE userID = ?"
                params = [encrypt(userPw), userID];
                conn.query(sql, params, (err, rows) => {
                    if (err) res.send(false)
                    else res.send(true);
                    conn.release();
                })
            }
        })
        
    })
})

app.post('/login', (req,res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) throw err;
        if (!user) res.send(false);
        if(user){
            req.login(user, (err) => {
                if(err) throw err;
                res.send('User loggin in');
                
            })
        }
    })(req, res, next);
})

app.get('/getUser', (req,res)=>{
    res.send(req.user);
})

app.get('/logout', (req, res) => {
    console.log("logout")
    req.logout(function(err){
        res.send(true);
    }
    );
    
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
app.post("/findId", (req, res) => {
    const {userName, userNum} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userName = ?";
        let params = [userName];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                let flg = false;
                rows.forEach((row) => {      
                    if(bcrypt.compareSync(userNum,row.userNum)){res.send(row); flg=true;}
                })
                if (!flg) res.send([]);
                
            })
    })
})

app.listen(3001, () => {
    console.log("3001 start");
})