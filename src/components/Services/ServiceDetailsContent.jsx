"use client";

import React from "react";
import PromoVideo from "./PromoVideo";
import Image from "next/image";

import serviceImg from "/public/images/service8.jpg";

const ServiceDetailsContent = () => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[900px]">
					<div className="details-content space-y-[20px]">
						<Image
							src={serviceImg}
							alt="service"
							className="mb-[30px]"
						/>

						<h1>
							How meditation improve your mental health in winter
							season this is interesting.
						</h1>

						<p>
							Our online courses cover a wide range of topics,
							from personal development and wellness to
							professional skills like leadership, communication,
							and for the entrepreneurship Our online courses
							cover a wide range of topics, from person and
							wellness to professional skills like leadership.
						</p>

						<p>
							We are use medication to help patients relax during
							dental procedures. It’s sometimes referred to as
							“sleep dentistry,” although that’s not entirely
							accurate. Patients are usually awake with the
							exception of those who are under general anesthesia.
						</p>

						<ul>
							<li className="font-semibold">
								Minimal sedation – you are awake but relaxed
							</li>
							<li className="font-semibold">
								Moderate sedation (formerly called “conscious
								sedation”) – you may slur your words when
								speaking and not remember much of the procedure.
							</li>
							<li className="font-semibold">
								Our online courses cover a wide range of topics
							</li>
							<li className="font-semibold">
								professional skills like leadership.
							</li>
						</ul>

						<h6>The Procedure Of Cosmetic Dentistry</h6>

						<p>
							Our online courses cover a wide range of topics,
							from personal development and wellness to
							professional skills like leadership, communication,
							and for the entrepreneurship Our online courses
							cover a wide range of topics, from person and
							wellness to professional skills like leadership.
						</p>

						{/* PromoVideo */}
						<div className="py-[15px]">
							<PromoVideo />
						</div>

						<h6>Why Cosmetic Dentistry is Important</h6>

						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore
							eu fugiat nulla pariatur. Excepteur sint occaecat
							cupidatat non proident, sunt in culpa qui officia
							deserunt.
						</p>

						<p>
							Sed ut perspiciatis unde omnis iste natus error sit
							voluptatem accusantium doloremque laudantium, totam
							rem aperiam, eaque ipsa quae ab illo inventore
							veritatis et quasi architecto beatae vitae dicta
							sunt explicabo. Nemo enim ipsam voluptatem quia
							voluptas sit aspernatur aut odit aut fugit, sed quia
							consequuntur magni dolores eos qui ratione
							voluptatem sequi nesciunt.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ServiceDetailsContent;
