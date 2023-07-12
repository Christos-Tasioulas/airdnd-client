import React from "react";

export default function SignupTextInput(props) {
    return(
        <input 
            type={props.type} 
            placeholder={props.placeholder}
            className="App-signup-form-input"
            name={props.name}
            onChange={props.onChange}
            value={props.value}
        />
    )
}