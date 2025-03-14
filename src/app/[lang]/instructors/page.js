import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import ServicesList from "@/components/Services/ServicesList";
import InstructorsList from "@/components/OurInstructors/InstructorsList";
import { getInstructors } from "@/actions/admin/getInstructors";
export const metadata = {
  title: "Istruttori | Ultimate Arena Fighting",
};
export default async function InstructorsPage({ params: { lang } }) {
  const { instructors } = await getInstructors();

  return (
    <>
      <PageBannerTitle
        title="I nostri istruttori"
        homeText="Home"
        homeUrl={`/${lang}`}
      />

      <div className="bg-black ">
        <InstructorsList instructors={instructors} />
      </div>
    </>
  );
}
