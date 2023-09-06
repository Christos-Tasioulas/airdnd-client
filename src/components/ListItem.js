import React  from "react";

export default function ListItem(props) {
    
    // Component for every list item in Add Place and Edit Place forms
    return (
        <li className='App-edit-place-list-input-value'>
            <span>{props.item}</span>
            <div className='App-edit-place-list-input-remove'>
                <button onClick={props.onRemove}>Remove</button>
            </div>
        </li>
    )
    
}