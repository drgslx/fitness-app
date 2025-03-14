import HeroBanner from "@/components/Index/HeroBanner";
import Services from "@/components/Index/Services";
import AboutMe from "@/components/Index/AboutMe";
import Cta from "@/components/Shared/Cta";
import Trainer from "@/components/Index/Trainer";
import FeedbackSlider from "@/components/Shared/FeedbackSlider";
import HealthCoachDietPlan from "@/components/Index/HealthCoachDietPlan";
import OurNextEvents from "@/components/Shared/OurNextEvents";
import GoogleMap from "@/components/ContactUs/GoogleMap";
import { getPartners } from "@/actions/admin/getPartners";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getTestimonials } from "@/actions/admin/getTestimonials";
import { getInstructors } from "@/actions/admin/getInstructors";
import { getEvents } from "@/actions/admin/getEvents";
import { getAnnouncements } from "@/actions/admin/getAnnouncements";

export const metadata = {
  title: "Home | Ultimate Arena Fighting",
};

export default async function Home({ params: { lang } }) {
  const currentUser = await getCurrentUser();
  const { partners } = await getPartners();
  const { testimonials } = await getTestimonials();
  const { instructors } = await getInstructors();
  const { events } = await getEvents();
  const { announcements } = await getAnnouncements();

  return (
    <>
      <div className="bg-black w-full">
        {announcements.homeAnnouncement
          ? announcements.map(
              (announcementItem, index) =>
                announcementItem.homeAnnouncement && (
                  <>
                    <div className="flex flex-col bg-[#f13a11] my-6">
                      <h1
                        className="text-[#fff] text-center text-[20px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[42px] font-bold leading-none py-6"
                        key={index}
                      >
                        {announcementItem.homeAnnouncement}
                      </h1>
                    </div>
                  </>
                )
            )
          : null}

        <HeroBanner currentUser={currentUser} />

        <Services />

        <AboutMe />

        <Cta />

        <Trainer />

        <FeedbackSlider testimonials={testimonials} />

        <HealthCoachDietPlan />

        <OurNextEvents lang={lang} events={events} />

        <GoogleMap address="Via V. Bellini, 24" />
      </div>
    </>
  );
}
