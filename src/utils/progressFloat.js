export const progressFloat = (finished, total) => {
	return Math.round((finished / total) * 100);
};
