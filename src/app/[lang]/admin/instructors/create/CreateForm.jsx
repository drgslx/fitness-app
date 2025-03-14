"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";
import CategorySelect from "@/components/FormHelpers/CategorySelect";
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
      image: "",
      categories: [],
      description: "",
      videoImage: "",
      videoUrl: "",
    },
  });

  const image = watch("image");
  const videoImage = watch("videoImage");
  const categories = watch("categories");

  const onSubmit = async (data) => {
    if (!data.image) {
      toast.error("Please drop an image before submitting.");
      return;
    }

    if (data.categories.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    try {
      const response = await axios.post("/api/admin/instructors", {
        name: data.name,
        image: data.image,
        description: data.description,
        videoImage: data.videoImage,
        videoUrl: data.videoUrl,
        categories: data.categories,
      });
      toast.success(response.data.message);
      router.push("/admin/instructors");
    } catch (error) {
      console.error("Error creating instructor:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form  onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Instructor Image
        </label>
        <UploadCourseImage
          onChange={(value) => setValue("image", value)}
          value={image}
          label="Instructor image 400x600"
        />
      </div>
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Name
        </label>
        <Input
          placeholder="Name"
          id="name"
          disabled={isSubmitting}
          register={register}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Categories
        </label>
        <CategorySelect
          value={categories}
          onChange={(value) => setValue("categories", value)}
        />
      </div>
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Description
        </label>
        <TextArea
          placeholder="Description"
          id="description"
          disabled={isSubmitting}
          register={register}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Name
        </label>
        <Input
          placeholder="Video Url"
          id="videoUrl"
          disabled={isSubmitting}
          register={register}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
          Video Thumbnail Image
        </label>
        <UploadCourseImage
          onChange={(value) => setValue("videoImage", value)}
          value={videoImage}
          label="Thumbnail video image 1200x800"
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
