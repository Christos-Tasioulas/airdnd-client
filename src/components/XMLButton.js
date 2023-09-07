import React from "react";
import xmljs from 'xml-js';

// Button component that exports lists of objects as xml files hashed by a foreign key
export default function XMLButton(props) {
    const exportToXml = (data) => {
        const xmlData = xmljs.js2xml(data, { compact: true, spaces: 2 });
        const xmlBlob = new Blob([xmlData], { type: "application/xml" });
        const url = URL.createObjectURL(xmlBlob);
        const a = document.createElement("a");
        a.href = url;
        // The name is comprised of The table name the id of the foreign key and the file type
        a.download = props.type + props.id + ".xml";
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return (
        <button className="App-XML-button" onClick={() => exportToXml(props.data)}>Export as XML</button>
    )
}