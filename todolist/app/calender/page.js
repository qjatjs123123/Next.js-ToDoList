"use client"
import { useState } from "react";
import Datepicker from "./Datepicker";
import PostIt from "./PostIt";

export default function Calender(){
    const [date, setDate] = useState('');
    return(
        <div style={{height:'100%', width:'100%'}}>         
            <div className="datepicker_container">
                <div style={{width : '70%', display:'flex', flexDirection:'row'}}>
                    <p className="calender_font">Calender</p>  
                </div>
                <Datepicker setDate={setDate}/>
                <div style={{width : '70%', display:'flex', flexDirection:'row'}}>
                    <p className="calender_font">Post It</p>  
                </div>
                <PostIt/>
            </div>
            <div>
                
            </div>
        </div>
    )
}