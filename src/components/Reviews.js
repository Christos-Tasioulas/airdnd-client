import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Reviews.css';
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Review from "./Review";

export default function Reviews(props) {

    const token = props.token;
    console.log(props.id)
    
    const [userId, setUserId] = useState(0)
    const [userUsername, setUserUsername] = useState("")
    const [formData, setFormData] = useState({
        listingId: props.reviewed === "place" ? parseInt(props.id) : null,
        landlordId: props.reviewed === "host" ? parseInt(props.id) : null,
        date: new Date(),
        reviewText: "",
    })

    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0.0)
    const [isTheReviewed, setIsTheReviewed] = useState(false)

    useEffect(() => {

        fetch("https://127.0.0.1:5000/user/decodeToken", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(decodeResponse => {
            if (!decodeResponse.ok) {
                throw new Error("Token decoding failed");
            }
            return decodeResponse.json();
        })
        .then(decodeData => {

            // Verification for all roles in order to make the component reusable

            setUserId(decodeData.id)

            if(props.reviewed === 'host') {
                console.log(decodeData.id)
                setIsTheReviewed(parseInt(decodeData.id) === parseInt(props.id))
            } 

            fetch(`https://127.0.0.1:5000/user/getUserById/${decodeData.id}`)
            .then((res) => res.json())
            .then((data) => setUserUsername(data.message.username))
            
        })
        .catch(error => {
            console.error(error);
        })

        if(props.reviewed === "place") {
            fetch(`https://127.0.0.1:5000/review/getReviewsByListingId/${props.id}`, {method: 'GET'})
            .then((res) => {
                if(!res.ok) {
                    throw new Error("Place reviews not found")
                }
                return res.json()
            })
            .then((data) => {
                setReviews(data.message)
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else if(props.reviewed === "host") {
            fetch(`https://127.0.0.1:5000/review/getReviewsByLandlordId/${props.id}`, {method: 'GET'})
            .then((res) => {
                if(!res.ok) {
                    throw new Error("Landlord reviews not found")
                }
                return res.json()
            })
            .then((data) => {
                setReviews(data.message)
            })
            .catch((error) => {
                console.log(error);
            })
        }

    }, [token])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        const formDataCopy = {...formData}

        formDataCopy.userId = userId
        formDataCopy.username = userUsername
        formDataCopy.rating = rating

        console.log(formDataCopy)

        fetch("https://127.0.0.1:5000/user/validateToken", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(validationData => {

            fetch("https://127.0.0.1:5000/review/addReview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataCopy),
            })

            if(props.reviewed === "place") {
                
                const requestOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({id: props.id}),
                }

                fetch("https://127.0.0.1:5000/listing/addReview", requestOptions)
            }
        })
        .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
        });
    }

    const reviewElements = reviews.map((review) => (
        <tr key={review.id}>
            <Review {...review}/>
        </tr>
    ))

    console.log(isTheReviewed)
    
    return (
        <div className='App-reviews-container'>
            {!isTheReviewed && <form className='App-review-form'>
                <h3>Rate this {props.reviewed}</h3>
                <div className='App-review-star-system'>
                    <Box
                        sx={{
                            "& > legend": { mt: 2 },
                        }}
                        >
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </Box>
                </div>
                <textarea
                    placeholder='Write Review'
                    className='App-review-textarea'
                    onChange={(event) => handleChange(event)}
                    name='reviewText'
                    value={formData.reviewText} 
                />
                <button className='App-review-button' onClick={(event) => handleSubmit(event)}>Submit</button>
            </form>}
            <div className='review-scroll-container'>
                <table className='review-scroll'>
                    <thead>
                        <tr className='Header-row'>
                            <h3>All Reviews</h3>
                        </tr>
                    </thead>
                    <tbody className='review-scroll-body'>
                        {reviewElements}
                    </tbody>  
                </table>
            </div>
        </div>
    )
}