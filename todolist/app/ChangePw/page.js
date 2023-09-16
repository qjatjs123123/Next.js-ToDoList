'use client'

import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios from 'axios';



function ChangePw(props) {
    return < CorrectForm />
}



function CorrectForm (props){
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState(false);
    const [pwCheckCheck, setPwCheckCheck] = useState(false);
    const [pwResult, setPwResult] = useState('');
    const [pwcurrent, setpwcurrent] = useState('');
    const [pwCheckResult, setPwCheckResult] = useState('');
    const [userID, setuserID] = useState('');
    let navigate = useRouter();

    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;
        const userID = urlParams.get('userID');

        setuserID(userID);

    }, [props.userID]);

    const passwordCheck = (e) => {

        setPw(e.target.value);
        if (e.target.value === '') return;
        let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
        if (!reg.test(e.target.value)) {
            setPwResult('비밀번호 규칙 위반입니다.');
            setPwCheck(false);
        }
        else {
            setPwResult('사용가능한 비밀번호입니다.');
            setPwCheck(true);
        }
    }

    const samePassword = (e) => {
        if (e.target.value === '') return;
        if (e.target.value === pw) {
            setPwCheckResult('비밀번호 일치합니다.');
            setPwCheckCheck(true);
        } else {
            setPwCheckResult('비밀번호 불일치합니다.');
            setPwCheckCheck(false);
        }
    }

    const changePw = () => {
        console.log(userID, pwcurrent, pw);
        const url = 'http://localhost:3001/changePw';
        const data = {
            userPw: pw,
            userID: userID,
            pwcurrent:pwcurrent
        };

        return axios.post(url, data);
    }

    const ChnagePwSubmit = (e) => {
        e.preventDefault();
        if (pwCheck && pwCheckCheck) {
            changePw()
                .then((response) => {
                    if (!response.data)
                        alert("비밀번호변경 실패");
                    else {
                        alert("비밀번호변경 성공");
                        navigate.push('/');
                    }
                })
        }
        else {
            alert("제대로 입력하세요");
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Card style={{ width: '30rem', background: 'ivory' }}>
                    <Card.Body>
                        <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px' }}>비밀번호변경</Card.Title><br />
                        <div>
                            <Form >
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control onChange={(e) => {setuserID(e.target.value)}}  name='id' type="text" placeholder="id" style={{ width: '450px', border: '2px solid black' }} />
                                    <div style={{ height: '10px'}}></div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>현재 비밀번호</Form.Label>
                                    <Form.Control onChange={(e) => {setpwcurrent(e.target.value)}} name='pw' type="password" placeholder="Password" style={{ width: '450px', border: '2px solid black' }} />
                                    <div style={{ height: '10px', fontSize: '13px'}}></div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>새 비밀번호</Form.Label>
                                    <Form.Control onBlur={passwordCheck} name='pw' type="password" placeholder="Password" style={{ width: '450px', border: '2px solid black' }} />
                                    <div style={{ height: '10px', fontSize: '13px', color: pwResult === '비밀번호 규칙 위반입니다.' ? 'red' : 'green' }}>{pwResult}</div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>새 비밀번호확인</Form.Label>
                                    <Form.Control onBlur={samePassword} name='pwcheck' type="password" placeholder="Password" style={{ width: '450px', border: '2px solid black' }} />
                                    <div style={{ height: '10px', fontSize: '13px', color: pwCheckResult === '비밀번호 불일치합니다.' ? 'red' : 'green' }}>{pwCheckResult}</div>

                                </Form.Group>
                                <Button onClick={ChnagePwSubmit} type="submit" style={{ width: '450px', marginTop: '30px', height: '45px' }}>비밀번호변경</Button>
                            </Form>
                        </div>

                    </Card.Body>
                </Card>
            </div>
    )
}


export default ChangePw;