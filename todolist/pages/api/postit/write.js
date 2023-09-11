
const getConnection = require('@/db');

export default function handler(req, res){
    const sql = "INSERT INTO postit (userID, date, content) VALUES (?,?,?)";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123',req.body.date, req.body.content], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true)
            conn.release();
        })
        
    })
}