"use client";

import CourseAssets from "@/components/Instructor/CourseAssets";
import UploadAssetForm from "@/components/Instructor/UploadAssetForm";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Nav from "@/components/Instructor/Nav";

const Asset = ({ courseId, assets }) => {
	const router = useRouter();
	const confirmDelete = async (assetId) => {
		try {
			const url = `/api/course/${assetId}/asset`;
			const response = await axios.delete(url);
			toast.success(response.data.message);
			router.refresh();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
	return (
		<div className="py-[50px] md:py-[60px] lg:py-[140px]">
			<div className="container mx-auto lg:max-w-[1150px]">
				<Nav />
				<div>
					<UploadAssetForm courseId={courseId} />
				</div>
				<div className="bg-sky-500/100 h-[1px] w-100 my-2"></div>
				<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
					{assets.length > 0
						? assets.map((asset) => (
								<CourseAssets
									key={asset.id}
									{...asset}
									onDelete={() => confirmDelete(asset.id)}
								/>
						  ))
						: "Empty"}
				</div>
			</div>
		</div>
	);
};

export default Asset;
