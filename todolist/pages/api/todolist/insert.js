
const getConnection = require('@/db');

export default function handler(req, res){
    const {_left, top, width, height, start, end, date} = req.body;
    console.log(req.body);
    const sql = "INSERT INTO schedulediv ( userID, Date, top, _left, width, height, start, end ,isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123',date,top,_left,width,height,start,end,0], (err, rows, fields)=>{
            console.log(err);
            if(err) res.send(false);
            else res.send(rows);

        })
        conn.release();
    })
}