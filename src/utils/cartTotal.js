export const cartTotal = (items) => {
	const total = items.reduce((acc, el) => {
		acc += el.regular_price * 1;
		return acc;
	}, 0);

	return total.toFixed(2);
	// const stripeTotal = parseFloat((total * 100).toFixed(2));
};

export const cartAmoutSub = (items) => {
	const total = items.reduce((acc, el) => {
		acc += el.before_price * 1;
		return acc;
	}, 0);

	return total.toFixed(2);
	// const stripeTotal = parseFloat((total * 100).toFixed(2));
};
