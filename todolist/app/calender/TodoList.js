'use client'

import React, { useRef, useState } from "react";

export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const divRefs = useRef([]);
    const [isdrag, setIsdrag] = useState(false);
    const [isSizedrag, setIsSizedrag] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const startSizeX = useRef(0);
    const startSizeY  = useRef(0);
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
        if (isdrag || isSizedrag) return
        let left = e.nativeEvent.offsetX + 'px';
        let top = e.target.scrollTop + e.nativeEvent.offsetY + 'px';
        if(e.target.tagName === 'HR') top = e.target.scrollTop + parseInt(e.target.style.top) + 'px';
        const newDiv = {
            left:  left,
            top:  top,
            width: 200,
            height:100
        };
        divRefs.current.push(React.createRef());
        setDivs([...divs, newDiv]);
    }
    const handleDivsClick = (e) => {
        e.stopPropagation();
    }
    const resizestart = (e) => {
        setIsSizedrag(true);
        startSizeX.current = e.nativeEvent.offsetX
        startSizeY.current = e.nativeEvent.offsetY
        e.stopPropagation();
    }  
    const resizeend = (e) => {
        setIsSizedrag(false);
        e.stopPropagation();
    }
    const resize = (e, index) => {
        if (!isSizedrag) return;

        const newDivs = [...divs];
        newDivs[index] = {
            left: newDivs[index].left,
            top: newDivs[index].top,
            width: newDivs[index].width,
            height: parseInt(newDivs[index].height) -startSizeY.current+ e.nativeEvent.offsetY + "px",
          };
        setDivs(newDivs);
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

        newDivs[index] = {
            left: parseInt(e.target.style.left) - startX.current+ e.nativeEvent.offsetX + "px",
            top: parseInt(e.target.style.top) - startY.current+ e.nativeEvent.offsetY + "px",
            width: newDivs[index].width,
            height: newDivs[index].height
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
                            cursor:'pointer',
                            position: 'absolute',
                            left: div.left,
                            top: div.top,
                            width: div.width,
                            height: div.height,
                            backgroundColor: 'rgb(121, 134, 203)'
                        }}
                    >   

                    <div style={{cursor:'s-resize', position:'absolute',bottom: '0',width:'100%', height:'10px', backgroundColor:'rgb(121, 134, 203)', zIndex:'5'}}
                        onMouseDown={resizestart} onMouseMove={(e) => resize(e, index)} onMouseUp={resizeend}></div>         
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