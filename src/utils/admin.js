import { redirect } from "next/navigation";

export const redirectIfNotAdmin = (user, params) => {
	const { lang } = params;
	const isAdmin = user && user.role === "ADMIN";
	if (!isAdmin) redirect(`/${lang}`);
};
