const getConnection = require('@/db');

export default function handler(req, res){
    const {divID} = req.body;
    let sql = "UPDATE schedulediv SET ";
    sql += "isDeleted = 1 "
    sql += "where divID = ?"
    getConnection(async (conn) => {
        conn.query(sql, [divID], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true);
            conn.release();
        })
        
    })
}