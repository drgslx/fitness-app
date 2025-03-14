"use client";

import React, { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";

const uploadPreset = process.env.NEXT_CLOUDINARY_PRESET;

const ZipUpload = ({ onChange, value, label = "Select Asset/File" }) => {
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
							<div className="text-center border-dashed border-2 border-indigo-600 cursor-pointer p-1">
								Click to upload
								<div className="form-text">{label}</div>
							</div>

							{value && (
								<div className="mt-[15px]">
									<Link href={value} target="_blank">
										View .zip file
									</Link>
								</div>
							)}
						</div>
					</>
				);
			}}
		</CldUploadWidget>
	);
};

export default ZipUpload;
