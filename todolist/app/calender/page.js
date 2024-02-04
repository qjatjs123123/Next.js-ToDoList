"use client"
import { useEffect, useRef, useState } from "react";
import Datepicker from "./Datepicker";
import PostIt from "./PostIt";
import TodoList from "./TodoList";
import axios from "axios";
import dynamic from "next/dynamic";
import "../globals.css";

const Button = dynamic(() => import("react-bootstrap/Button"), { ssr: false });
import { useRouter } from 'next/navigation';
export default function Calender() {
    const [date, setDate] = useState('');
    const [userID, setuserID] = useState("test")
    let navigate = useRouter();
    const loginCheck = () => {
        return new Promise((reject, resolve) => {
            const url = 'http://localhost:3001/getUser';
            axios({
                method: 'get',
                withCredentials: true,
                url: url
            }).then(res => {
                if (res.data == '') {
                   alert("다시 로그인 해주세요");
                   navigate.push('/');
                    return;
                } else {
                    setuserID(res.data.userID);
                }
            })
        })
    }
    const logout = () => {
        const url = 'http://localhost:3001/logout';
        axios({
            method: 'get',
            withCredentials: true,
            url: url
        }).then(res => {
            alert("로그아웃");
            navigate.push('/');
        })
    }
    useEffect(() => {
        if (date == '' || date == null || date == undefined) return;
    }, [date])
    return (
        <div className="calendarContainer">
            <div className="datepicker_container">
                <div style={{ width: '70%', display: 'flex', flexDirection: 'row', marginTop: '1rem' }}>
                    <p className="calender_font">Calender</p>
                </div>
                <Datepicker setDate={setDate} />
                <div style={{ width: '70%', display: 'flex', flexDirection: 'row', marginTop: '1rem' }}>
                    <p className="calender_font">Post It</p>
                </div>
                <PostIt userID={userID} date={date} />
            </div>
            <div className="todoList_container">
                <div style={{ width: '70%', display: 'flex', flexDirection: 'row', marginTop: '1rem' }}>
                    <p className="calender_font">TodoList</p>
                </div>
                <TodoList userID={userID} date={date} />
            </div>
            {/* <Button 
                onClick={logout}
                variant="danger" 
                style={{position:'absolute', right:'125px', top:'15px'}}>
                    로그아웃
            </Button>{' '} */}
        </div>
    )
}