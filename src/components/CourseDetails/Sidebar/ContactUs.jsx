"use client";

import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../FormHelpers/Input";
import TextArea from "../../FormHelpers/TextArea";
import Button from "../../FormHelpers/Button";

const ContactUs = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			comment: "",
		},
	});

	const onSubmit = async (data) => {
		// console.log(data);
		toast.success("Successfully submitted your feedback!");
		reset();
	};

	return (
		<>
			<div >
				<h3 className="text-[#fff] font-bold text-[22px] leading-none mb-[15px]">
					Contact Us
				</h3>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-[20px]"
				>
					<Input
						id="email"
						placeholder="La tua email"
						register={register}
						errors={errors}
						required
					/>

					<Input
						id="name"
						placeholder="Your Name"
						register={register}
						errors={errors}
						required
					/>

					<TextArea
						id="comment"
						placeholder="Your message..."
						register={register}
						errors={errors}
						required
					/>

					<Button
						label="Send Message"
						classAtts="
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
					/>
				</form>
			</div>
		</>
	);
};

export default ContactUs;
