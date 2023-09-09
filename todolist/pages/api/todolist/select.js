
const getConnection = require('@/db');

export default function handler(req, res){
    console.log(req.body);
    const sql = "SELECT * from schedulediv WHERE userID = ? AND date = DATE_FORMAT(NOW(), '%Y-%m-%d')";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123'], (err, rows, fields)=>{
            res.send(rows);
        })

    })
}