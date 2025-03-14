"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import UploadCourseImage from "@/components/FormHelpers/UploadCourseImage";
import TextArea from "@/components/FormHelpers/TextArea";

const UpdateForm = ({ event }) => {
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
            time: "",
            venue: "",
            organizer: "",
            phone: "",
            address: "",
            description: "",
        },
    });

    useEffect(() => {
        setValue("name", event.name);
        setValue("image", event.image);
        setValue("venue", event.venue);
        setValue("description", event.description);
        setValue("organizer", event.organizer);
        setValue("phone", event.phone);
        setValue("address", event.address);
        setValue("time", new Date(event.time).toISOString().slice(0, 16)); // Setting time in ISO format
    }, [event, setValue]);

    const image = watch("image");
    const name = watch("name");
    const description = watch("description");

    const onSubmit = async (data) => {
        if (!data.image) {
            toast.error("Please drop image 300x300 before submitting.");
            return;
        }

        // Convert time to ISO-8601 format
        const formattedData = {
            ...data,
            time: new Date(data.time).toISOString(),
        };

        try {
            const response = await axios.post(`/api/admin/events/${event.id}`, formattedData);
            toast.success(response.data.message);
            router.push("/admin/events");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }
    };

    const setCustomValue = (id, value) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
            <div>
                <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
                    Event Image
                </label>
                <UploadCourseImage
                    onChange={(value) => setCustomValue("image", value)}
                    value={image}
                    label="User image 300x300"
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
                    errors={errors}
                />
            </div>
            <div>
                <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
                    Time
                </label>
                <Input

                    type="datetime-local"
                    placeholder="Time"
                    id="time"
                    disabled={isSubmitting}
                    register={register}
                    required={true}
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
                    errors={errors}
                />
            </div>
            <div>
                <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
                    Venue
                </label>
                <Input
                    placeholder="Venue"
                    id="venue"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                />
            </div>
            <div>
                <label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
                    Organizer
                </label>
                <Input
                    placeholder="Organizer"
                    id="organizer"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                />
            </div>
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
                    Address
                </label>
                <Input
                    placeholder="Address"
                    id="address"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
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
