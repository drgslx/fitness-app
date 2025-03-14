"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";
import TextArea from "@/components/FormHelpers/TextArea";

const UpdateForm = ({ announcement }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		defaultValues: {
			homeAnnouncement:"",
			scheduleAnnouncement : "",

		},
	});
	useEffect(() => {
		setValue("homeAnnouncement", announcement.homeAnnouncement);
		setValue("scheduleAnnouncement", announcement.scheduleAnnouncement);
	}, [announcement]);



	const onUpdate = async (data) => {
		try {
			const url = `/api/admin/announcements/${announcement.id}`;
			const response = await axios.post(url, data);
			toast.success(response.data.message);
			router.push("/admin/announcements");
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
				Home Page Announcement
				</label>
				<TextArea
					placeholder="Home Page Announcement"
					id="homeAnnouncement"
					disabled={isSubmitting}
					register={register}
					errors={errors}
					rows={2}
				/>
			</div>
			<div>
				<label className="text-[#fff] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
					Schedule Announcement
				</label>
				<TextArea
					placeholder="Schedule Announcement"
					id="scheduleAnnouncement"
					disabled={isSubmitting}
					register={register}
					errors={errors}
					rows={2}
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
