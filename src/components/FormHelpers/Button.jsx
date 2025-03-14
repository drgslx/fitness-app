"üse client";
import React from "react";

const Button = ({ label, classAtts, disabled }) => {
	return (
		<div>
			<button type="submit" className={classAtts} disabled={disabled}>
				{label} <i className="ri-arrow-right-up-line"></i>
			</button>
		</div>
	);
};

export default Button;
