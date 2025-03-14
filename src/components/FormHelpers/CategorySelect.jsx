"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const CategorySelect = ({ value, onChange }) => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await axios.get("/api/categories");

			const modifiedData = response.data.map((category) => ({
				value: category.id,
				label: category.name,
			}));

			setCategories(modifiedData);
		};

		fetchCategories();
	}, []);

	// Convert value into the format react-select expects
	const selectedOptions = value ? categories.filter(option => value.includes(option.value)) : [];

	return (
		<Select
			placeholder="Select Categories"
			isMulti
			isClearable
			isSearchable={true}
			options={categories}
			value={selectedOptions}
			onChange={(selected) => onChange(selected ? selected.map(option => option.value) : [])}
			formatOptionLabel={(option) => (
				<div className="flex text-black flex-row items-center gap-3">
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

export default CategorySelect;
