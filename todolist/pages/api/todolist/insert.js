
const getConnection = require('@/db');

export default function handler(req, res){
    const {_left, top, width, height, start, end} = req.body;
    const sql = "INSERT INTO schedulediv ( userID, Date, top, _left, width, height, start, end ,isDeleted) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123',top,_left,width,height,start,end,0], (err, rows, fields)=>{
            console.log(err);
            if(err) res.send(false);
            else res.send(rows);
            
        })

    })
}