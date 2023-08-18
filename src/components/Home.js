import React, {useState, useEffect} from 'react';
import AdminHome from './AdminHome';
import "react-datepicker/dist/react-datepicker.css";
import './Home.css';
import TextInput from './TextInput';
import DatePicker from "react-datepicker";

export default function Home(props) {

    const [isAdmin, setIsAdmin] = useState(false) 
    const [isLandlord, setIsLandlord] = useState(false)
    const [isTenant, setIsTenant] = useState(false)
    const [isAnonymous, setIsAnonymous] = useState(true)

    useEffect(() => {

        if(!props.token) {
            return
        }

        // Validating and decoding the JSON Web Token
        fetch("http://localhost:5000/user/validateToken", {
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

            // Token validation succeeded, now decode the token to check if the user is an admin
            return fetch("http://localhost:5000/user/decodeToken", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
            })
            .then(decodeResponse => {
            if (!decodeResponse.ok) {
                throw new Error("Token decoding failed");
            }
            return decodeResponse.json();
            })
            .then(decodeData => {
                // Passing the information for the role of the user
                setIsAdmin(decodeData.isAdmin);
                setIsLandlord(decodeData.isLandlord);
                setIsTenant(decodeData.isTenant);
                setIsAnonymous(false)
            })
            .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
            });

        })
        .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
        });

    }, [props.token]) 

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const [formData, setFormData] = useState({
        neighborhood: "",
        city: "",
        country: "",
        checkInDate: currentDate,
        checkOutDate: currentDate,
        numPeople: "",
    })

    // Only the home page for the admin is ready now
    const locationInputs = [
        { id:1, type: "text", placeholder: "Country", className: "App-home-form-location-input", name: "country", value: formData.country},
        { id:2, type: "text", placeholder: "City", className: "App-home-form-location-input", name: "city", value: formData.city},
        { id:3, type: "text", placeholder: "Neighborhood", className: "App-home-form-location-input", name: "neighborhood", value: formData.neighborhood}
    ]

    const dateInputs = [
        { id: 4, placeholder: "Check In", name: "checkInDate", className: "App-home-form-date-input", selected: formData.checkInDate, minDate: new Date()},
        { id: 5, placeholder: "Check Out", name: "checkOutDate", className: "App-home-form-date-input", selected: formData.checkOutDate, minDate: formData.checkInDate },
      ];

    const textInputs = [
        { id:6, type: "text", placeholder: "Number Of Guests", className: "App-home-form-text-input", name: "numPeople", value: formData.numPeople},
    ]

    const locationElements = locationInputs.map(locationInput => (
        <TextInput
            key={locationInput.id}
            type={locationInput.type}
            placeholder={locationInput.placeholder}
            className={locationInput.className}
            name={locationInput.name}
            value={locationInput.value}
            onChange={(event) => handleChange(event)}
        />
    ));
    
    const MyContainer = ({ className, children }) => {
        return (
          <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
            <div className={className}>
              <div style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        );
    };

    const dateElements = dateInputs.map((dateInput) => (
        <DatePicker
            key={dateInput.id}
            placeholderText={dateInput.placeholder}
            className={dateInput.className}
            selected={dateInput.selected}
            name={dateInput.name}
            dateFormat="dd/MM/yyyy"
            minDate={dateInput.minDate}
            calendarContainer={MyContainer}
            onChange={(date) => handleDateChange(dateInput.name, date)} // Use a separate handler for date changes
        />
    ));

    // Handler for date changes
    function handleDateChange(name, date) {
        setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: date, // Update the selected date
        }));
    }
        
    const textElements = textInputs.map(textInput => (
        <TextInput 
            key={textInput.id}
            type={textInput.type}
            placeholder={textInput.placeholder}
            className={textInput.className}
            name={textInput.name}
            value={textInput.value}
            onChange={(event) => handleChange(event)}
        />
    ));    

    // This is where we change the formData members accordingly
    function handleChange(event) {
        const {name, value, type, selected} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "date" ? selected : value
        }))
    }

    function handleSubmit(event) {
        // // We don't want to be redirected to the home page
        // event.preventDefault()

        // if (formData.city !== "" && formData.city !== user.city) {
        //     setHasMadeChanges(true)  // na to orisoume an xreiazetai
        //     setUser(prevUser => ({   // na orisoume ton user-fromSubmission
        //         ...prevUser,
        //         city: formData.city,
        //     }))
        // }

        // if (formData.country !== "" && formData.country !== user.country) {
        //     setHasMadeChanges(true)
        //     setUser(prevUser => ({
        //         ...prevUser,
        //         country: formData.country,
        //     }))
        // }

        // if (formData.neighborhood !== "" && formData.neighborhood !== user.neighborhood) {
        //     setHasMadeChanges(true)
        //     setUser(prevUser => ({
        //         ...prevUser,
        //         neighborhood: formData.neighborhood,
        //     }))
        // }

        // if (formData.checkInDate !== "" && formData.checkInDate !== user.checkInDate) {
        //     setHasMadeChanges(true)
        //     setUser(prevUser => ({
        //         ...prevUser,
        //         checkInDate: formData.checkInDate,
        //     }))
        // }

        // if (formData.checkOutDate !== "" && formData.checkOutDate !== user.checkOutDate) {
        //     setHasMadeChanges(true)
        //     setUser(prevUser => ({
        //         ...prevUser,
        //         checkOutDate: formData.checkOutDate,
        //     }))
        // }

        // if (formData.numPeople !== "" && formData.numPeople !== user.numPeople) {
        //     setHasMadeChanges(true)
        //     setUser(prevUser => ({
        //         ...prevUser,
        //         numPeople: formData.numPeople,
        //     }))
        // }


    }
    
    return(
        <main className='App-home'>
            {isAdmin && <AdminHome token={props.token}/>}
            {!isAdmin && (isTenant || isAnonymous) && <form onSubmit={this.handleSubmit} className='App-home-form'>
                <div className='App-home-form-details'>
                    <div className='App-home-form-location'>
                        <h3>Location</h3>
                        <div className='App-home-form-location-inputs'>
                            {locationElements}
                        </div> 
                    </div>
                    <div className='App-home-form-date'>
                        <h3>Check In/Out Dates</h3>
                        <div className='App-home-form-date-inputs'>
                            {dateElements}
                        </div>
                    </div>
                    <div className='App-home-form-other'>
                        <div className='App-home-form-text'>
                            <h3>Number Of Guests</h3>
                            <div className='App-home-form-text-inputs'>
                                {textElements}
                            </div>
                            <button type="submit">Submit</button>
                        </div>
                        <div className='App-home-form-submit'></div>
                    </div>           
                </div>
            </form>}
        </main>
    )
}