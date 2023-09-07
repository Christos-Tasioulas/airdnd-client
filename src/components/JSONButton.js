import React from "react";

// Button component that exports lists of objects as json files hashed by a foreign key
export default function JSONButton(props) {
    const exportToJson = (data) => {
        const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const url = URL.createObjectURL(jsonBlob);
        const a = document.createElement("a");
        a.href = url;
        // The name is comprised of The table name the id of the foreign key and the file type
        a.download = props.type + props.id +  ".json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return(
        <button className='App-JSON-button' onClick={() => exportToJson(props.data)}>Export as JSON</button>
    )

}