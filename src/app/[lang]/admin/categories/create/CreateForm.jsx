"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";
import TextArea from "@/components/FormHelpers/TextArea";

const CreateForm = () => {
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
	  description: "",
	  image: "",
    },
  });

  const image = watch("image");
  const onSubmit = async (data) => {
    if (!data.image) {
      toast.error("Please drop an image before submitting.");
      return;
    }

	if (!data.name) {
	  toast.error("Please enter a name for the Discipline.");
	  return;
	}

	if (!data.description) {
	  toast.error("Please enter a description for the Discipline.");
	  return;
	}

    try {
      const response = await axios.post("/api/admin/categories", {
        name: data.name,
        image: data.image,
        description: data.description,
      });
      toast.success(response.data.message);
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating instructor:", error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
      <div>
        <Input
          placeholder="Discipline Name"
          id="name"
          disabled={isSubmitting}
          register={register}
          errors={errors}
        />
      </div>
      <div>
      <TextArea
                    placeholder="Description"
                    id="description"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                />
      </div>
	  <div>
        <label className="text-[#fff] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Discipline Image
        </label>
        <UploadCourseImage
          onChange={(value) => setValue("image", value)}
          value={image}
          label="User image 300x300"
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
                    {isSubmitting ? "Please wait..." : "Save"}
                </button>
      </div>
    </form>
  );
};

export default CreateForm;
