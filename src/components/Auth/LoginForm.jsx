"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../FormHelpers/Input";
import { errorAlert } from "@/providers/customAlert";

const LoginForm = ({isAdmin}) => {
	const router = useRouter();
	const { lang } = useParams();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data) => {
		signIn("credentials", {
			...data,
			redirect: false,
		}).then((callback) => {
			if (!callback?.error) {
				toast.success("Logged in");
				router.refresh();
			}

			if (callback?.error) {
				errorAlert(callback.error);
			}
		});
	};

	return (
		<>
			<div className="py-[42px] md:py-[60px] lg:py-[96px]">
				<div className="container mx-auto max-w-[650px]">
					<div className="bg-black p-[30px] sm:p-[55px]">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-[25px]"
						>
							<div>
								<label
									htmlFor="email"
									className="font-bold text-[#fff] text-[14px] md:text-[16px] block mb-[10px]"
								>
									La tua email
								</label>
								<Input
									placeholder="Email"
									id="email"
									type="email"
									disabled={isSubmitting}
									register={register}
									errors={errors}
									required
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="font-bold text-[#fff] text-[14px] md:text-[16px] block mb-[10px]"
								>
									Parola 
								</label>
								<Input
									placeholder="Password"
									id="password"
									type="password"
									disabled={isSubmitting}
									register={register}
									errors={errors}
									required
								/>
							</div>

							<div className="flex items-center">
								<input
									id="default-checkbox"
									type="checkbox"
									value=""
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
								/>
								<label
									htmlFor="default-checkbox"
									className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-white"
								>
									Remember me
								</label>
							</div>

							<div>
								<button
									type="submit"
									className="	 text-[#fff] text-[15px] sm:text-[16px] font-semibold block w-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
									disabled={!isValid || isSubmitting}
								>
									{isSubmitting
										? "Please wait..."
										: "Login Now"}{" "}
									<i className="ri-arrow-right-up-line"></i>
								</button>
							</div>

							{isAdmin &&<p>
								Didn’t create an account?{" "}
								<Link
									href={`/${lang}/register`}
									className="font-medium hover:text-[#1151f2]"
								>
									Register Now
								</Link>
							</p>}
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
