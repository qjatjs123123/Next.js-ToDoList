
const getConnection = require('@/db');

export default function handler(req, res){
    console.log(req.body);
    const sql = "SELECT * from schedulediv WHERE userID = ? AND date = DATE_FORMAT(?, '%Y-%m-%d') AND isDeleted = 0";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123', req.body.date], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(rows);
            conn.release();
        })
        
    })
}