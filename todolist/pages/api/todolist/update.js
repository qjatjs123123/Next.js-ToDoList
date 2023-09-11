
const getConnection = require('@/db');

export default function handler(req, res){
    const {_left, top, width, height, start, end, divID} = req.body;
    let sql = "UPDATE schedulediv SET ";
    sql += "top = ? ,"
    sql += "_left = ? ,"
    sql += "width = ? ,"
    sql += "height = ? ,"
    sql += "start = ? ,"
    sql += "end = ?"
    sql += "where divID = ?"
    getConnection(async (conn) => {
        conn.query(sql, [top,_left,width,height,start,end,divID], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(true);
            conn.release();
        })
        
    })
}