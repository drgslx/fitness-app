"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Input from "../FormHelpers/Input";
import ZipUpload from "../FormHelpers/ZipUpload";

const UploadAssetForm = ({ courseId }) => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		control,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		defaultValues: {
			lecture_name: "",
			asset_zip: "",
		},
	});

	const onSubmit = async (data) => {
		if (!data.asset_zip) {
			toast.error("Please upload zip.");
			setIsLoading(false);
			return;
		}
		axios
			.post(`/api/course/${courseId}/asset`, data)
			.then((response) => {
				toast.success(response.data.message);
				router.refresh();
				reset();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			});
	};

	const asset_zip = watch("asset_zip");

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					Lecture
				</label>
				<Input
					placeholder="Lecture"
					id="lecture_name"
					disabled={isSubmitting}
					register={register}
					errors={errors}
				/>
			</div>
			<div>
				<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					.zip file upload
				</label>
				<ZipUpload
					onChange={(value) => setCustomValue("asset_zip", value)}
					value={asset_zip}
				/>
			</div>

			<div>
				<button
					type="submit"
					disabled={!isValid || isSubmitting}
					className="
                                    bg-[#1151f2] 
                                    text-[#fff] 
                                    text-[16px] 
                                    font-semibold 
                                    block 
                                    w-full 
                                    py-[15px] 
                                    sm:py-[17px] 
                                    px-[21px] 
                                    sm:px-[30px] 
                                    leading-none 
                                    border 
                                    border-[#1151f2] 
                                    transition 
                                    duration-500 
                                    ease-in-out 
                                    hover:bg-black 
                                    hover:border-[#000] 
                                    hover:text-[#fff]
                                "
				>
					{isSubmitting ? "Please wait..." : "Upload Video"}
				</button>
			</div>
		</form>
	);
};

export default UploadAssetForm;
