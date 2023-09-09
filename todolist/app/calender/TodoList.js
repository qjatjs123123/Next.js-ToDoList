'use client'

import React, { useEffect, useRef, useState } from "react";
import DetailTodoList from "./DetailTodoList";
import Divlist from "./Divlist";
let isSizedrag = false;
let isdrag = false;
let pointerMoveEventListener = null; // 변수 추가
let ismove = false;
export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const divRefs = useRef();
    const [show, setShow] = useState(false);
    const scrollTop = useRef(0);

    let divlist = '';
    useEffect(() => {
        
        divlist = document.getElementsByClassName('todolist')[0];
        function handleScroll() {
            scrollTop.current = document.getElementsByClassName('todolist')[0].scrollTop;
        }
        divlist.addEventListener('scroll', handleScroll);

        return () => {
            divlist.removeEventListener('scroll', handleScroll);
          };
    },[])
    const timeList = () => {
        
        let arr = [];
        for (let i = 8; i < 25; i++) {
            let tmp = '';
            if ( i < 12) tmp = `오전 ${i}시`;
            else tmp = `오후 ${i-12}시`;
            if (i == 12) tmp = `오후 12시`;
            if (i == 24) tmp = `오전 0시`;
            const tp = (i-8)*100 + 50;
            arr.push(
                <span style={{position:'absolute', top:`${tp-12}px`, textAlign:'right',width:'100%'}} key={i}>{tmp}</span>
            )
        }
        return arr
    }

    const hrDraw = () =>{
        let arr = [];
        for (let i = 8; i < 25; i++) {
            const tp = (i-8)*100 + 50;
            arr.push(
                <hr onMouseDown={() => { handleDivClick}} key={i} style={{position:'absolute', top:`${tp}px`, left:'0', margin:'0', borderTop: "1px solid black", width: '100%'}}>
                </hr>
            )
        }
        return arr
    }

    const handleDivClick = (e) => {
        if (isdrag || isSizedrag) return
        let left = e.nativeEvent.offsetX + 'px';  
        let cnt = Math.round((e.target.scrollTop + e.nativeEvent.offsetY) / 25 );
        if(e.target.tagName === 'HR') cnt =  Math.round((e.target.scrollTop + parseInt(e.target.style.top) / 25));
    
        let top = cnt*25 +'px';
        if (cnt < 2) return;
        
        const newDiv = {
            left:  left,
            top:  cnt*25,
            width: 200,
            height:100,
            start: getTime(cnt),
            end: getTime(cnt+4)
        };
        setDivs([...divs, newDiv]);
    }
    
    const getTime = (top) => {
        let hour = parseInt((top + 2) / 4) + 7;
        const minute = (top + 2) % 4; 
        let tmp = '';
        if ( hour < 12) tmp +="오전 ";
        else tmp += "오후 ";

        if ( hour <= 12) tmp += hour
        else tmp += hour - 12;
        
        if (minute == 0) tmp+="시";
        else tmp += ":" + 15*minute;
        return tmp;
        
    }

    return (
        <div className="todolist" style={{display:"flex", flexDirection:'row'}} onMouseUp={() => divRefs.current.willBeUsedInParentComponent()} >
            <div className="timelist">
                {timeList()}
            </div>
            <div className="wall"></div>
            
            <div className="divlist"  onMouseDown={handleDivClick}>
                {hrDraw()}    
                {divs.map((div, index) => (
                    <Divlist 
                        ref = {divRefs}
                        key={index} 
                        div ={div} 
                        index={index} 
                        setShow={setShow}
                        />
                ))}
            </div>
            <DetailTodoList setShow={setShow} show={show}/>
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