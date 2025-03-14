"use client";

import React from "react";
import Rating from "./Reviews/Rating";
import ReviewsList from "./Reviews/ReviewsList";
import CommentForm from "./Reviews/CommentForm";

const ReviewsContent = ({ id, reviews, currentUser }) => {
	return (
		<>
			<div className="pt-[30px] space-y-[30px]">
				{/* Rating */}
				<Rating reviews={reviews} />

				{/* ReviewsList */}
				<ReviewsList reviews={reviews} />

				{/* CommentForm */}
				<CommentForm courseId={id} currentUser={currentUser} />
			</div>
		</>
	);
};

export default ReviewsContent;
