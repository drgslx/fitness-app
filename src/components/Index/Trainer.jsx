"use client";

import React from "react";
import Image from "next/image";

import hero from "/public/images/lucian-cropped.png";

const Trainer = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:py-16 xl:py-20 2xl:py-[42px]">
      <div className="container mx-auto lg:max-w-[1570px]">
        <div className="relative">
          <h1 className="text-[#f13a11] text-center text-[50px] md:text-[95px] lg:text-[128px] xl:text-[165px] 2xl:text-[200px] font-semibold leading-none tracking-tight">
            Ultimate Arena
          </h1>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 relative mt-8 lg:mt-16 xl:mt-24">
            <div className="text-center lg:text-end">
              <Image src={hero} alt="hero" className="inline-block max-w-full h-auto" />
            </div>

            <div className="lg:max-w-[700px]">
              <h1 className="text-white text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[50px] 2xl:text-[55px] font-bold leading-tight mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14">
                Aiuto le persone a raggiungere la loro forma fisica e abilità
                ideali.
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
                I nostri allenamenti sono pensati per gli appassionati di
                sport da combattimento e fitness. Che tu sia appassionato di
                kickboxing, CrossFit, Muay Thai o boxe, i nostri corsi tenuti
                da esperti ti aiuteranno ad affinare le tue abilità e a
                migliorare la tua forma fisica. Impara tecniche avanzate,
                migliora la tua forza e agilità e acquisisci la sicurezza di
                cui hai bisogno per eccellere nella disciplina che hai scelto.
              </p>

              <div className="flex flex-col sm:flex-row sm:space-x-6 md:space-x-12 mt-8 lg:mt-12 xl:mt-16">
                <div className="bg-white p-6 text-[16px] xl:text-[18px] font-semibold max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
                  <p className="text-justify text-[#0a0404]">
                    &ldquo;I hated every minute of training, but I said,
                    &#39;Don&#39;t quit. Suffer now and live the rest of your
                    life as a champion.&rdquo;
                  </p>
                  <br />
                  <p className="italic text-right text-[#0a0404]">
                    Muhammad Ali
                  </p>
                </div>

                <div className="text-center mt-6 sm:mt-0">
                  <h2 className="text-[30px] sm:text-[40px] md:text-[50px] xl:text-[80px] font-bold leading-none">
                    138
                  </h2>
                  <p>5 star reviews</p>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainer;
