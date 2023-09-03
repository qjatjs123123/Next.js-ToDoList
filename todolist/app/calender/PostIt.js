'use client'

import { useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import dynamic from "next/dynamic";
import axios from 'axios';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const data = `Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
commodi aspernatur enim, consectetur. Cumque deleniti temporibus
ipsam atque a dolores quisquam quisquam adipisci possimus
laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
deleniti rem!`

export default function PostIt(props) {
    const [show, setShow] = useState(false);
    const [html, setHtml] = useState(data);
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
        const data ={
            content : html
        }

        axios.post(url, data)
            .then((response) => {
                console.log("Qwe");
            })
    }

    return (
        <div className="PostIt">
            <div onClick={() => { setShow(true) }}>
                <div className="PostIt_title"></div>
                {data}
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
                            : <Button variant="dark" onClick={positUpdateSubmit}>글저장</Button>
                        }

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    { !updateFlg ? 
                    <p>
                        {html}
                    </p> :
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
