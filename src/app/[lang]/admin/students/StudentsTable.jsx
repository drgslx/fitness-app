"use client";
import StudentsRaw from "@/components/Admin/StudentsRow";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const StudentsTable = ({ users }) => {
    const router = useRouter();

    const handleAdmin = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            const data = { admin: newRole };
            const response = await axios.post(`/api/admin/users/${userId}`, data);

            toast.success(response.data.message);
            router.refresh();
        } catch (err) {
            let {
                response: {
                    data: { message },
                },
            } = err;
            toast.error(message);
        }
    };

	const handleDelete = async(userId) => {
		try {
			const response = await axios.delete(
				`/api/admin/users/${userId}`
			);
			toast.success(response.data.message);
			router.refresh();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	};

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Make Admin
                        </th>
                        
                        <th scope="col" className="px-6 py-3">
                            Remove user
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <StudentsRaw
                                key={user.id}
                                {...user}
                                onAdmin={() => handleAdmin(user.id, user.role)}
								onDelete={() => handleDelete(user.id)}
                            />
                        ))
                    ) : (
                        <tr className="bg-white border-b">
                            <td colSpan="7" className="text-center py-3">
                                Empty!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsTable;
