"use client";

import React, { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";

const uploadPreset = process.env.NEXT_CLOUDINARY_PRESET;

const ProfileImageUpload = ({
	onChange,
	value,
	label = "Profile Image 150x150",
}) => {
	const handleUpload = useCallback(
		(result) => {
			onChange(result.info.secure_url);
		},
		[onChange]
	);
	return (
		<CldUploadWidget
			onUpload={handleUpload}
			uploadPreset={uploadPreset}
			options={{ maxFiles: 1 }}
			showPoweredBy={false}
			cropping={true}
		>
			{({ open }) => {
				return (
					<>
						<div
							onClick={() => open?.apply()}
							className="img-thumbnail mb-3"
						>
							<div className="text-center border-dashed border-2 border-indigo-600 cursor-pointer p-8">
								Click to upload
								<div className="form-text">{label}</div>
							</div>

							{value && (
								<div className="mt-[15px]">
									<p className="text-[14px] mb-[10px]">
										Recommended image size 150x150!
									</p>
									<Image
										src={value}
										alt="profile"
										className="w-[100px]"
										width={150}
										height={150}
									/>
								</div>
							)}
						</div>
					</>
				);
			}}
		</CldUploadWidget>
	);
};

export default ProfileImageUpload;
