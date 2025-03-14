"use client";

import React from "react";
import Image from "next/image";

import aboutMe from "/public/images/lucian-about.png";

const AboutMe = () => {
  return (
    <>
      <div className="p-4 bg-[black] sm:pb-[50px] md:pb-[60px] lg:pb-[80px] xl:pb-[100px] 2xl:pb-[120px]">
        <div className="otc-aboutme-content container 2xl:p-0 2xl:max-w-[1920px] mx-auto 2xl:mb-[-100px]">
          <div className="otc-aboutme-before relative 2xl:pt-[42px] 2xl:pr-[100px] rtl:2xl:pr-0 rtl:2xl:pl-[100px 2xl:before:content-[''] 2xl:before:bg-[black] 2xl:before:absolute 2xl:before:top-0 2xl:before:right-0 rtl:2xl:before:right-auto rtl:2xl:before:left-0 2xl:before:w-[817px] 2xl:before:h-[578px]">
            <div className="grid gap-[30px] md:gap-[30px] lg:gap-[80px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
              <div
                className="2xl:ml-auto rtl:2xl:ml-0 rtl:2xl:mr-auto 2xl:max-w-[570px] relative z-10"
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <div className="flex flex-col py-[42px] ">
                  <h2 className="text-[30px] gap-[10px] md:text-[35px] lg:text-[50px] xl:text-[80px] md:tracking-[-1.2px] leading-none mb-[15px] text-white lg:text-white">
                    Su di me
                  </h2>
                  <p className="text-white lg:text-white text-base sm:text-lg md:text-xl lg:text-xl">
                    Mi chiamo Lucian Danilencu, e sono un ex kickboxer
                    professionista con una carriera ricca di sfide e successi.{" "}
                    <br />
                    <br />
                    Nel corso degli anni, ho combattuto in numerosi incontri a
                    livello internazionale, mettendo alla prova la mia forza,
                    determinazione e disciplina.
                    <br />
                    La mia passione per il kickboxing mi ha portato a diventare
                    un atleta riconosciuto, noto per il mio stile combattivo e
                    la mia capacità di superare i limiti.
                    <br />
                    <br />
                    Oggi, dopo aver appeso i guantoni al chiodo, dedico il mio
                    tempo a condividere la mia esperienza e le lezioni apprese
                    sul ring, con lobiettivo di ispirare e motivare chiunque
                    desideri migliorare sé stesso, sia fisicamente che
                    mentalmente.
                  </p>
                </div>

                <div className="relative my-[30px] md:my-[40px] lg:my-[50px] xl:my-[70px] space-y-[30px] lg:space-y-[0]">
                  <div>
                    <h2 className="text-[#f13a11] font-bold text-[30px] md:text-[40px] lg:text-[50px] xl:text-[80px] leading-none">
                      138
                    </h2>
                    <p>5 star reviews</p>
                  </div>

                  <div className=" px-[30px] py-[25px] font-semibold text-white text-[16px] xl:text-[20px] lg:absolute lg:top-[-25px] lg:left-[225px] rtl:lg:left-auto rtl:lg:right-[225px] lg:w-[642px] lg:z-10">
                    “Learn about how them you went down prying the ring off his
                    cold, his dead finger. I don’t know what you a did, Fry, but
                    once again, you screwed up!”
                  </div>
                </div>

                <p className="text-[15px]">
                  Le nostre sessioni di allenamento ti permettono di migliorare
                  le tue abilità di combattimento in un ambiente stimolante e
                  professionale. Allena forza, agilità e tecnica con noi.{" "}
                </p>
              </div>

              <div
                className="relative z-0"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <Image src={aboutMe} alt="aboutMe" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutMe;
