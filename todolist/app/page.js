'use client'
import React, {useState, useEffect} from 'react';
import {Card, Form,Button } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "./globals.css";

function Main(props){
    const [ID, setID] = useState('');
    const [PW, setPW] = useState('');
    let i = 0;
    const [totalletter, setLetter] = useState("");
    const speed = 100;
    let navigate = useRouter();
    const letters = ["Schedule", "Goals", "Chores"];
    const StyledNavLink = styled(Link)`
        color: gray;
        margin-right: 15px;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
            color: black;
        }
    `

  useEffect(() => {
    // 초기 실행
    const timerId = setTimeout(typing, 1500);

    // useEffect에서 반환하는 함수는 cleanup 함수로서, 컴포넌트가 언마운트되거나 다시 렌더링될 때 호출됩니다.
    return () => clearTimeout(timerId);
  }, [])
        // 타이핑 효과
  const typing = async () => {  
    const letter = letters[i].split("");

    while (letter.length) {
      await wait(speed);
      setLetter((totalletter) => {
        // console.log(letter);
        // totalletter + letter.shift()
        if (letter.length === 0) return totalletter;
        const tmp = totalletter + letter.shift();
        return tmp;
      });
    }
    
    // 잠시 대기
    await wait(800);
    
    // 지우는 효과
    remove();
  }

  // 글자 지우는 효과
  const remove = async () => {
    const letter = letters[i].split("");
    
    while (letter.length) {
      await wait(speed);
      
      letter.pop();
      setLetter(letter.join(""));
    }
    
    // 다음 순서의 글자로 지정, 타이핑 함수 다시 실행
    i = !letters[i+1] ? 0 : i + 1;
    typing();
  }

  // 딜레이 기능 ( 마이크로초 )
  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }



    const loginSubmit = (e) =>{
        e.preventDefault();
        login()
            .then((response) => {
                console.log(response.data);
                if (response.data === false)
                    alert("로그인 실패");
                else{
                    navigate.push('/calender');
                    
                }
            })

    }

    const login = () => {
        const url = 'http://localhost:3001/login';
        const data = {
            userID: ID,
            userPassword: PW,
        };

        return axios.post(url, data, { withCredentials: true });
    }

    const handleValueChange = (e) => {

        if (e.target.name === 'ID') setID(e.target.value);
        else if(e.target.name ==='PW') setPW(e.target.value);
    }

    return (
      <>
      {/* <div className='headerContainer'>
        <div className='headerInner'>
          <h2>
            BS's
          </h2>
          <div className='iframeContainer'>
            <a href="https://github.com/qjatjs123123/Next.js-ToDoList">
              <i class="fa fa-github"></i>
            </a>
            <a href="https://velog.io/@qjatjs123123/series/Next.js">
              <i class="fa fa-vimeo"></i>
            </a>
          </div>
        </div>
      </div> */}
        <div className=''>
          <div className='MainContainer'>
            <div className='MainImgContainer'>
              <img src="/background-location.jpg" alt=''></img>
            </div>
            <div className='MainTxtContainer'>
              <div className='MainTxtInner'>
                <h3>To-Do-List</h3>
                <span></span>
                <div className='typing'>
                  Task
                  <h1 className="text">{totalletter}</h1>
                </div>

                <div className='MainGoButton' onClick={() => navigate.push('/calender')}>
                  Go Start
                </div>
              </div>
            </div>
          </div>
        </div>   
      </>
        // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        //         <Card style={{ width: '30rem', background:'lightgray'}}>
        //             <Card.Body>
        //                 <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}>게시판</Card.Title>
        //                 <div>
        //                     <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        //                         <Form.Group className="mb-3" controlId="formGroupEmail">
        //                             <Form.Label>아이디</Form.Label>
        //                             <Form.Control type="text" placeholder="ID" name='ID' onChange={handleValueChange} style={{width: '23rem'}}/>
        //                         </Form.Group>
        //                         <Form.Group className="mb-3" controlId="formGroupPassword">
        //                             <Form.Label>비밀번호</Form.Label>
        //                             <Form.Control type="password" placeholder="PW" name ='PW' onChange={handleValueChange} style={{width: '23rem'}}/> <br/>        
        //                         </Form.Group>
        //                         <Button type="submit" className="btn btn-primary" style={{ width: '6rem', marginBottom:'15px'}} onClick={loginSubmit}>로그인</Button>
        //                     </Form>
        //                 </div>
        //                 <div style={{display: 'flex', justifyContent: 'center'}}>
        //                     <StyledNavLink href={"/Join"}>회원가입</StyledNavLink>
        //                     <StyledNavLink href={"/FindId"}>아이디찾기</StyledNavLink>
        //                     <StyledNavLink href={"/FindPw"}>비밀번호찾기</StyledNavLink>
        //                     <StyledNavLink href={"/ChangePw"}>비밀번호변경</StyledNavLink>
        //                 </div>
        //             </Card.Body>
        //         </Card>
        //     </div>
    )
}


export default Main;