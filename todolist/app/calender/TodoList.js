'use client'

import React, { useRef, useState } from "react";

export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const divRefs = useRef([]);
    const [isdrag, setIsdrag] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const timeList = () => {
        
        let arr = [];
        for (let i = 8; i < 25; i++) {
            let tmp = '';
            if ( i <= 12) tmp = `오전 ${i}시`;
            else tmp = `오후 ${i-12}시`;
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
        if (isdrag) return
        let left = e.nativeEvent.offsetX + 'px';
        let top = e.target.scrollTop + e.nativeEvent.offsetY + 'px';
        if(e.target.tagName === 'HR') top = e.target.scrollTop + parseInt(e.target.style.top) + 'px';
        const newDiv = {
            left:  left,
            top:  top
        };
        divRefs.current.push(React.createRef());
        setDivs([...divs, newDiv]);
    }
    const handleDivsClick = (e) => {
        e.stopPropagation();
    }

    const dragdivstart = (e) => {
        startX.current = e.nativeEvent.offsetX
        startY.current = e.nativeEvent.offsetY
        setIsdrag(true)
    }  
    
    const dragdivmove = (e,index) =>{
        if (!isdrag) return;

        const newDivs = [...divs];
        const divRef = divRefs.current[index];

        console.log(parseInt(e.target.style.left));
        newDivs[index] = {
            left: parseInt(e.target.style.left) - startX.current+ e.nativeEvent.offsetX + "px",
            top: parseInt(e.target.style.top) - startY.current+ e.nativeEvent.offsetY + "px",
          };
          setDivs(newDivs);
    }
    const dragdivend = (e) =>{
        setIsdrag(false)
    }
    return (
        <div className="todolist" style={{display:"flex", flexDirection:'row'}}>
            <div className="timelist">
                {timeList()}
            </div>
            <div className="wall" onClick={handleDivsClick}></div>
            
            <div className="divlist"  onClick={handleDivClick}>
                {hrDraw()}    
                {divs.map((div, index) => (
                    <div
                        key={index}
                        onClick={handleDivsClick}
                        onMouseMove={(e) => dragdivmove(e, index)}
                        onMouseDown={dragdivstart}
                        onMouseUp={dragdivend}
                        ref={divRefs.current[index]}
                        style={{
                            position: 'absolute',
                            left: div.left,
                            top: div.top,
                            width: '200px',
                            height: '100px',
                            background: 'lightgreen',
                            resize:'both',
                            overflow: 'auto'
                        }}
                    ></div>
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