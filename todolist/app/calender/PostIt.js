'use client'

import { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
export default function PostIt(props) {

    const [show, setShow] = useState(false);
    return (
        <div className="PostIt">
            <div onClick={() => { setShow(true) }}>
                <div className="PostIt_title"></div>
                dfsafasd <br />
                dsafqwe <br />
                qwe <br />
                qweqwefdasf <br />
                asdf <br />
                sadf <br />
                dfsafasd <br />
                dsafqwe <br />
                qwe <br />
                qweqwefdasf <br />
                asdf <br />
                sadf <br />
                dfsafasd <br />
                dsafqwe <br />
                qwe <br />
                qweqwefdasf <br />
                asdf <br />
                sadf <br />
                dfsafasd <br />
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Custom Modal Styling
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
                        commodi aspernatur enim, consectetur. Cumque deleniti temporibus
                        ipsam atque a dolores quisquam quisquam adipisci possimus
                        laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
                        accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
                        reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
                        deleniti rem!
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    )
}
