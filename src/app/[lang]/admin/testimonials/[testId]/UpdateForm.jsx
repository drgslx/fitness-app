"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";

const UpdateForm = ({ testimonial }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		defaultValues: {
			name: "",
			image: "",
			discipline: "",
			description: "",
		},
	});

	useEffect(() => {
		setValue("name", testimonial.name);
		setValue("image", testimonial.image);
		setValue("designation", testimonial.designation);
		setValue("description", testimonial.description);
	}, [testimonial]);

	const image = watch("image");

	const onSubmit = async (data) => {
		if (!data.image) {
			toast.error("Please drop image 300x300 before submitting.");
			return;
		}

		axios
			.post(`/api/admin/testimonials/${testimonial.id}`, data)
			.then((response) => {
				toast.success(response.data.message);
				router.push("/admin/testimonials");
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
				<div>
					<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
						User image
					</label>
					<UploadCourseImage
						onChange={(value) => setCustomValue("image", value)}
						value={image}
						label="User image 300x300"
					/>
				</div>
			</div>
			<div>
				<div>
					<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
						Name
					</label>
					<Input
						placeholder="Name"
						id="name"
						disabled={isSubmitting}
						register={register}
						errors={errors}
					/>
				</div>
			</div>
			<div>
				<div>
					<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
						Designation
					</label>
					<Input
						placeholder="Designation"
						id="designation"
						disabled={isSubmitting}
						register={register}
						errors={errors}
					/>
				</div>
			</div>
			<div>
				<div>
					<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
						Description
					</label>
					<Input
						placeholder="Description"
						id="description"
						disabled={isSubmitting}
						register={register}
						errors={errors}
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
                    {isSubmitting ? "Please wait..." : "Update"}
                </button>
			</div>
		</form>
	);
};

export default UpdateForm;
