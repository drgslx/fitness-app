import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Schedule from "@/components/Schedule/Schedule";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getSchedule } from "@/actions/getSchedule";
import { getAnnouncements } from "@/actions/admin/getAnnouncements";

export const metadata = {
  title: "Istruttori | Ultimate Arena Fighting",
};

export default async function SchedulePage({ params: { lang } }) {
  const user = await getCurrentUser();
  const data = await getSchedule();
  const schedule = data.schedule;
  const {announcements} = await getAnnouncements();
  const isAdmin = user?.role === "ADMIN";

  // Log the extracted schedule to confirm
  console.log("Extracted schedule data:", schedule);
  console.log("Extracted announcements:", announcements);

  return (
    <>
      <PageBannerTitle title="Orari" homeText="Home" homeUrl={`/${lang}`} />

      <div className="bg-black">
        <Schedule
          announcements={announcements}
          schedule={schedule}
          isAdmin={isAdmin}
        />
      </div>
    </>
  );
}
