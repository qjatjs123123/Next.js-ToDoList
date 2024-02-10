'use client'
import { useEffect, useState } from "react";


export default function Datepicker(props){

    const thead_Day = ['일', '월', '화', '수', '목', '금', '토'];

    const [today_year, settoday_year] = useState();
    const [today_month, settoday_month] = useState();
    const [today_day, settoday_day] = useState();

    const [current_year, setYear] = useState((new Date()).getFullYear());
    const [current_month, setMonth] = useState((new Date()).getMonth() + 1);
    const [current_day, setDay] = useState((new Date()).getDate());
    
    // let current_month = (new Date()).getMonth() + 1;
    useEffect(() => {
        settoday_year((new Date()).getFullYear());
        settoday_month((new Date()).getMonth() + 1);
        settoday_day((new Date()).getDate());
        console.log((new Date()).getFullYear(), (new Date()).getMonth() + 1, (new Date()).getDate());
    }, [])
    useEffect(() => {
        props.setDate(`${current_year}-${current_month}-${current_day}`);
    },[current_year, current_month, current_day])

    const monthHandler = (diff) => {

        const total = current_month + diff;
        if(total == 0){
            setYear(current_year - 1)
            setMonth(12)
        }else if (total == 13){
            setYear(current_year + 1)
            setMonth(1)
        }else{
            setMonth(current_month+diff);
        }
    }

    const checkLeapYear = (year) => {
        if(year % 400 === 0) return true;
        else if (year % 100 === 0) return false;
        else if (year % 4 === 0) return true;
        else return false;
    }

    const getFirstDayOfWeek = (year, month) => {
        if(month < 10) month = '0' + month;
        return (new Date(year+'-'+month+'-01')).getDay();
    }

    const changeYearMonth = (year, month) => {
        let month_day = [31,28,31,30,31,30,31,31,30,31,30,31];
        let first_day_of_week = getFirstDayOfWeek(year, month); //일요일 0, 월요일 1
        let arr_calendar = [];
        let new_calendar = [];

        if(month === 2 && checkLeapYear(year)) month_day[1] = 29;

        for (let i = 0; i<first_day_of_week; i++) arr_calendar.push("");
        for(let i = 1; i<=month_day[month - 1]; i++) arr_calendar.push(String(i))
        
        const remain_day = 7 - (arr_calendar.length % 7);
        if(remain_day < 7){
            for(let i = 0; i<remain_day; i++) arr_calendar.push("");}
        for(let i = 0; i < (arr_calendar.length / 7); i++){
            new_calendar.push(arr_calendar.slice(i*7, i*7+7));
        }
        return new_calendar;
    }  
    
    
    let tbody_Day = changeYearMonth(current_year,current_month)
    return(
        
            <table  className="datepicker_table">
                <thead>
                    <tr>
                        <th onClick={() => monthHandler(-1)} className="control">&#60;</th>
                        <th colSpan="5">
                            <span id="calYear">{current_year}</span>년
                            <span id="calMonth"> {current_month}</span>월
                        </th>
                        <th onClick={() => monthHandler(1)} className="control">&#62;</th>
                    </tr>
                    <tr>
                        {
                            thead_Day.map((day, i)=>{return (<th key={i}>{day}</th>)})
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tbody_Day.map((week_arr,j) => {
                            return (<tr key={j}>
                                {week_arr.map((day, i) => {
                                    let className = null;
                                    if (day !== '') {
                                        if (today_year === current_year && today_month === current_month && today_day === Number(day)) className = 'today';
                                        else if (current_day === Number(day)) className = 'selectToday';
                                        else  className = 'tbody_Day_td';
                                    }else className = null;
                                    return (<td key={i} onClick = {() => {setDay(Number(day))}} className = {className}> 
                                        {day}
                                    </td>)
                                })}

                            </tr>)
                        })
                    }
                    {/* {
                        tbody_Day.map((week_arr,j) => {
                            return (<tr key={j}>
                                {week_arr.map((day,i) => {return (<td key={i} 
                                onClick = {() => {setDay(Number(day))}}
                                className={day !== '' ? 
                                today_year === current_year && today_month === current_month && today_day === Number(day) ? 
                                'today' : current_day === Number(day) ? 
                                'selectToday': 'tbody_Day_td':null}            
                                >{day}</td>)})}
                            </tr>)
                        })
                    }                */}
                </tbody>
            </table>
    )
}