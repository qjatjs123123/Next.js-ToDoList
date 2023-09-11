
const getConnection = require('@/db');

export default function handler(req, res){
    const sql = "SELECT * from schedulediv WHERE userID = ? AND date = NOW()";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123'], (err, rows, fields)=>{
            res.send(rows);
        })

    })
}