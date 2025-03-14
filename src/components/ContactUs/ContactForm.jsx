"use client";

import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GoogleMap from "./GoogleMap";
import Input from "../FormHelpers/Input";
import TextArea from "../FormHelpers/TextArea";
import Button from "../FormHelpers/Button";

const ContactForm = () => {
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
      <div className="py-[50px] md:py-[60px] lg:py-[140px]">
        <div className="container mx-auto">
          {/* <div>
              <GoogleMap address="VIA VINCENZO BELLINI 24 Moncalieri" />
            </div> */}
          {/*Contact form*/}
          {/* <div>
            <h2 className="text-bold text-white text-[25px] md:text-[30px] lg:text-[40px] xl:text-[48px] leading-none mb-[20px]">
              Invia il tuo messaggio
            </h2>

            <form
              className="space-y-[25px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <Input
                  id="email"
                  placeholder="La tua email"
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="name"
                  placeholder="Il tuo nome"
                  register={register}
                  errors={errors}
                  required
                />
              </div>

              <TextArea
                id="comment"
                placeholder="Messaggio...."
                register={register}
                errors={errors}
                required
              />

              <Button
                label="Invia il tuo messaggio"
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
                    hover:text-[#fff]"
              />
            </form>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ContactForm;
