import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import L from 'leaflet';  // Import Leaflet for custom icon

import '../App.css';

// Component that creates the map from OpenStreetMap (Buggy?)
export default  function Map(props)
{
    const customIcon = new L.Icon({
        iconUrl: 'https://i.pinimg.com/originals/0f/61/ba/0f61ba72e0e12ba59d30a50295964871.png',
        iconSize: [70, 70],  // Set the width and height of the icon
        iconAnchor: [16, 32],  // Adjust the anchor point if needed
    });

    return (
        <MapContainer center={props.position} zoom={13} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={props.position} icon={customIcon}>
            </Marker>
        </MapContainer>
    )
}