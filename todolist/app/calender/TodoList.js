'use client'
import { useEffect, useRef, useState } from "react";
import DetailTodoList from "./DetailTodoList";
import Divlist from "./Divlist";
import axios from "axios";
import Timer from "./Timer";
import ClickForm from "./ClickForm";
import { useRouter } from 'next/navigation';

export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const divRefs = useRef();
    const [show, setShow] = useState(false);
    const [userID, setuserID] = useState('');
    const scrollTop = useRef(0);
    const timerId = useRef(null);
    const timerIdSec = useRef(null);
    const timerCircle = useRef(null);
    const timerSquare = useRef(null);
    const [gap, setGap] = useState(0)
    const TimeData = useRef('');
    const TodoListData = useRef('')
    const ClickRefs = useRef();
    
    let navigate = useRouter();
    let divlist = '';

    useEffect(() => {
        if(props.data == '' || props.data == null || props.data == undefined) return;
        
        console.log(props.data);
        setDivs([]);
        todolistSelectSubmit();
        loginCheck();
        
    }, [props.date])
    const loginCheck = () => {

        const url = 'http://localhost:3001/getUser';
        axios({
            method:'get',
            withCredentials: true,
            url: url
        }).then(res => {
           if (res.data == ''){
                alert("다시 로그인 해주세요");
                navigate.push('/');
                return;
           }else{
                setuserID(res.data.userID)
                
           }
        })
    }
    useEffect(() => {
        todolistSelectSubmit();
        loginCheck();
        divlist = document.getElementsByClassName('todolist')[0];
        function handleScroll() {
            scrollTop.current = document.getElementsByClassName('todolist')[0].scrollTop;
        }
        function moveTimer(){
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const second = now.getSeconds();	// 초

            const gap = ((hour - 8) * 3600) + (minute*60) + second;
            if(timerCircle.current == null || timerSquare.current == null) return
            if (gap < 0){
                timerCircle.current.style.top = `0px`;
                timerSquare.current.style.top = `0px`;
            }else{
                const distance = (100 / 3600);
                let total = distance*gap + 45;

                if (minute%15 === 0) {
                    total = Math.round(total);
                }

                if (timerCircle.current != null) timerCircle.current.style.top = `${total}px`;
                if (timerSquare.current != null) timerSquare.current.style.top = `${total}px`;

                if(minute%15 === 0 ){
                    const divListElements = Array.from(document.getElementsByClassName("divlistitem"));
                    let tmptodolist = '';
                    let flg = false;
                    for (let item of divListElements){
                        const top = parseInt(item.style.top);
                        if(total+5 === top){
                            const text = item.querySelector("span").innerText;
                            tmptodolist += text + ','
                            flg = true
                        }
                    }
                    tmptodolist = tmptodolist.slice(0,-1);
                    if (hour <= 11) TimeData.current = `오전 ${hour}시 ${minute}분`;
                    else if(hour === 12) TimeData.current = `오후 ${12}시 ${minute}분`;
                    else TimeData.current = `오후 ${hour - 12}시 ${minute}분`;
                    TodoListData.current = tmptodolist;
                    if (flg) setShow(true);
                }
            }
        }
        
        moveTimer();
        divlist.addEventListener('scroll', handleScroll);
        timerId.current = setInterval(() => {
            const now = new Date();
            const second = now.getSeconds();
            if (second === 0){
                moveTimer();
                timerIdSec.current = setInterval(() => {
                    moveTimer();
                }, 60000)
                clearInterval(timerId.current);
            }
            
        }, 1000);

        return () => {
            divlist.removeEventListener('scroll', handleScroll);
            clearInterval(timerIdSec.current);
        };
    }, [])
    
    const todolistSelectSubmit = () => {
        const url = '/api/todolist/select'
        const data ={
            date:props.date
        } 
        axios.post(url, data)
            .then((response) => {
                setDivs(response.data)
            })
    }

    const hrDraw = () => {
        let arr = [];
        for (let i = 8; i < 25; i++) {
            const tp = (i - 8) * 100 + 50;
            arr.push(
                <hr onMouseDown={() => { handleDivClick }} key={i} style={{ position: 'absolute', top: `${tp}px`, left: '0', margin: '0', borderTop: "1px solid black", width: '100%' }}>
                </hr>
            )
        }
        return arr
    }

    const handleDivClick = (e) => {
        let _left = e.nativeEvent.offsetX + 'px';
        let cnt = Math.round((e.nativeEvent.offsetY) / 25);
        if (e.target.tagName === 'HR') cnt = Math.round((parseInt(e.target.style.top) / 25));

        let top = cnt * 25 + 'px';
        if (cnt < 2) return;

        let newDiv = {
            _left: parseInt(_left),
            top: cnt * 25,
            width: 200,
            height: 100,
            start: getTime(cnt),
            end: getTime(cnt + 4),
            Date: props.date
        };
        const url = '/api/todolist/insert'
        const data = newDiv

        axios.post(url, data)
            .then((response) => {
                
                if (response.data){
                    newDiv.divID = response.data.insertId;
                    newDiv.divTitle="(제목 없음)";
                    newDiv.divContent = "(내용 없음)";
                    setDivs([...divs, newDiv]);
                }
                
                else alert("실패");
            })
            
        
    }

    const getTime = (cnt) => {
        let hour = parseInt((cnt - 2 ) / 4) + 8;
        const minute = (cnt - 2) % 4;
        let tmp = '';
        if (hour < 12) tmp += "오전 ";
        else tmp += "오후 ";

        if (hour <= 12) tmp += hour
        else tmp += hour - 12;

        if (minute == 0) tmp += "시";
        else tmp += ":" + 15 * minute;
        return tmp;

    }
    const timeList = () => {

        let arr = [];
        for (let i = 8; i < 25; i++) {
            let tmp = '';
            if (i < 12) tmp = `오전 ${i}시`;
            else tmp = `오후 ${i - 12}시`;
            if (i == 12) tmp = `오후 12시`;
            if (i == 24) tmp = `오전 0시`;
            const tp = (i - 8) * 100 + 50;
            arr.push(
                <span style={{ position: 'absolute', top: `${tp - 12}px`, textAlign: 'right', width: '100%' }} key={i}>{tmp}</span>
            )
        }
        return arr
    }

    const test = (e) => {
        let _left = e.nativeEvent.offsetX + 'px';
        let cnt = Math.round((e.nativeEvent.offsetY) / 25);
        if (e.target.tagName === 'HR') cnt = Math.round((parseInt(e.target.style.top) / 25));

        let top = cnt * 25 + 'px';
        if (cnt < 2) return;

        let newDiv = {
            _left: parseInt(_left),
            top: cnt * 25,
            width: 200,
            height: 100,
            start: getTime(cnt),
            end: getTime(cnt + 4),
            Date: props.date
        };
        newDiv.divTitle="(제목 없음)";
        newDiv.divContent = "(내용 없음)";
        ClickRefs.current.willBeUsedInParentComponent(newDiv);
    }

    return (
        
        <div className="todolist"
             style={{ display: "flex", flexDirection: 'row' }} 
             onMouseUp={() => divs.length !== 0 ? divRefs.current.willBeUsedInParentComponent() : null} >
            <div className="timelist">
                {timeList()}
            </div>
            <div className="wall"></div>
            <div className="divlist" onMouseDown={test}  >
                <ClickForm ref={ClickRefs} divs={divs} setDivs={setDivs}/>
                <div ref={timerCircle} className="timerCircle"></div>
                <div ref={timerSquare} className="timerSquare"></div>
                {hrDraw()}
                {divs.map((div, index) => (
                    <Divlist
                        ref={divRefs}
                        key={index}
                        div={div}
                        index={index}
                        /*setShow={setShow}*/
                    />
                ))}        
            </div> 

            
            <Timer setShow={setShow} show={show} TimeData={TimeData.current} TodoListData={TodoListData.current}/>
            
        </div>

        // <div className="todolist" onClick={handleDivClick} style={{ position: 'relative' }}>
        //     <hr/>
        //     {timeList()}
        //     {divs.map((div, index) => (
        //         <div
        //             key={index}
        //             onClick={handleDivsClick}
        //             ref={divRefs.current[index]}
        //             style={{
        //                 position: 'absolute',
        //                 left: div.left,
        //                 top: div.top,
        //                 width: '50px',
        //                 height: '50px',
        //                 background: 'lightgreen',
        //                 resize:'both',
        //                 overflow: 'auto'
        //             }}
        //         ></div>
        //     ))}
        // </div>
    )
}