"use client";
import React from "react";

const StudentsRaw = ({
	id,
	name,
	email,
	is_active,
	image,
	profile,
	role,
	onAdmin = null,
}) => {
	return (
		<tr className="bg-white border-b">
			<td className="px-6 py-4">{name}</td>
			<td className="px-6 py-4">{email}</td>
			<td className="px-6 py-4">
				{profile && profile.phone ? profile.phone : "N/A"}
			</td>
			<td className="px-6 py-4">{is_active ? "Active" : "Disabled"}</td>

			<td className="px-6 py-4">
				<button
					type="button"
					className={`${
						role === "ADMIN"
							? "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					}`}
					onClick={() => onAdmin(id, role)}
				>
					{role == "ADMIN" ? "Remove from admin" : "Make An Admin"}
				</button>
			</td>
		</tr>
	);
};

export default StudentsRaw;
