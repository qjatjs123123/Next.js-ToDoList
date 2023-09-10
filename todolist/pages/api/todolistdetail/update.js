const getConnection = require('@/db');

export default function handler(req, res){
    const {divContent, divTitle, divID} = req.body;
    let sql = "UPDATE schedulediv SET ";
    sql += "divTitle = ? ,"
    sql += "divContent = ? "
    sql += "where divID = ?"
    getConnection(async (conn) => {
        conn.query(sql, [divTitle, divContent, divID], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true);
        })
        conn.release();
    })
}