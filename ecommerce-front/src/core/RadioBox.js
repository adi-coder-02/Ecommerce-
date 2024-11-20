import React, { useState } from "react";

const RadioBox = ({ prices, handleFilters }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        handleFilters(event.target.value);  // Passing the value to the parent
        setValue(event.target.value);  // Updating the local state
    };

    return prices.map((p) => (
        <div key={p._id}> {/* Using _id for the key */}
            <input
                onChange={handleChange}
                value={`${p._id}`}  // Ensure that the value is the string version of the id
                name="price"  // Setting a static name for the group of radio buttons
                type="radio"
                className="mr-2 ml-4"
                checked={value === `${p._id}`}  // Checking if the current radio is selected
            />
            <label className="form-check-label">{p.name}</label>
        </div>
    ));
};

export default RadioBox;
