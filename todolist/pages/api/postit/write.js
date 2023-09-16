
const getConnection = require('@/db');

export default function handler(req, res){
    const sql = "INSERT INTO postit (userID, date, content) VALUES (?,?,?)";
    getConnection(async (conn) => {
        conn.query(sql, [req.body.userID,req.body.date, req.body.content], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true)
            conn.release();
        })
        
    })
}