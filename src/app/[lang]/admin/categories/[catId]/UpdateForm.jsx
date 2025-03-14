"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";
import TextArea from "@/components/FormHelpers/TextArea";

const UpdateForm = ({ category }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
			image: ""
		},
	});
	useEffect(() => {
		setValue("name", category.name);
		setValue("description", category.description);
		setValue("image", category.image);
	}, [category]);

	const image = watch("image");


	const onUpdate = async (data) => {
		try {
			const url = `/api/admin/categories/${category.id}`;
			const response = await axios.post(url, data);
			toast.success(response.data.message);
			router.push("/admin/categories");
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message);
		}
	};
	return (
		<form onSubmit={handleSubmit(onUpdate)} className="space-y-[25px]">
			<div>
				<label className="text-[#fff] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					Discipline Name
				</label>
				<Input
					placeholder="Discipline Name"
					id="name"
					disabled={isSubmitting}
					register={register}
					errors={errors}
				/>
			</div>
			<div>
				<label className="text-[#fff] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					Discipline Description
				</label>
				<TextArea
					placeholder="Description"
					id="description"
					disabled={isSubmitting}
					register={register}
					errors={errors}
				/>
			</div>

			<div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Discipline Image
        </label>
        <UploadCourseImage
          onChange={(value) => setValue("image", value)}
          value={image}
          label="User image 500X700"
        />
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
