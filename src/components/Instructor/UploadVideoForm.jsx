"use client";

import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import VideoUpload from "@/components/FormHelpers/VideoUpload";
import Nav from "./Nav";
import UploadCourseImage from "../FormHelpers/UploadCourseImage";

const UploadVideoForm = ({ courseId }) => {
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
			group_name: "",
			title: "",
			thumb_Image: "",
			video: "",
			is_preview: "",
			short_id: "",
		},
	});

	const onSubmit = async (data) => {
		if (!data.video) {
			toast.error("Please upload video.");
			setIsLoading(false);
			return;
		}
		axios
			.post(`/api/course/${courseId}/video`, data)
			.then((response) => {
				toast.success(response.data.message);
				router.refresh();
				reset();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			});
	};

	const video = watch("video");
	const thumb_Image = watch("thumb_Image");

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	return (
		<div className="py-[50px] md:py-[60px] lg:py-[140px]">
			<div className="container mx-auto lg:max-w-[1150px]">
				<Nav />
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-[25px]"
				>
					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Group Title
							</label>
							<Input
								placeholder="Video Group Title"
								id="group_name"
								disabled={isSubmitting}
								register={register}
								errors={errors}
							/>
						</div>
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Video Title
							</label>
							<Input
								placeholder="Video Title"
								id="title"
								disabled={isSubmitting}
								register={register}
								errors={errors}
							/>
						</div>
					</div>

					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Video thumbnail
							</label>
							<UploadCourseImage
								onChange={(value) =>
									setCustomValue("thumb_Image", value)
								}
								value={thumb_Image}
								label="Video thumbnail"
							/>
						</div>
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Video
							</label>
							<VideoUpload
								onChange={(value) =>
									setCustomValue("video", value)
								}
								value={video}
								label="Video "
							/>
						</div>
					</div>
					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Video Serial Number
							</label>
							<Input
								type="number"
								placeholder="Video Serial Number"
								id="short_id"
								disabled={isSubmitting}
								register={register}
								errors={errors}
							/>
						</div>
						<div>
							<label
								for="flexCheck"
								className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]"
							>
								Is Preview?
							</label>
							<Controller
								name="is_preview"
								control={control}
								defaultValue={false} // Set the default value of your checkbox
								render={({ field }) => (
									<input
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										id="flexCheck"
										type="checkbox"
										{...field}
									/>
								)}
							/>
						</div>
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
			</div>
		</div>
	);
};

export default UploadVideoForm;
