import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import './ImageCarousel.css';
import { Carousel } from "react-responsive-carousel";

function ImageCarousel(props) {

    const images = props.images
    const isTheLandlord = props.isTheLandlord

    return (
        <Carousel className="carousel-container">
            {images.map((image, index) => (
                <div key={index} style={{ position: "relative" }}>
                    {/* This button only eixsts if the user is the landlord */}
                    {isTheLandlord && <button
                        className="remove-button"
                        onClick={(event) => props.onImageRemove(event, "photos", index)}
                    >
                        X
                    </button>}
                    <img src={image.url} alt={`House view ${index}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;