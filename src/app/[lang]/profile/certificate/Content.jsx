"use client";

import React, { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import Image from "next/image";

const Content = ({ currentUser, title }) => {
	const [student, setStudent] = useState(currentUser.name);
	const domEl = useRef(null);

	const downloadCertificate = async () => {
		const dataUrl = await htmlToImage.toJpeg(domEl.current);

		//download certificate
		const link = document.createElement("a");
		link.download = `${student.toLowerCase().replaceAll(" ", "-")}.jpg`;
		link.href = dataUrl;
		link.click();
	};

	const downloadCertificatePdf = async () => {
		const dataUrl = await htmlToImage.toJpeg(domEl.current);

		const pdf = new jsPDF();
		pdf.addImage(dataUrl, "JPEG", 10, 10, 180, 150);
		pdf.save(`${student.toLowerCase().replaceAll(" ", "-")}.pdf`);
	};
	return (
		<>
			<div className="">
				<div className="container mx-auto">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<form>
							<label className="text-[#000000] text-[16px] md:text-[18px] font-semibold block mb-[10px]">
								Enter your name
							</label>
							<input
								type="text"
								className="bg-transparent text-[#ffffff] border border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#ffffff]"
								placeholder="Enter your name"
								value={student}
								onChange={(e) => setStudent(e.target.value)}
							/>
						</form>

						<div className="lg:col-span-2 space-y-[30px]">
							<div className="relative">
								<div
									id="domEl"
									ref={domEl}
									className="certificate-img"
								>
									<div className="content absolute top-[43%] text-center left-0 right-0 mx-auto">
										<h2 className="text-[30px]">
											{student}
										</h2>
										<p>
											For completing the <b>{title}</b>
										</p>
									</div>
									<Image
										width={2000}
										height={1414}
										src="/images/certificate.png"
										alt=""
									/>
								</div>

								<div className="caption absolute bottom-[15px] right-[20px]">
									<button
										className="download-btn "
										onClick={downloadCertificate}
										title="JPEG Image"
									>
										<i className="ri-image-fill bg-white text-blue-800 text-[30px] p-[5px]"></i>
									</button>{" "}
									<button
										className="download-btn"
										onClick={downloadCertificatePdf}
										title="PDF"
									>
										<i className="ri-file-pdf-fill text-red-800 text-[30px] bg-white p-[5px]"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Content;
