import React from "react";

export default function Assurance(props) {
    
    return (
        <form className={props.className}>
            <h1>{props.title}</h1>
            <br/>
            <div className='App-edit-place-destroy-buttons'>
                <div className='App-edit-place-buttons-delete'>
                    <button onClick={props.onYes}>
                        Yes
                    </button>
                </div>
                <div className='App-edit-place-buttons-save'>
                    <button onClick={props.onNo}>
                        No
                    </button>
                </div>
            </div>
        </form>
    )
}