'use client'
import React, {useState} from 'react';
import { Card,  Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
function BasicExample() {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

function FindPw(){
    const [id, setId] = useState('');
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState('');

    const valueChange = (e) => {
        if (e.target.name === 'id') setId(e.target.value);
        else if(e.target.name === 'first') setFirst(e.target.value);
        else if(e.target.name === 'second') setSecond(e.target.value);
        else if(e.target.name === 'email') setEmail(e.target.value);
    }

    const findPwSubmit = (e) => {
        e.preventDefault();
        emailSend().then((response) => {
            setResult(response.data);
        })
    }

    const emailSend = () => {
        setResult('start');
        const url = 'http://localhost:3001/sendEmail';
        const data = {
            userName: id,
            userNum: first + second,
            userEmail: email
        };

        return axios.post(url, data);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card style={{ width: '30rem', background:'ivory'}}>
                <Card.Body>
                    <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}>비밀번호찾기</Card.Title><br/>
                    <div>
                    <Form >
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control onChange={valueChange} name='id' type="text" placeholder="Enter name" style={{border: '2px solid black' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>주민등록번호</Form.Label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <Form.Control onChange={valueChange} name='first' type="text" placeholder="First" style={{ width: '237px', border: '2px solid black', marginRight: '10px' }} />
                                <div>-</div>
                                <Form.Control onChange={valueChange} name='second' type="password" placeholder="Second" style={{ width: '237px', border: '2px solid black', marginLeft: '10px' }} />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control onChange={valueChange} name='email' type="text" placeholder="Enter name" style={{border: '2px solid black' }} />
                        </Form.Group>
                        <div style={{ height: '30px', fontSize: '16px', color:'red', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{result === 'start' ? <BasicExample/> : result}</div>
                        <Button onClick={findPwSubmit} type="submit" style={{ width: '450px', marginTop: '30px', height: '45px' }}>아이디찾기</Button>
                    </Form>
                    </div>
                    
                </Card.Body>
            </Card>
        </div>
    )
}

export default FindPw;