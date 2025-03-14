"use client";

import React from "react";

const GoogleMap = ({ address }) => {
  const encodedAddress = encodeURIComponent(address);

  return (
    <>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCaCGu_h_N4sQSpJHptpcHP80rLDzxz3fs&q=${encodedAddress}`}
        width="100%"
        height="500"
        style={{ border: "0" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </>
  );
};

export default GoogleMap;
