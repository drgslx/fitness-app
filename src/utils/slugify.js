export const slugify = (input) => {
	return input
		.trim()
		.toLowerCase() // Convert to lowercase
		.replace(/[^\w\s-]/g, "") // Remove non-word characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
		.replace(/-+/g, "-"); // Replace consecutive hyphens with a single hyphen
};
