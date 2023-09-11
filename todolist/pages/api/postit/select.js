
const getConnection = require('@/db');

export default function handler(req, res){
    const sql = "SELECT * from postit WHERE userID = ? AND date = DATE_FORMAT(?, '%Y-%m-%d')";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123', req.body.date], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(rows);
            conn.release();
        })
        
    })
}