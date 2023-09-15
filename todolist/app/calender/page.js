"use client"
import { useEffect, useRef, useState } from "react";
import Datepicker from "./Datepicker";
import PostIt from "./PostIt";
import TodoList from "./TodoList";
import axios from "axios";

export default function Calender(){
    const [date, setDate] = useState('');
    
    useState(() => {
        if(date== '' || date == null || date == undefined) return;
    },[date])
    

    
    return(
        <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'row'}}>         
            <div className="datepicker_container">
                <div style={{width : '70%', display:'flex', flexDirection:'row',marginTop:'1rem'}}>
                    <p className="calender_font">Calender</p>  
                </div>
                <Datepicker setDate={setDate}/>
                <div style={{width : '70%', display:'flex', flexDirection:'row',marginTop:'1rem'}}>
                    <p className="calender_font">Post It</p>  
                </div>
                <PostIt date={date}/>
            </div>
            <div  className="todoList_container">
            <div style={{width : '70%', display:'flex', flexDirection:'row',marginTop:'1rem'}}>
                    <p className="calender_font">TodoList</p>  
                </div>
                <TodoList date={date} />
            </div>
        </div>
    )
}