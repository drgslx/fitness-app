import { create } from "zustand";
import toast from "react-hot-toast";

const updateCart = (item, cart) => {
	const cartItem = { ...item, count: 1 };
	const itemOnCart = cart.map((item) => item.id).includes(item.id);
	if (!itemOnCart) cart.push(cartItem);
	else {
		return cart.map((i) => {
			if (i.id === item.id) {
				toast.success("Updated the cart.");
				return { ...item, count: 1 };
			}
			return i;
		});
	}
	return cart;
};

const removeCart = (itemId, cart) => {
	return cart
		.map((item) => {
			if (item.id === itemId) return { ...item, count: item.count - 1 };
			return item;
		})
		.filter((item) => {
			return item.count;
		});
};

export const useCartStore = create((set, get) => ({
	cart: [],
	count: () => {
		const { cart } = get();
		if (cart.length)
			return cart
				.map((item) => item.count)
				.reduce((prev, curr) => prev + curr);
		return 0;
	},
	add: (item) => {
		const { cart } = get();
		const updatedCart = updateCart(item, cart);
		set({ cart: updatedCart });
		toast.success("Added to the cart");
	},
	remove: (itemId) => {
		const { cart } = get();
		const updatedCart = removeCart(itemId, cart);
		set({ cart: updatedCart });
		toast.success("Removed from the cart");
	},
	removeAll: () => set({ cart: [] }),
}));
