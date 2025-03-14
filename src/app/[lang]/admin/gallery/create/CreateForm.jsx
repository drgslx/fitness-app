"use client";

import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";

const CreateForm = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		defaultValues: {
			title: "",
			image: "",
		},
	});

	const image = watch("image");

	const onSubmit = async (data) => {
		if (!data.image) {
			toast.error("Please drop image 750x500 before submitting.");
			return;
		}

		axios
			.post("/api/admin/gallery", data)
			.then((response) => {
				toast.success(response.data.message);
				router.push("/admin/gallery");
			})
			.catch((error) => {
				console.log(error);
				toast.error("Something went wrong!");
			});
	};

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
			<div>
				<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					Title
				</label>
				<Input
					placeholder="Title"
					id="title"
					disabled={isSubmitting}
					register={register}
					errors={errors}
				/>
			</div>

			<div>
				<div>
					<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
						Gallery Image
					</label>
					<UploadCourseImage
						onChange={(value) => setCustomValue("image", value)}
						value={image}
						label="Gallery Image 150x60"
					/>
				</div>
			</div>

			<div>
			<button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="
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
                        hover:bg-[#1151f2]
                        hover:border-[#000] 
                        hover:text-[#fff]
                    "
                >
                    {isSubmitting ? "Please wait..." : "Save"}
                </button>
			</div>
		</form>
	);
};

export default CreateForm;
