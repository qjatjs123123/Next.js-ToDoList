'use client'

import Divlist from "./Divlist";
import dynamic from "next/dynamic";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios";
const { forwardRef, useImperativeHandle, useState, useRef, useEffect, useLayoutEffect, useMemo } = require("react")

const ClickForm = forwardRef((props, ref) => {
    const [title, setTitle] = useState('')
    const [html, setHtml] = useState('');
    const [show, setShow] = useState(false);
    const [divContent, setDivcontent] = useState('');
    const _left = useRef(0);
    const top = useRef(0);
    const titleForm = useRef(null);
    const textForm = useRef(null);
    useEffect(() => {
        if (show) {

            titleForm.current.focus();
            setTimeout(() => {
                titleForm.current.focus();
            }, 0);
        }
    }, [show]);
    useImperativeHandle(ref, () => ({
        // 부모 컴포넌트에서 사용할 함수를 선언
        willBeUsedInParentComponent
    }))
    const willBeUsedInParentComponent = (tmp) => {
        setShow(true);
        setDivcontent(tmp);
        _left.current = tmp._left;
        top.current = tmp.top;
    }
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

    const handleDivClick = (e) => {

        const url = '/api/todolist/insert'
        let newDiv = JSON.parse(JSON.stringify(divContent));
        newDiv.divTitle = title;
        newDiv.divContent = html;
        newDiv.userID = props.userID
        const data = newDiv
        if(title === ''){
            setTimeout(() => {
                titleForm.current.focus();
            }, 0);
            return;
        }
        if(html === ''){
            setTimeout(() => {
                textForm.current.focus();
            }, 0);
            return;
        }
        axios.post(url, data)
            .then((response) => {
                
                if (response.data){
                    newDiv.divID = response.data.insertId;
                    props.setDivs([...props.divs, newDiv]);
                }
                
                else alert("실패");
            })
        setTitle('');
        setHtml('');
        setShow(false);
    }
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
    return (
        show ?
            <div 
                onMouseDown={(e) => { e.stopPropagation(); setShow(false) }} 
                style={{ position: "absolute", width: '100%', height: '1660px', zIndex: '9999' }}>
                <Divlist
                    ref={null}
                    key={1}
                    div={divContent}
                    index={-1}
                    style={{ PointerEvent: 'none',zIndex:"9999",  position: "absolute"}}
                    
                />
                <div
                    onMouseDown={(e) => { e.stopPropagation(); }}
                    className="test_obj"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: "relative",
                        top: `${top.current}px`,
                        left: _left.current - 360 >= 0 ? `${_left.current - 360}px` : `${_left.current + 210}px`,
                        width: '350px',

                        borderRadius: "10px",
                        boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.5)',
                        backgroundColor: 'white',
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '30px',
                            backgroundColor: 'rgb(241,243,244)',
                            borderTopRightRadius: "10px",
                            borderTopLeftRadius: '10px',

                        }}

                    >
                        <div className="xbutton" onClick={() => setShow(false)}>&times;</div>
                    </div>
                    <Form.Control
                        tabIndex="0"
                        ref={titleForm}
                        type="text"
                        placeholder="제목 입력해주세요"
                        style={{ width: '90%', marginTop: '5px' }}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div style={{ height: '1px', width: '90%', marginTop: '10px', backgroundColor: 'lightgray' }}></div>
                    <div style={{ marginTop: '10px' }}>
                        <span>{divContent.Date} </span>
                        {divContent.start}~{divContent.end}
                    </div>
                    <ReactQuill
                        ref={textForm}
                        modules={modules}
                        formats={formats}
                        onChange={setHtml}
                        value={html}
                        placeholder={'내용을 입력해주세요 '}
                        theme="snow"
                        style={{ width: '90%',  marginTop: '10px' }}
                    />
                    <div style={{position:"relative",width:'90%', height:'50px'}}>
                        <Button 
                            onClick={handleDivClick}
                            variant="primary" style={{position:"absolute", right: "0", marginTop:"10px" }}>
                            저장
                        </Button>
                    </div>
                    <div style={{height:"5px"}}></div>
                </div>



            </div> : <div></div>
    )
})

export default ClickForm;