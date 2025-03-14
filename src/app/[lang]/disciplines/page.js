import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import ServicesList from "@/components/Services/ServicesList";
import { getCategories } from "@/actions/admin/getCategories";
import DisciplinesList from "@/components/Disciplines/DisciplinesList";
import Schedule from "@/components/Schedule/Schedule";
import { getSchedule } from "@/actions/getSchedule";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getAnnouncements } from "@/actions/admin/getAnnouncements";

export default async function ServicesPage({ params: { lang } }) {
    const { categories } = await getCategories();
    const { schedule } = await getSchedule();
    const { announcements } = await getAnnouncements();
    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";

    return (
        <>
            <PageBannerTitle
                title="Corsi"
                homeText="Home"
                homeUrl={`/${lang}`}
            />

            <div className="bg-black">
                <DisciplinesList disciplines={categories} />

                {/* Hidden on small screens, visible on medium and up */}
                <div className="hidden md:block">
                    <h1 className="text-3xl font-bold text-center">Orari</h1>
                    <Schedule announcements={announcements} isAdmin={isAdmin} schedule={schedule} />
                </div>

                
            </div>
        </>
    );
}
