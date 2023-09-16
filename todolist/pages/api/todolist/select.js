
const getConnection = require('@/db');

export default function handler(req, res){
    const sql = "SELECT * from schedulediv WHERE userID = ? AND date = DATE_FORMAT(?, '%Y-%m-%d') AND isDeleted = 0";
    getConnection(async (conn) => {
        conn.query(sql, [req.body.userID, req.body.date], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(rows);
            conn.release();
        })
        
    })
}