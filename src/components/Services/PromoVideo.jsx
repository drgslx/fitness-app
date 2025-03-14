"use client";

import React, { useState } from "react";
import FsLightbox from "fslightbox-react";

const PromoVideo = () => {
	// To open the lightbox change the value of the "toggler" prop.
	const [toggler, setToggler] = useState(false);

	return (
		<>
			{/* Use here youtube Embed video link */}
			<FsLightbox
				toggler={toggler}
				sources={[
					"https://www.youtube.com/embed/dJlFmxiL11s?si=jWErMyFyMqBp0T7K",
				]}
			/>

			<div
				className="relative h-[450px] bg-cover bg-center"
				style={{
					backgroundImage: `url(/images/promo-video-thumb2.jpg)`,
				}}
			>
				<div
					className="bg-#f13a11 w-[100px] md:w-[145px] h-[100px] md:h-[145px] leading-[100px] md:leading-[145px] text-center rounded-full text-white text-[60px] md:text-[70px] absolute top-1/2 -translate-y-2/4 left-0 right-0 mx-auto cursor-pointer transition duration-500 ease-in-out hover:bg-[#CD201F]"
					onClick={() => setToggler(!toggler)}
				>
					<i className="ri-play-fill"></i>
				</div>
			</div>
		</>
	);
};

export default PromoVideo;
