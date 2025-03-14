import React from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import TopNav from "../TopNav";
import AdminSidebar from "../../AdminSidebar";
import { getEventById } from "@/actions/admin/getEvents";
import UpdateForm from "./UpdateForm";

const Page = async ({ params }) => {
    const currentUser = await getCurrentUser();
    redirectIfNotAdmin(currentUser, params);
    const { event } = await getEventById(params);

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="bg-black py-[50px]">
            <div className="container mx-auto">
                <div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
                    <AdminSidebar />
                    <div className="lg:col-span-3 space-y-[30px]">
                        <TopNav />
                        <UpdateForm event={event}  />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
