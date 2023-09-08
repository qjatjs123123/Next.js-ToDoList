'use client'

import { useMemo, useRef, useState } from 'react';
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
    const [title, setTitle] = useState('title입니다.')
    const [html, setHtml] = useState('data부분입니다.');
    const [updateFlg, setUpdateFlg] = useState(false);

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

    const positUpdateSubmit = () => {
        const url = '/api/postit/write'
        const data = {
            content: html
        }

        axios.post(url, data)
            .then((response) => {
                console.log("Qwe");
            })
    }

    return (
        <Modal
            show={props.show}
            onHide={() => { props.setShow(false); setUpdateFlg(false) }}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"

        >
            <Modal.Header className='DetailmodalTitle' closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {
                        !updateFlg ? title:
                        <Form.Control type="text" placeholder="제목 입력해주세요" style={{width:'200%'}} defaultValue={title}/>
                    }

                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='DetailmodalBody' >
                {!updateFlg ?
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: html }}></div>
                        <br/>
                        <Button variant="danger" style={{bottom:'10px',position:'absolute', right:"80px", marginRight:"10px"}}>글삭제</Button>{' '}
                        <Button variant="dark" onClick={() => setUpdateFlg(true)} style={{bottom:'10px',position:'absolute', right:"0", marginRight:"10px"}}>글수정</Button>
                        </div>   
                   :
                    <div>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        onChange={setHtml}
                        value={html}
                        placeholder={'내용을 입력해주세요 '}
                        theme="snow"
                    />
                    <br/>
                    <Button variant="danger" style={{bottom:'10px',position:'absolute', right:"80px", marginRight:"10px"}}>글삭제</Button>{' '}
                    <Button variant="dark" style={{bottom:'10px',position:'absolute', right:"0", marginRight:"10px"}}>글저장</Button>
                    </div>
                }
            </Modal.Body>
        </Modal>

    )
}
