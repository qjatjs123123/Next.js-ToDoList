'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import dynamic from "next/dynamic";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const data = `Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
commodi aspernatur enim, consectetur. Cumque deleniti temporibus
ipsam atque a dolores quisquam quisquam adipisci possimus
laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
deleniti rem!`

export default function DetailTodoList(props) {
    const [title, setTitle] = useState(props.divContent.divTitle)
    const [html, setHtml] = useState(props.divContent.divContent);
    const start = useRef(props.divContent.start);
    const end = useRef(props.divContent.end);
    const [updateFlg, setUpdateFlg] = useState(false);
    const [divContent, setDivcontent] = useState(props.divContent);
    const day = useRef(props.divContent.Date)
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (props.show) setIsVisible(true);
        else setIsVisible(false);
    },[props.show])
    useEffect(() => {

        const current_year = new Date(props.divContent.Date).getFullYear();
        const current_month = new Date(props.divContent.Date).getMonth() + 1;
        const current_day = new Date(props.divContent.Date).getDate();
        day.current = `${current_year}년 ${current_month}월 ${current_day}일`
    }, [])
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
    const todolistdetailDeleteSubmit = () => {
        const url = '/api/todolistdetail/delete'
        const data = {
            divID: props.divContent.divID
        }

        axios.post(url, data)
            .then((response) => {
                if (response.data) {
                    props.setShow(false);
                    setUpdateFlg(false);
                    props.setisDeleted(true);

                } else {
                    alert("실패");
                }
            })
    }
    const todolistdetailUpdateSubmit = () => {
        const url = '/api/todolistdetail/update'
        const data = {
            divContent: html,
            divTitle: title,
            divID: props.divContent.divID
        }

        axios.post(url, data)
            .then((response) => {
                if (response.data) {
                    props.setShow(false);
                    setUpdateFlg(false);
                    let NewdivContent = JSON.parse(JSON.stringify(props.divContent));
                    NewdivContent.divContent = html;
                    NewdivContent.divTitle = title;
                    props.setDivcontent(NewdivContent);
                } else {
                    alert("실패");
                }

            })
    }
    const test = (e) =>{
        e.stopPropagation();
    }

    return (
        <div style={{width:'100%', height:'1000px', display : isVisible ? 'block' : 'none'}} onMouseDown={test}>
        
        <Modal
            show={props.show}
            onHide={(e) => { props.setShow(false); setUpdateFlg(false);  }}      
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header onMouseDown={test} className='DetailmodalTitle' closeButton >
                <Modal.Title id="example-custom-modal-styling-title" style={{ fontWeight: 'bold' }}>
                    {
                        !updateFlg ? title :
                            <Form.Control
                                type="text"
                                placeholder="제목 입력해주세요"
                                style={{ width: '200%' }}
                                defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                    }

                </Modal.Title>
            </Modal.Header>
            <Modal.Body onMouseDown={test} className='DetailmodalBody' style={{ fontSize: '14px', fontWeight: 'normal' }}>
                {!updateFlg ?
                    <div>
                        <div>
                            <span>{day.current} </span>
                            {start.current}~{end.current}
                        </div>
                        <hr />
                        <div dangerouslySetInnerHTML={{ __html: html }}></div>
                        <hr />
                        <br />
                        <Button onClick={todolistdetailDeleteSubmit} 
                                variant="danger" 
                                style={{ bottom: '10px', position: 'absolute', right: "80px", marginRight: "10px" }}>
                                글삭제
                        </Button>{' '}
                        <Button variant="dark" 
                                onClick={() => setUpdateFlg(true)} 
                                style={{ bottom: '10px', position: 'absolute', right: "0", marginRight: "10px" }}>
                                글수정
                        </Button>
                    </div>
                    :
                    <div>
                        <div>{day.current} {start.current}~{end.current}</div>
                        <hr />
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            onChange={setHtml}
                            value={html}
                            placeholder={'내용을 입력해주세요 '}
                            theme="snow"
                        />
                        <br /><br />
                        <Button
                            onClick={todolistdetailDeleteSubmit} 
                            variant="danger" 
                            style={{ bottom: '10px', position: 'absolute', right: "80px", marginRight: "10px" }}>
                            글삭제
                        </Button>{' '}
                        <Button 
                            onClick={todolistdetailUpdateSubmit}
                            variant="dark" style={{ bottom: '10px', position: 'absolute', right: "0", marginRight: "10px" }}>
                            글저장
                        </Button>
                    </div>
                }
            </Modal.Body>
        </Modal>
        </div>

    )
}
