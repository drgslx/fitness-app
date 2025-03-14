export const generateStars = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		const starClass = i <= rating ? "ri-star-fill" : "ri-star-line";
		stars.push(<i key={i} className={starClass}></i>);
	}
	return stars;
};

export const generateStarsSummary = (reviews) => {
	// Initialize counters for each rating
	let count1 = 0,
		count2 = 0,
		count3 = 0,
		count4 = 0,
		count5 = 0;

	// Calculate the count of each rating
	reviews.forEach((review) => {
		switch (review.rating) {
			case 1:
				count1++;
				break;
			case 2:
				count2++;
				break;
			case 3:
				count3++;
				break;
			case 4:
				count4++;
				break;
			case 5:
				count5++;
				break;
			default:
				break;
		}
	});

	// Calculate the total count of reviews
	const totalCount = reviews.length;

	// Calculate the percentage of each rating
	const percent1 = (count1 / totalCount) * 100;
	const percent2 = (count2 / totalCount) * 100;
	const percent3 = (count3 / totalCount) * 100;
	const percent4 = (count4 / totalCount) * 100;
	const percent5 = (count5 / totalCount) * 100;

	return {
		count1,
		count2,
		count3,
		count4,
		count5,
		percent1,
		percent2,
		percent3,
		percent4,
		percent5,
	};
};

export const calculateAverageRating = (reviews) => {
	const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
	const averageRating = totalRating / reviews.length;

	return { averageRating };
};
