'use client'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
export default function Timer(props) {
    const [audio] = useState(new Audio('/alarmsound.mp3'));
    const [isplay, setIsPlay] = useState(true);
    useEffect(() => {
        audio.loop = isplay;
        if(props.show) audio.play()
        else audio.pause();

    }, [props.show])
    const close = () => {
        audio.pause();
        props.setShow(false)
    }
    return (
        <div>
            <Modal show={props.show} onHide={() => props.setShow(false)} style={{marginTop:'200px'}}>
                <Modal.Header style={{backgroundColor:'#EF6262', color:'white'}} closeButton>
                    <Modal.Title style={{color:'white'}} >알람</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:'flex', justifyContent:"center", flexDirection:'column', alignItems:'center'}}>
                    <Image src="/5579.jpg" alt="z" width="80" height="80" className='vtimer'/>
                    <div style={{marginTop:'20px', fontSize:'20px'}}>
                        알람
                    </div>
                    <div style={{marginTop:'20px', fontSize:'20px'}}>
                        {props.TimeData}
                    </div>
                    <div style={{marginTop:'20px', fontSize:'30px',fontWeight:'bold'}}>
                        {props.TodoListData}
                    </div>
                    
                    
                </Modal.Body>
                <Modal.Footer style={{display:'flex', justifyContent:"center", flexDirection:'column', alignItems:'center'}}>
                    <Button onClick={close} style={{backgroundColor:'#EF6262', color:'white', borderColor:'#EF6262'}}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}