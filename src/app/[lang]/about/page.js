import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Services from "@/components/Shared/Services";
import AboutMe from "@/components/About/AboutMe";
import AboutUs from "@/components/About/AboutUs";
import FeedbackSlider from "@/components/Shared/FeedbackSlider";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import ClubGalleryPage from "@/components/Shared/ClubGalleryPage";
import OurInstructors from "@/components/Shared/OurInstructors";
import { getInstructors } from "@/actions/admin/getInstructors";
import { getGallery } from "@/actions/admin/getGalleryPictures";

export const metadata = {
  title: "Chi Siamo | Ultimate Arena Fighting",
};

export default async function AboutUsPage({ params: { lang } }) {
  const { instructors } = await getInstructors();
  const { gallery } = await getGallery();

  return (
    <>
      <PageBannerTitle
        title="Chi Siamo"
        homeText="Home"
        homeUrl={`/${lang}`}
        image="/images/shape1.jpg"
        image2="/images/shape2.jpg"
        image3="/images/shape3.jpg"
        image4="/images/shape4.jpg"
      />

      <div className="bg-black">
          <AboutMe />

          <AboutUs />

        <ClubGalleryPage gallery={gallery} />

        <div className="container mx-auto pb-[42px] ">
          <OurInstructors lang={lang} instructors={instructors} />
        </div>

      </div>
    </>
  );
}
