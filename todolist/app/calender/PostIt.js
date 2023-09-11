'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import dynamic from "next/dynamic";
import axios from 'axios';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });



export default function PostIt(props) {
    const [show, setShow] = useState(false);
    const [html, setHtml] = useState('');
    const [updateFlg, setUpdateFlg] = useState(false);
    const isInsert = useRef(false);
    const postitID = useRef('');
    useEffect(() => {
        setHtml('');
        positSelectSubmit();
    }, [props.date])
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                ],
            },
        };
    }, []);

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'align',
        'image',
    ];

    const positSelectSubmit = () => {
        const url = '/api/postit/select'
        const data ={
            date : props.date
        }

        axios.post(url, data)
            .then((response) => {
                if (response.data.length === 0){ isInsert.current = true;}
                else{
                    setHtml(response.data[0].content);
                    isInsert.current = false;
                    postitID.current = response.data[0].postitID;
                }
            })
    }
    const submitHandler = () =>{
        if (isInsert.current) positWriteSubmit();
        else positUpdateSubmit();
    }
    const positUpdateSubmit = () => {
        const url = '/api/postit/update'
        const data ={
            content : html,
            date : props.date,
            postitID : postitID.current
        }

        axios.post(url, data)
            .then((response) => {
                if(!response.data) alert("실패")
                setUpdateFlg(false)
                setShow(false);
            })
    }
    const positWriteSubmit = () => {
        const url = '/api/postit/write'
        const data ={
            content : html,
            date : props.date
        }

        axios.post(url, data)
            .then((response) => {
                if(!response.data) alert("실패")
                setUpdateFlg(false)
                setShow(false);
            })
    }

    return (
        <div className="PostIt" >
            <div onClick={() => { setShow(true);}} style={{width:'100%', height:'100%'}}>
                <div className="PostIt_title"></div>
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>

            <Modal
                show={show}
                onHide={() => {setShow(false); setUpdateFlg(false)}}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                
            >
                <Modal.Header className='modalTitle' closeButton>
                    <Modal.Title  id="example-custom-modal-styling-title">
                        {
                            !updateFlg ? <Button variant="dark" onClick={() => setUpdateFlg(true)}>글수정</Button>
                            : <Button variant="dark" onClick={submitHandler}>글저장</Button>
                        }

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody' style={{height:'500px'}}>
                    { !updateFlg ? 
                    <div dangerouslySetInnerHTML={{ __html: html }}>           
                    </div> :
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        onChange={setHtml}
                        value={html}
                        placeholder={'내용을 입력해주세요 '}
                        theme="snow"
                    />
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}
