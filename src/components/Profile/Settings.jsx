"use client";

import React, { useEffect } from "react";

import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import Nav from "./Nav";
import ProfileImageUpload from "../FormHelpers/ProfileImageUpload";
import TextArea from "../FormHelpers/TextArea";

const Settings = ({ currentUser }) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		defaultValues: {
			name: "",
			image: "",
			gender: "",
			designation: "",
			bio: "",
			location: "",
			phone: "",
			website: "",
			twitter: "",
			facebook: "",
			linkedin: "",
			youtube: "",
		},
	});

	useEffect(() => {
		setValue("name", currentUser.name);
		setValue("image", currentUser.image);
		setValue("gender", currentUser.gender);
		setValue("designation", currentUser.designation);
		setValue("bio", currentUser.profile?.bio || "");
		setValue("location", currentUser.profile?.location || "");
		setValue("phone", currentUser.profile?.phone || "");
		setValue("website", currentUser.profile?.website || "");
		setValue("twitter", currentUser.profile?.twitter || "");
		setValue("facebook", currentUser.profile?.facebook || "");
		setValue("linkedin", currentUser.profile?.linkedin || "");
		setValue("youtube", currentUser.profile?.youtube || "");
	}, [currentUser]);

	const image = watch("image");
	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (data) => {
		const response = await axios.post("/api/users/update", data);
		console.log(response.data);
		toast.success(response.data.message);
	};

	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1150px]">
					{/* Nav */}
					<Nav />

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-[25px]"
					>
						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									First name
								</label>
								<Input
									placeholder="Name"
									id="name"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

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

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Gender
								</label>
								<Input
									placeholder="Gender"
									id="gender"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Location
								</label>
								<Input
									placeholder="Location"
									id="location"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
						</div>

						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Profile Image
							</label>
							<ProfileImageUpload
								onChange={(value) =>
									setCustomValue("image", value)
								}
								value={image}
							/>
						</div>

						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								About Info
							</label>
							<TextArea
								placeholder="Bio...."
								id="bio"
								disabled={isSubmitting}
								register={register}
								errors={errors}
							/>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Phone
								</label>
								<Input
									placeholder="Phone"
									id="phone"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Website
								</label>
								<Input
									placeholder="Website"
									id="website"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Facebook
								</label>
								<Input
									placeholder="Facebook"
									id="facebook"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									LinkedIn
								</label>
								<Input
									placeholder="LinkedIn"
									id="linkedin"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Twitter
								</label>
								<Input
									placeholder="Twitter"
									id="twitter"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Youtube
								</label>
								<Input
									placeholder="Youtube"
									id="youtube"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
						</div>

						<button
							type="submit"
							className="bg-[#1151f2] text-[#fff] text-[15px] sm:text-[16px] font-semibold block w-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
							disabled={!isValid || isSubmitting}
						>
							{isSubmitting ? "Please wait..." : "Update Now"}{" "}
							<i className="ri-arrow-right-up-line"></i>
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Settings;
