"use client";

import React, { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";

const uploadPreset = process.env.NEXT_CLOUDINARY_PRESET;

const VideoUpload = ({ onChange, value, label }) => {
	const handleUpload = useCallback(
		(result) => {
			onChange(result.info);
			// console.log(result);
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
								<div className="form-text">
									The demo file size less than 10 MB
								</div>
							</div>
						</div>

						{value && value.secure_url.endsWith(".mp4") && (
							<div className="mt-[15px]">
								<video width="400" controls>
									<source
										src={value.secure_url}
										type="video/mp4"
									/>
									Your browser does not support HTML video.
								</video>
							</div>
						)}
					</>
				);
			}}
		</CldUploadWidget>
	);
};

export default VideoUpload;
