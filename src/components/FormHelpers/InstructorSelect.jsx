"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const InstructorSelect = ({ value, onChange }) => {
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get("/api/instructors");

                const modifiedData = response.data.map((instructor) => ({
                    value: instructor.id,
                    label: instructor.name,
                }));

                setInstructors(modifiedData);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchInstructors();
    }, []);

    const selectedOption = instructors.find(
        (instructor) => instructor.value === value
    );

    return (
        <Select
            placeholder="Select Instructor"
            required
            isClearable
            isSearchable
            options={instructors}
            value={selectedOption || null}
            onChange={(option) => onChange(option ? option.value : null)}
            formatOptionLabel={(option) => (
                <div className="flex flex-row items-center gap-3">
                    <div>{option.label}</div>
                </div>
            )}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                    ...theme.colors,
                    primary: "green",
                    primary25: "#ffe4e6",
                },
            })}
        />
    );
};

export default InstructorSelect;
