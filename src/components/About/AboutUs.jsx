"use client";

import React from "react";
import Image from "next/image";

import about from "/public/images/online-training-coach/about.jpg";

const AboutUs = () => {
  return (
    <>
      <div className="container mx-auto overflow-hidden">
        <div className="bg-[#C84B2F]  px-[20px] md:px-[60px] lg:px-[80px] xl:px-[120px] pt-[42px] md:pt-[60px] lg:pt-[140px] 2xl:pt-[42px]">
          <div>
            <div className="lg:flex items-center mb-[20px] md:mb-[30px] space-y-[30px] lg:space-y-[0] lg:space-x-[50px] rtl:space-x-reverse">
              <Image
                className="rounded-[10px]"
                height={300}
                src={about}
                alt="about"
                data-aos="fade-in"
                data-aos-delay="100"
                data-aos-duration="500"
                data-aos-once="true"
              />

              <h2
                className="text-[white] text-[30px] md:text-[40px] lg:text-[45px] xl:text-[50px] 2xl:text-[75px] font-bold leading-[1.2] lg:leading-none"
                data-aos="fade-in"
                data-aos-delay="200"
                data-aos-duration="500"
                data-aos-once="true"
              >
                La storia dietro la nostra accademia sportiva
              </h2>
            </div>

            <div
              className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[whiteBF]  ml-auto space-y-[15px]"
              data-aos="fade-in"
              data-aos-delay="300"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <p>
                Qui, ci dedichiamo a una gamma completa di discipline per coloro
                che vogliono eccellere nelle arti marziali e nel fitness.
                Offriamo un programma completo che include CrossFit, Muay Thai,
                Kickboxing, Boxe e naturalmente MMA. Ogni allenamento è
                progettato per chi è determinato a superare i propri limiti e
                diventare il migliore in tutte le discipline che offriamo.{" "}
              </p>
              <br />
              <p>
                Le nostre lezioni di Muay Thai, Kickboxing e Boxe sono tenute da
                istruttori esperti che ti guideranno attraverso ogni colpo,
                calcio e combinazione, assicurandoti di acquisire la tecnica e
                la potenza necessarie per eccellere. Non ci limitiamo a una
                singola disciplina perché crediamo nella formazione completa
                dell’atleta. Il CrossFit, con i suoi allenamenti ad alta
                intensità, è pensato per chi vuole sviluppare forza, resistenza
                e agilità.{" "}
              </p>
              <br />
              <p>
                A Ultimate Arena, ogni disciplina è un tassello fondamentale del
                percorso che offriamo. Il nostro obiettivo è fornire un ambiente
                in cui ogni atleta possa perfezionare le proprie abilità,
                indipendentemente dallo sport scelto. Che tu voglia migliorare
                la tua forma fisica con il CrossFit, affinare le tue abilità di
                combattimento con il Muay Thai e il Kickboxing, o diventare un
                esperto di MMA, troverai tutto il supporto e le risorse di cui
                hai bisogno per raggiungere i tuoi obiettivi.
              </p>
            </div>
          </div>

          <div className=" py-[50px] md:py-[60px] lg:py-[140px]">
            <div className="grid gap-[30px] grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
              <div
                data-aos="fade-in"
                data-aos-delay="100"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <h2 className="text-[white] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
                  138
                </h2>
                <p className="text-[white]">5 stars reviews</p>
              </div>

              <div
                data-aos="fade-in"
                data-aos-delay="200"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <h2 className="text-[white] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
                  42
                </h2>
                <p className="text-[white]">Studenti</p>
              </div>

              <div
                data-aos="fade-in"
                data-aos-delay="300"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <h2 className="text-[white] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
                  6
                </h2>
                <p className="text-[white]">Istruttori</p>
              </div>

              <div
                data-aos="fade-in"
                data-aos-delay="400"
                data-aos-duration="500"
                data-aos-once="true"
              >
                <h2 className="text-[white] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
                  12
                </h2>
                <p className="text-[white]">International titles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
