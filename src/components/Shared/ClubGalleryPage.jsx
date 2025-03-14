
import React from "react";
import Image from "next/image";
import sala2 from "/public/images/sala/sala-2.jpg";

import Gallery from "../Gallery/Gallery";

const ClubGalleryPage = ({gallery}) => {
  return (
    <>
      <div className=" py-[42px] bg-[#161616] lg:py-[62px]">
        <div className=" container mx-auto">
          <h1 className="text-white text-center text-[30px] sm:text-[40px] md:text-[50px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[800px] mx-auto">
            LA NOSTRA PALESTRA
          </h1>

          <div className="relative space-y-[30px] lg:space-y-[50px]">
            <div
              className="relative z-10 border border-[#999] p-[25px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
              data-aos="fade-right"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div className="grid items-center gap-[30px] lg:gap-[0] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className="border-r-2">
                  <Image height={600} src={sala2} alt="sala" />
                </div>

                <div className="text-[#00000078] space-y-[15px] lg:pl-[30px] rtl:lg:pl-0 rtl:lg:pr-[30px] max-w-[496px]">
                  <p className="text-[20px]">
                    Offriamo un ambiente accogliente e stimolante per
                    l&apos;apprendimento delle arti marziali per tutte le età e
                    livelli di esperienza. Scopri il potere interiore e la
                    saggezza attraverso la pratica delle arti marziali. I nostri
                    corsi promuovono la salute, la forma fisica e
                    l&apos;equilibrio mentale per una vita migliore.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="relative z-10 border border-[#999] mb-[42px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
              data-aos="fade-left"
              data-aos-delay="200"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div className="grid items-center gap-[30px] lg:gap-[0] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className="text-[#00000078] space-y-[15px] xl:pl-[150px] rtl:xl:pl-0 rtl:xl:pr-[150px] max-w-[610px]">
                  <p className="text-[20px]">
                    Preparati a superare ogni sfida con la nostra palestra di
                    arti marziali. Allenati come un vero guerriero e coltiva
                    disciplina, fiducia e autodifesa e Scopri la tua forza
                    interiore e sviluppa abilità di autodifesa imbattibili con i
                    nostri esperti istruttori.
                  </p>
                </div>

                <div className="border-l-2">
                  <Image height={600} src={sala2} alt="sala" />
                </div>
              </div>
            </div>

            <div
              className="relative z-10 border p-[25px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <h1 className="text-white text-center text-[30px] sm:text-[40px] md:text-[50px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[15px] md:mb-[15px] lg:max-w-[700px] mx-auto">
                Galleria
              </h1>
              <div className="grid   items-center grid-cols-1 gap-[30px] lg:gap-[0] ">
                <Gallery gallery={gallery}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubGalleryPage;
