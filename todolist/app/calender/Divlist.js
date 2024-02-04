'use client'
import axios from "axios";
import React, { forwardRef, useEffect, useRef, useState ,useImperativeHandle} from "react";
import DetailTodoList from "./DetailTodoList";
let isSizedrag = false;
let isdrag = false;
let pointerMoveEventListener = null; // 변수 추가
let ismove = false;

const Divlist = forwardRef((props,ref) => {
    useImperativeHandle(ref, () => ({
        // 부모 컴포넌트에서 사용할 함수를 선언
        willBeUsedInParentComponent
      }))
    const [show, setShow] = useState(false);
    const [isDeleted, setisDeleted] = useState(false);
    const [flg, setFlg] = useState(true);
    const index = props.index;
    const startX = useRef(0);
    const startY = useRef(0);
    const currentIndex = useRef(0);
    const startSizeY  = useRef(0);
    const currentHeight = useRef(0);
    const scrollTop = useRef(0);
    const currentscrollTop = useRef(0);
    const currentleft = useRef(0);
    const currenttop = useRef(0);
    const [divContent, setDivcontent] = useState("");
    let divlist = '';

    useEffect(() => {
        setDivcontent(props.div);

    }, [props.div])
    const dragdivstart = (e) => {
        isdrag = true;
        currentIndex.current = index;
        startX.current = e.clientX
        startY.current = e.clientY
        if (e.target.tagName === 'SPAN'){
            currentleft.current = parseInt(e.target.parentElement.style.left);
            currenttop.current = parseInt(e.target.parentElement.style.top);
        }else{
            currentleft.current = parseInt(e.target.style.left);
            currenttop.current = parseInt(e.target.style.top);
        }
        eventstart(e);
        e.preventDefault();
        e.stopPropagation();
        
    }  

    const pointermoveHandler = (event) => {
        const events = event.getCoalescedEvents();
        for (let event of events) {
            eventHandler(event);
        }
    }
    
    const eventHandler = (e) => {
        
        if (isSizedrag) resize(e);
        if (isdrag) dragdivmove(e);
    }
    const dragdivmove = (e) =>{
        const index = currentIndex.current;
        let cnt = Math.round(parseInt(currenttop.current - startY.current+ e.clientY)/25);
        
        let _left = 0;
        let top = 0
        if (cnt < 2 ) top = 50;
        else top = cnt*25;
        if((currentleft.current - startX.current+ e.clientX) <15) _left = 15;
        else _left = currentleft.current - startX.current+ e.clientX
        ismove = true;
        let endcnt = Math.round((cnt*25 + parseInt(divContent.height)) /25);
        let NewdivContent = JSON.parse(JSON.stringify(divContent));
        NewdivContent._left = _left;
        NewdivContent.top = top;
        NewdivContent.start = getTime(cnt);
        NewdivContent.end = getTime(endcnt);

        setDivcontent(NewdivContent);
    }
    const resize = (e) => {
        ismove = true;
        
        const index = currentIndex.current;
        const height = parseInt(currentHeight.current) - startSizeY.current + e.clientY
        if ( height <= 50 || parseInt(divContent.top)  + height > 1650 || parseInt(height) % 25 !== 0) return
        let cnt = Math.round( (parseInt(divContent.top) + height) / 25 );
        let NewdivContent = JSON.parse(JSON.stringify(divContent));

        NewdivContent.end = getTime(cnt);
        NewdivContent.height = height;
        setDivcontent(NewdivContent);
    }

    const getTime = (top) => {
        let hour = parseInt((top + 2) / 4) + 7;
        const minute = (top + 2) % 4; 
        let tmp = '';
        if ( hour < 12) tmp +="오전 ";
        else tmp += "오후 ";

        if ( hour <= 12) tmp += hour
        else tmp += hour - 12;
        
        if (minute == 0) tmp+="시";
        else tmp += ":" + 15*minute;
        return tmp;
        
    }
    const resizestart = (e) => {
        eventstart(e);
        //setIsSizedrag(true);
        isSizedrag = true
        currentIndex.current = index;
        startSizeY.current = e.clientY;
        currentHeight.current = divContent.height;
        e.stopPropagation();
        e.preventDefault();
    }  

    const eventstart = (e) => {
        if (pointerMoveEventListener === null){
            pointerMoveEventListener = pointermoveHandler;
            document.getElementsByClassName('todolist')[0].addEventListener('pointermove', pointermoveHandler);
        }
        
    }

    const handleDivsClick = (e) => {
        if(ismove){ 
            ismove = false;
            return;
        }
        setShow(true);
        ismove = false;   
        e.stopPropagation();
    }

    const todolistUpdateSubmit = () => {
        const url = '/api/todolist/update'
        const data = divContent;

        getLocalStorage(data);
        return;
        axios.post(url, data)
            .then((response) => {

            })
    }

    const getLocalStorage = (data) => {        
        const arr = JSON.parse(localStorage.getItem(data.Date));
        if (arr === null) return;
        arr[0] = arr[0].map(item => {
            if (item.divID === data.divID) return data;
            else return item;
        });

        localStorage.setItem(data.Date, JSON.stringify(arr));


    }

    const willBeUsedInParentComponent = () =>{
        if (!isdrag && !isSizedrag) return;
        todolistUpdateSubmit();
        isdrag = false;
        isSizedrag=false;
        document.getElementsByClassName('todolist')[0].removeEventListener('pointermove', pointerMoveEventListener);
        pointerMoveEventListener=null;
        
     }

    return (
        isDeleted ? <div></div> :
        <div>
            <DetailTodoList 
                setDivcontent={setDivcontent} 
                setShow={setShow} 
                show={show} 
                divContent={divContent}
                setisDeleted = {setisDeleted}
                />
            <div
                key={props.index}
                onMouseDown={(e) => { dragdivstart(e, index) }}
                onClick={handleDivsClick}
                className="divlistitem"            
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    left: divContent._left,
                    top: divContent.top,
                    width: divContent.width,
                    height: divContent.height,
                    backgroundColor: 'rgb(121, 134, 203)',
                    borderRadius: '10px',
                    border: '1px solid white',
                    color: 'white',
                    display: 'flex',
                    flexDirection: "column",
                    pointerEvents: props.index === -1 ? 'none' : null

                }}
            >
                <span style={{ marginLeft: '5px', fontSize: '13px', fontWeight: 'bold' }}>{divContent.divTitle}</span>
                <span style={{ marginLeft: '5px', fontSize: '13px', fontWeight: 'bold' }}>{divContent.start}~{divContent.end}</span>
                <div style={{
                    className: "b",
                    cursor: 's-resize',
                    position: 'absolute',
                    bottom: '0',
                    width: '100%',
                    marginBottom: '1px',
                    height: '10px',
                    backgroundColor: 'rgb(121, 134, 203)',
                    borderRadius: '50px'
                }}
                    onMouseDown={(e) => resizestart(e, index)}></div>
            </div>
        </div>
    )
})

export default React.memo(Divlist);