"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "/node_modules/aos/dist/aos.css";

const AosProvider = () => {
	useEffect(() => {
		AOS.init();
	}, []);

	return <div></div>;
};

export default AosProvider;
