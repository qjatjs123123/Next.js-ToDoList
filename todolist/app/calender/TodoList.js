'use client'

import React, { useEffect, useRef, useState } from "react";
let isSizedrag = false;
let isdrag = false;
let pointerMoveEventListener = null; // 변수 추가
export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const divRefs = useRef([]);
    //const [isdrag, setIsdrag] = useState(false);
    //const [isSizedrag, setIsSizedrag] = useState(false);
    
    const startX = useRef(0);
    const startY = useRef(0);
    const currentIndex = useRef(0);
    const startSizeY  = useRef(0);
    const currentHeight = useRef(0);
    const scrollTop = useRef(0);
    const currentscrollTop = useRef(0);
    const currentleft = useRef(0);
    const currenttop = useRef(0);
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
                <hr onClick={() => alert("qw")} key={i} style={{position:'absolute', top:`${tp}px`, left:'0', margin:'0', borderTop: "1px solid black", width: '100%'}}>
                </hr>
            )
        }
        return arr
    }

    const handleDivClick = (e) => {
        if (isdrag || isSizedrag) return
        let left = e.nativeEvent.offsetX + 'px';  
        let cnt = Math.round((e.target.scrollTop + e.nativeEvent.offsetY) / 25 );
        let top = cnt*25 +'px';
        if (cnt < 2) return;
        if(e.target.tagName === 'HR') top = e.target.scrollTop + parseInt(e.target.style.top) + 'px';
        const newDiv = {
            left:  left,
            top:  cnt*25,
            width: 200,
            height:100,
            start: getTime(cnt),
            end: getTime(cnt+4)
        };
        divRefs.current.push(React.createRef());
        setDivs([...divs, newDiv]);
    }
    const handleDivsClick = (e) => {
        e.stopPropagation();
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
    const eventstart = (e) => {
        console.log('start');
        
        if (pointerMoveEventListener === null){
            pointerMoveEventListener = pointermoveHandler;
            document.getElementsByClassName('todolist')[0].addEventListener('pointermove', pointermoveHandler);
        }
        
    }
    const pointermoveHandler = (event) => {
        const events = event.getCoalescedEvents();
        for (let event of events) {
            eventHandler(event);
        }
    }
    const resizestart = (e, index) => {
        eventstart(e);
        //setIsSizedrag(true);
        isSizedrag = true
        currentIndex.current = index;
        startSizeY.current = e.clientY;
        currentHeight.current = divs[currentIndex.current].height;
        currentscrollTop.current = scrollTop.current;
        e.stopPropagation();
        e.preventDefault();
    }  
    const resize = (e) => {

        const newDivs = [...divs];
        const index = currentIndex.current;
        const height = parseInt(scrollTop.current) - parseInt(currentscrollTop.current)
                     + parseInt(currentHeight.current) - startSizeY.current + e.clientY
        if ( height <= 50 || parseInt(newDivs[index].top)  + height > 1650 || parseInt(height) % 25 !== 0) return
        let cnt = Math.round( (parseInt(newDivs[index].top) + height) / 25 );
        newDivs[index] = {
            left: newDivs[index].left,
            top: newDivs[index].top,
            width: newDivs[index].width,
            height:height + "px",
            start: newDivs[index].start,
            end: getTime(cnt)
        };
        setDivs(newDivs);
    }
    const dragdivstart = (e,index) => {
        isdrag = true;
        
        currentIndex.current = index;
        startX.current = e.clientX
        startY.current = e.clientY
        if (e.target.tagName === 'SPAN'){
            currentleft.current = parseInt(e.target.parentElement.style.left);
            currenttop.current = parseInt(e.target.parentElement.style.top);
        }else{
            currentleft.current = parseInt(e.target.style.left);
            currenttop.current = parseInt(e.target.style.top);
        }
        eventstart(e);
        e.stopPropagation();
        e.preventDefault();
    }  
    
    const dragdivmove = (e) =>{
        
        const newDivs = [...divs];
        const index = currentIndex.current;
        const divRef = divRefs.current[index];
        let cnt = Math.round(parseInt(currenttop.current - startY.current+ e.clientY)/25);
        if (cnt < 2 || (currentleft.current - startX.current+ e.clientX) <15) return;
        let endcnt = Math.round((cnt*25 + parseInt(newDivs[index].height)) /25)
        newDivs[index] = {
            left: currentleft.current - startX.current+ e.clientX + "px",
            top: cnt*25 + "px",
            width: newDivs[index].width,
            height: newDivs[index].height,
            start:getTime(cnt),
            end:getTime(endcnt)
          };
          setDivs(newDivs);

    }
    const dragdivend = (e) =>{
        setIsdrag(false);
    }

    const eventHandler = (e) => {
        
        if (isSizedrag) resize(e);
        if (isdrag) dragdivmove(e);
    }

    const eventend = () =>{
        isdrag = false;
       isSizedrag=false;
       console.log('end');
       document.getElementsByClassName('todolist')[0].removeEventListener('pointermove', pointerMoveEventListener);
       pointerMoveEventListener=null;

    }
    return (
        <div className="todolist" style={{display:"flex", flexDirection:'row'}} onMouseUp={eventend} >
            <div className="timelist">
                {timeList()}
            </div>
            <div className="wall" onClick={handleDivsClick}></div>
            
            <div className="divlist"  onMouseDown={handleDivClick}>
                {hrDraw()}    
                {divs.map((div, index) => (
                    <div
                        key={index}
                        onClick={handleDivsClick}
                        className="a"
                        onMouseDown={(e) => dragdivstart(e, index)}
                        onMouseUp={eventend}
                        ref={divRefs.current[index]}
                        style={{
                            cursor:'pointer',
                            position: 'absolute',
                            left: div.left,
                            top: div.top,
                            width: div.width,
                            height: div.height,
                            backgroundColor: 'rgb(121, 134, 203)',
                            borderRadius:'10px',
                            border: '1px solid white',
                            color:'white',
                            display:'flex',
                            flexDirection:"column"
                        }}
                    >   
                    <span style={{marginLeft:'5px', fontSize:'13px', fontWeight:'bold'}}>(제목 없음)</span>
                    <span style={{marginLeft:'5px', fontSize:'13px', fontWeight:'bold'}}>{div.start}~{div.end}</span>
                    <div style={{ 
                                    className:"b",
                                    cursor:'s-resize', 
                                    position:'absolute',
                                    bottom: '0',
                                    width:'100%', 
                                    marginBottom:'1px',
                                    height:'10px', 
                                    backgroundColor:'rgb(121, 134, 203)',
                                    borderRadius:'50px'                         
                                }}
                        onMouseDown={(e) => resizestart(e, index)} onMouseUp={eventend}></div>         
                    </div>
                    
                ))}
            </div>
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