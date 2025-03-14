"use client";

import React from "react";

const Bio = ({ designation, profile }) => {
	return (
		<div className="lg:col-span-2">
			<div className="details-content space-y-[10px]">
				<h5>Designation: {designation ? designation : "N/A"}</h5>
				<h5>Bio:</h5>

				<p>{profile && profile.bio ? profile.bio : "N/A"}</p>
			</div>
		</div>
	);
};

export default Bio;
