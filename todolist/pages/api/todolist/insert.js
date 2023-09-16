
const getConnection = require('@/db');

export default function handler(req, res){
    const {userID,_left, top, width, height, start, end, Date, divTitle, divContent} = req.body;
    const sql = "INSERT INTO schedulediv ( userID, Date, top, _left, width, height, start, end ,isDeleted, divTitle,divContent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    getConnection(async (conn) => {
        conn.query(sql, [userID,Date,top,_left,width,height,start,end,0,divTitle,divContent], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(rows);
            conn.release();

        })
        
    })
}