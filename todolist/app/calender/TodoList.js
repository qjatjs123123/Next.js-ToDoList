'use client'

import { useState } from "react";

export default function TodoList(props) {
    const [divs, setDivs] = useState([]);
    const timeList = () => {
        
        let arr = [];
        for (let i = 8; i < 25; i++) {
            arr.push(
                <div key={i} className="bordered-div">
                    {i}
                </div>
            )
        }
        return arr
    }

    const handleDivClick = (e) => {
        const { pageX, pageY } = e;
        const newDiv = {
            left: pageX + 'px',
            top: pageY + 'px',
        };

        setDivs([...divs, newDiv]);
    }
    const handleDivsClick = (e) => {
        e.stopPropagation();
    }
    return (
        <div className="todolist" onClick={handleDivClick}>
            {timeList()}
            {divs.map((div, index) => (
                <div
                    key={index}
                    onClick={handleDivsClick}
                    style={{
                        position: 'absolute',
                        left: div.left,
                        top: div.top,
                        width: '50px',
                        height: '50px',
                        background: 'lightgreen',
                        resize:'both',
                        overflow: 'auto'
                    }}
                ></div>
            ))}
        </div>
    )
}