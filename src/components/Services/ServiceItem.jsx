import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ServiceItem = ({ lang, service }) => {
  return (
    <div className="relative group">
      <div className="relative pt-[20px] pl-[20px] before:content-[''] before:absolute before:left-0 before:top-0 before:bg-[#092C84] before:w-[95%] before:h-[95%] group-hover:before:bg-[#1151F2]">
        <Link href={`/${lang}/services/service-details/${service.id}`} className="relative">
          <Image src={service.image} alt={service.name} />
        </Link>
      </div>

      <div className="pl-[25px] pt-[25px]">
        <h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
          <Link href={`/${lang}/services/service-details/${service.id}`} className="transition duration-500 ease-in-out hover:text-[#1151F2]">
            {service.name}
          </Link>
        </h3>

        <p className="mb-[25px]">{service.description}</p>

        <Link href={`/${lang}/services/service-details/${service.id}`} className="text-[#f13a11] text-[14px] font-semibold inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#f13a11] transition duration-500 ease-in-out hover:bg-[#1151F2] hover:border-[#1151F2] hover:text-[#fff]">
          More Details <i className="ri-arrow-right-up-line"></i>
        </Link>
      </div>
    </div>
  );
};

export default ServiceItem;
