
const getConnection = require('@/db');

export default function handler(req, res){
    console.log(req.body);
    const sql = "INSERT INTO postit (userID, date, content) VALUES (?,NOW(),?)";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123', req.body.content], (err, rows, fields)=>{
            res.send('true')
        })

    })
}