"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import logo from "/public/images/logo.png";
import { useParams } from "next/navigation";

const Footer = ({isAdmin}) => {
  const { lang } = useParams();
  return (
    <footer className="bg-[#C84B2F] pt-6 ">
      <div className="container mx-auto">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <div
            className="flex flex-col items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12 rtl:space-x-reverse"
          
          >
            <Link href={`/${lang}`}>
              <Image src={logo} alt="logo" className="w-32 md:w-40" />
            </Link>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <p className="text-[#F8F1E1] text-base md:text-lg">
                Segui su:
              </p>

              <ul className="flex space-x-3 rtl:space-x-reverse">
                <li>
                  <a
                    href="https://www.facebook.com/ultimatearena.fight/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F8F1E114] text-[#F8F1E1] inline-flex items-center justify-center w-9 h-9 rounded-full transition duration-500 ease-in-out hover:bg-black hover:text-white"
                  >
                    <i className="text-xl ri-facebook-fill"></i>
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.instagram.com/ultimatearena.fight/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F8F1E114] text-[#F8F1E1] inline-flex items-center justify-center w-9 h-9 rounded-full transition duration-500 ease-in-out hover:bg-black hover:text-white"
                  >
                    <i className="text-xl ri-instagram-fill"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="text-center md:text-end"
           
          >
            <a
              href="mailto:ultimatearenato@gmail.com"
              className="text-[#F8F1E1] font-semibold text-lg md:text-xl transition duration-500 ease-in-out hover:text-black"
            >
              ultimatearenato@gmail.com
            </a>
            <br />
            <a
              href="tel:+39 392 407 3942"
              className="text-[#F8F1E1] font-semibold text-lg md:text-xl transition duration-500 ease-in-out hover:text-black"
            >
              +39 392 407 3942
            </a>
          </div>
        </div>

        <hr className="border-[#F8F1E11C] my-12 md:my-16 lg:my-20" />

        <div className="p-4 grid gap-12 text-center sm:text-left align-middle grid-cols-1 sm:grid-cols-2 items-center md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          <div
            className=""
          >
            <h3 className="text-[#F8F1E1] text-lg md:text-xl mb-6">
Esplora di più</h3>
            <ul className="items-center space-y-4">
              <li>
                <Link
                  href={`/${lang}/privacy-policy`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms-conditions`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Terms & Condition
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href={`/${lang}/admin/instructors`}
                    className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              
            </ul>
          </div>

          <div
            
          >
            <h3 className="text-[#F8F1E1] text-lg md:text-xl mb-6">Ricerche popolari</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${lang}/disciplines`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Corsi
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/events`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Eventi
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/instructors`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Istruttori
                </Link>
              </li>
            </ul>
          </div>

          <div
            
          >
            <h3 className="text-[#F8F1E1] text-lg md:text-xl mb-6">Collegamenti rapidi</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${lang}/schedule`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Orari
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Contatti
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  Chi Siamo
                </Link>
              </li>
            </ul>
          </div>

          <div
            
          >
            <h3 className="text-[#F8F1E1] text-lg md:text-xl mb-6">Help & Support</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${lang}/faq`}
                  className="text-[#F8F1E1] transition duration-500 ease-in-out hover:text-black"
                >
                  FAQ’s
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center border-t border-[#f8e8e11c] py-6 mt-12 md:mt-20 lg:mt-32">
          <p className="text-[#F8F1E1] text-base md:text-lg">
            &copy; Ultimate Arena Fight. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
