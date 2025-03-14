import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import LoginForm from "@/components/Auth/LoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Login({ params: { lang } }) {
	const currentUser = await getCurrentUser();
	if (currentUser) {
		redirect(`/${lang}`);
	}

	const isAdmin = currentUser?.role === "ADMIN";
	return (
		<>
			<PageBannerTitle
				title="Login"
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<LoginForm isAdmin={isAdmin}/>

				
			</div>
		</>
	);
}
