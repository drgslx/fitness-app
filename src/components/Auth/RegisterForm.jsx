"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Input from "../FormHelpers/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const { lang } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await axios
      .post("/api/register", data)
      .then((response) => {
        toast.success("Registration success! Please login.");
        router.push(`/${lang}/login`);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <>
      <div className="py-[42px] ">
        <div className="container mx-auto max-w-[650px]">
          <div className="bg-black p-[30px] sm:p-[55px]">
          <div className="relative">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      {...register("terms", {
                        required: "You must accept the terms and conditions.",
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="terms-checkbox"
                      className="ml-2 text-sm text-white"
                    >
                      Accetta i nostri{" "}
                      <a
                        href="/terms-condition"
                        className="font-medium hover:text-[#1151f2]"
                      >
                        termini e condizioni
                      </a>{" "}
                      e{" "}
                      <a
                        href="/privacy-policy"
                        className="font-medium hover:text-[#1151f2]"
                      >
                        politica sulla privacy
                      </a>
                    </label>
                  </div>
                </div>
              </div>
            <div className="space-y-[20px] mb-[15px]">
              <h2 className="font-bold text-[25px]  leading-[1.1]">
                Cosa stai facendo qui? Sembra che tu stia cercando di creare un
                account. Sfortunatamente, questa funzionalità non è ancora
                completamente incorporata. Resta sintonizzato!
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
              <div>
                <label
                  htmlFor="name"
                  className="font-bold text-[#fff] text-[14px] md:text-[16px] block mb-[10px]"
                >
                  Nome
                </label>
                <Input
                  placeholder="Nome"
                  id="name"
                  disabled={isSubmitting}
                  register={register}
                  errors={errors}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-bold text-[#fff] text-[14px] md:text-[16px] block mb-[10px]"
                >
                  La tua email
                </label>
                <Input
                  placeholder="La tua email"
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
                  placeholder="Parola"
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  register={register}
                  errors={errors}
                  required
                />
              </div>

              {/* Accept Terms and Conditions */}
             

              {errors.terms && (
                <p className="text-red-500">{errors.terms.message}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="bg-black text-[#fff] text-[15px] sm:text-[16px] font-semibold block w-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Create your account"}{" "}
                  <i className="ri-arrow-right-up-line"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
