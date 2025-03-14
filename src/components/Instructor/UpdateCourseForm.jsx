"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import Nav from "./Nav";
import CategorySelect from "../FormHelpers/CategorySelect";
import SetPrice from "../FormHelpers/SetPrice";
import AccessTime from "../FormHelpers/AccessTime";
import UploadCourseImage from "../FormHelpers/UploadCourseImage";
import TextArea from "../FormHelpers/TextArea";

const UpdateCourseForm = ({ course }) => {
	const router = useRouter();
	const { lang } = useParams();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		defaultValues: {
			category: "",
			title: "",
			overview: "",
			regular_price: "",
			before_price: "",
			lessons: "",
			duration: "",
			image: "",
			access_time: "",
			requirements: "",
			what_you_will_learn: "",
			who_is_this_course_for: "",
		},
	});

	useEffect(() => {
		setValue("title", course.title);
		setValue("category", course.catId);
		setValue("overview", course.overview);
		setValue("regular_price", course.regular_price);
		setValue("before_price", course.before_price);
		setValue("lessons", course.lessons);
		setValue("duration", course.duration);
		setValue("image", course.image);
		setValue("access_time", course.access_time);
		setValue("requirements", course.requirements);
		setValue("what_you_will_learn", course.what_you_will_learn);
		setValue("who_is_this_course_for", course.who_is_this_course_for);
	}, [course]);

	const regular_price = watch("regular_price");
	const before_price = watch("before_price");
	const category = watch("category");
	const access_time = watch("access_time");
	const image = watch("image");

	const onUpdate = async (data) => {
		if (!data.image) {
			toast.error("Please drop image 750x500 before submitting.");
			return;
		}

		axios
			.post(`/api/course/${course.id}/edit`, data)
			.then((response) => {
				toast.success(response.data.message);
				router.push(`/${lang}/instructor/my-courses`);
			})
			.catch((error) => {
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
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1150px]">
					{/* Nav */}
					<Nav />

					<form
						onSubmit={handleSubmit(onUpdate)}
						className="space-y-[25px]"
					>
						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Course Title
							</label>
							<Input
								placeholder="Course Title"
								id="title"
								disabled={isSubmitting}
								register={register}
								errors={errors}
							/>
						</div>

						<div>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Category
							</label>

							<CategorySelect
								value={category}
								onChange={(value) =>
									setCustomValue("category", value)
								}
							/>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Lessons
								</label>
								<Input
									placeholder="Lessons"
									id="lessons"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Duration
								</label>
								<Input
									placeholder="Duration"
									id="duration"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>
						</div>
						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Regular Price
								</label>
								<SetPrice
									id="regular_price"
									required
									disabled={isSubmitting}
									register={register}
									errors={errors}
									value={regular_price}
									onChange={(newValue) =>
										setValue("regular_price", newValue)
									}
								/>
							</div>
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Before Price
								</label>
								<SetPrice
									id="before_price"
									required
									disabled={isSubmitting}
									register={register}
									errors={errors}
									value={before_price}
									onChange={(newValue) =>
										setValue("before_price", newValue)
									}
								/>
							</div>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Access Time
								</label>

								<AccessTime
									value={access_time}
									onChange={(value) =>
										setCustomValue("access_time", value)
									}
									placeholder="Access Time"
								/>
							</div>

							<div>
								<div>
									<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
										Upload Image
									</label>
									<UploadCourseImage
										onChange={(value) =>
											setCustomValue("image", value)
										}
										value={image}
									/>
								</div>
							</div>
						</div>

						<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Overview / Details
								</label>
								<TextArea
									placeholder="Overview...."
									id="overview"
									disabled={isSubmitting}
									register={register}
									errors={errors}
								/>
							</div>

							<div>
								<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
									Curriculum
								</label>
								<TextArea
									placeholder="Curriculum...."
									id="what_you_will_learn"
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
                                    bg-#f13a11 
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
								{isSubmitting
									? "Please wait..."
									: "Update Course"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default UpdateCourseForm;
