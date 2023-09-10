
const getConnection = require('@/db');

export default function handler(req, res){
    const {_left, top, width, height, start, end, Date} = req.body;
    const sql = "INSERT INTO schedulediv ( userID, Date, top, _left, width, height, start, end ,isDeleted, divTitle,divContent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    getConnection(async (conn) => {
        conn.query(sql, ['qjatjs123123',Date,top,_left,width,height,start,end,0,'(제목 없음)','(내용 없음)'], (err, rows, fields)=>{
            if(err) res.send(false);
            else res.send(rows);
            conn.release();

        })
        
    })
}