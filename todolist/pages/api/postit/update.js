const getConnection = require('@/db');

export default function handler(req, res){
    const {content, date, postitID} = req.body;
    let sql = "UPDATE postit SET ";
    sql += "content = ? ,"
    sql += "date = ? "
    sql += "where postitID = ?"
    getConnection(async (conn) => {
        conn.query(sql, [content, date, postitID], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true);
            conn.release();
        })
        
    })
}