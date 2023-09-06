import React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import './Review.css'

// Component that contains each review with username, text and rating
export default function Review(props) {
    
    
    return (
        <div className='App-review'>
            <div className="App-review-vitals">
                <div className="App-review-name-date">
                    <b>{props.username}</b>  •  <span>{props.date}</span>
                </div>
                <div className="App-review-rating">
                    <Box
                        sx={{
                            "& > legend": { mt: 2 },
                        }}
                        >
                        <Rating
                            name="simple-controlled"
                            value={props.rating} readOnly
                            size="small"
                        />
                    </Box>
                </div>
            </div>
            <div className="App-review-text">
                {props.reviewText}
            </div>
        </div>    
    )
}