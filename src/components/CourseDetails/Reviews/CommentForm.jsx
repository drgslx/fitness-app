"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import TextArea from "@/components/FormHelpers/TextArea";

const options = [
	{ value: "1", label: "Terrible" },
	{ value: "2", label: "Poor" },
	{ value: "3", label: "Average" },
	{ value: "4", label: "Good" },
	{ value: "5", label: "Excellent" },
];

const CommentForm = ({ courseId, currentUser }) => {
	const router = useRouter();
	const { lang } = useParams();

	const {
		register,
		handleSubmit,
		setError,
		control,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm({
		defaultValues: {
			rating: null,
			comment: "",
		},
	});

	const onSubmit = async (data) => {
		if (!currentUser) {
			router.push(`/${lang}/login`);
			return;
		}
		axios
			.post(`/api/course/${courseId}/review`, data)
			.then((response) => {
				toast.success("Rating success!");

				router.refresh();
				reset();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			});
	};
	return (
		<>
			<div>
				<h3 className="text-[#000000] font-bold text-[20px] md:text-[22px] lg:text-[25px] leading-none mb-[15px]">
					Leave a reply
				</h3>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-[25px]"
				>
					<div>
						<Controller
							name="rating"
							control={control}
							rules={{ required: "Please select an option" }}
							render={({ field, fieldState }) => (
								<Select
									id="react-select-3-live-region"
									{...field}
									options={options}
									placeholder="Select Rating"
									isClearable
								/>
							)}
						/>
					</div>

					<div>
						<TextArea
							placeholder="Feedback...."
							id="comment"
							disabled={isSubmitting}
							register={register}
							errors={errors}
						/>
					</div>

					<div>
						<button
							type="submit"
							className="bg-#f13a11 text-[#fff] text-[16px] font-semibold block w-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
						>
							{currentUser ? "Give a review" : "Login to review"}{" "}
							<i className="ri-arrow-right-up-line"></i>
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default CommentForm;
