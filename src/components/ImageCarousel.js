import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import './ImageCarousel.css';
import { Carousel } from "react-responsive-carousel";

function ImageCarousel(props) {

    const images = props.images

    return (
        <Carousel>
            {images.map((image, index) => (
                <div key={index}>
                    <img src={image.url} alt={`Image ${index}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;