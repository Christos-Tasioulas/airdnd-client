import React from "react";
import { Link } from 'react-router-dom';
import './Card.css';

export default function Card(props) {

    const url = `/placeinfo/${props.id}`

    return (
        <Link to={url} style={{textDecoration: "none", color: "black"}}>
            <div className="card" >
                <img 
                    src={props.photos[0]} alt="place" className="card--image" 
                />
                <div className="card-first-row">
                    <span className="card-header">{props.city}, {props.country}</span>
                    <div className="card--stats">
                        <img src="https://www.freepnglogos.com/uploads/red-star-png/red-star-star-red-clip-art-clkerm-vector-clip-art-online-7.png" alt="star" className="card--star" />
                        <span>{props.reviewAvg} • ({props.reviewCount})</span>
                    </div>
                </div>
                <br />
                <b style={{fontSize: "medium"}}>{props.spaceType}</b>
                <b style={{fontSize: "small"}}>From ${props.dailyPrice}/day</b>
                <span>{props.bedroomsNumber} bedroom{props.bedroomsNumber > 1 && "s"}</span>
            </div>
        </Link>
    )
}