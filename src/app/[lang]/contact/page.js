import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import ContactInfo from "@/components/ContactUs/ContactInfo";
import ContactForm from "@/components/ContactUs/ContactForm";

export const metadata = {
	title: "Contacci | Ultimate Arena Fighting",
};

export default function ContactUsPage() {
  return (
    <>
      <PageBannerTitle
        title="Contattaci per i dettagli"
        homeText="Home"
        homeUrl="/"
        image="/images/shape1.jpg"
        image2="/images/shape2.jpg"
        image3="/images/shape3.jpg"
        image4="/images/shape4.jpg"
      />

      <div className="bg-black">
        <ContactInfo />

        <ContactForm />

      </div>
    </>
  );
}
