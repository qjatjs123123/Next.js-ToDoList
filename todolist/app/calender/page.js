"use client"
import { useState } from "react";
import Datepicker from "./Datepicker";
import TodoList from "./TodoList";

export default function Calender(){
    const [date, setDate] = useState('');
    return(
        <div style={{height:'100%', width:'100%'}}>         
            <div className="datepicker_container">
                <div style={{width : '70%', display:'flex', flexDirection:'row'}}>
                    <p className="calender_font">Calender</p>  
                </div>
                <Datepicker setDate={setDate}/>
                <p className="calender_font">ToDoList</p>  
                <TodoList/>
            </div>
            <div>
                
            </div>
        </div>
    )
}