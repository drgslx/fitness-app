import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

const useFavourite = ({ courseId, currentUser }) => {
	const router = useRouter();
	const { lang } = useParams();

	const hasFauvorited = useMemo(() => {
		const list = currentUser?.favourites || [];

		return list.find((fav) => fav.courseId === parseInt(courseId));
	}, [currentUser, courseId]);

	const toggleFavourite = useCallback(
		async (e) => {
			e.stopPropagation();
			if (!currentUser) {
				toast.error("Need to login first!");
				router.push(`/${lang}/login`);
				return;
			}

			try {
				let request;
				if (hasFauvorited) {
					request = () => axios.delete(`/api/favourites/${courseId}`);
				} else {
					request = () => axios.post(`/api/favourites/${courseId}`);
				}

				await request();
				router.refresh();
				toast.success("Success");
			} catch (error) {
				toast.error("Something went wrong");
			}
		},
		[currentUser, hasFauvorited, courseId, router]
	);

	return {
		hasFauvorited,
		toggleFavourite,
	};
};

export default useFavourite;
