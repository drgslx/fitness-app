// app/events/layout.js
import { getEvents } from "@/actions/admin/getEvents";
import OurNextEvents from "@/components/Shared/OurNextEvents";

export default async function EventsLayout({ children , params: { lang } }) {
    const { events } = await getEvents();


    return (
        <div>
            {/* This could be a shared header or banner */}
           
            {/* Render the specific page content */}
            {children}
            <div className="bg-black">
            <OurNextEvents lang={lang} events={events}/>

            </div>
        </div>
    );
}
