"use client";

import Select from "react-select";

const access_values = [
	{ value: "Lifetime", label: "Lifetime" },
	{ value: "Three_Months", label: "Three Months" },
	{ value: "Six_Months", label: "Six Months" },
	{ value: "One_Year", label: "One Year" },
];

const AccessTime = ({ value, onChange }) => {
	const selectedOption = access_values.find(
		(category) => category.value === value
	);

	return (
		<Select
			placeholder="Select"
			required
			isClearable
			isSearchable={true}
			options={access_values}
			value={selectedOption || value}
			onChange={(value) => onChange(value)}
			formatOptionLabel={(option) => (
				<div className="flex flex-row items-center gap-3">
					<div className="text-[#000000] text-[16px] md:text-[18px]">{option.label}</div>
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

export default AccessTime;
