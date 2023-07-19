import React from "react";

export default function LoginTextInput(props) {

    return(
        <input 
            type={props.type} 
            placeholder={props.placeholder}
            className="App-login-form-input"
            name={props.name}
            onChange={props.onChange}
            value={props.value}
        />
    )
}