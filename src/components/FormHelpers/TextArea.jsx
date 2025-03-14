"use client";
import React from "react";

const TextArea = ({
	
	id,
	type = "text",
	placeholder,
	disabled,
	register,
	required,
	rows=10,

}) => {
	return (
		<>
			<textarea
				id={id}
				type={type}
				rows={rows}
				className="bg-[#fff] text-[#000] border border-[#1151f2] block w-full py-[10px] px-[25px] focus:outline-none placeholder-[#000]"
				placeholder={placeholder}
				{...register(id, { required })}
				disabled={disabled}
				required={false}
			/>
		</>
	);
};

export default TextArea;
