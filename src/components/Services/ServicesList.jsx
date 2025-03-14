"use client";

import React from "react";
import { useParams } from "next/navigation";
import ServiceItem from "./ServiceItem";

// Images
import muay from "/public/images/classes/muay.jpg";
import kick from "/public/images/classes/luci_kick.jpeg";
import mma from "/public/images/classes/MMA.jpg";
import bjj from "/public/images/classes/bjj.jpg";
import box from "/public/images/classes/box.jpg";
import crossfit from "/public/images/classes/crossfit.jpg";

const classesData = [
  {
    id: 1,
    name: "Muay Thai",
    description:
      "Il Muay Thai, conosciuto anche come l'arte delle otto armi, è una disciplina marziale che unisce potenti colpi di pugno, calci, ginocchiate e gomitate per creare uno stile di combattimento completo e dinamico.",
    image: muay,
  },
  {
    id: 2,
    name: "KickBoxing",
    description:
      "Il Kickboxing è uno sport adrenalinico che combina tecniche di pugilato e calci acrobatici, offrendo una sfida fisica e mentale per coloro che cercano un allenamento intenso e una forma fisica straordinaria.",
    image: kick,
  },
  {
    id: 3,
    name: "MMA",
    description:
      "Le Arti Marziali Miste, o MMA, sono un combattimento che mette alla prova l'abilità e la forza di atleti provenienti da diverse discipline, come grappling, striking e sottomissioni, per determinare il combattente più completo.",
    image: mma,
  },
  {
    id: 4,
    name: "Grappling",
    description:`Il grappling è l'arte di dominio e strategia sul tatami. Ogni movimento è una danza di forza e tecnica, dove la precisione fa la differenza. In questo sport, il corpo diventa un'arma e una difesa, guidato dalla mente acuta e reattiva. Combatti non solo con la muscolatura, ma con la saggezza e l'intelligenza. Dominare il grappling significa eccellere nella sintesi perfetta di abilità e astuzia.    image: bjj`,
    image: bjj,
  },
  {
    id: 5,
    name: "Pugilato",
    description:
      "La Boxe è uno sport tradizionale che richiede disciplina, velocità, precisione e resistenza. Attraverso il pugilato, gli atleti sviluppano forza mentale e fisica, mentre affinano le loro abilità di combattimento. Inoltre, questo sport promuove la fiducia in se stessi e la capacità di superare le avversità.",
    image: box,
  },
  {
    id: 6,
    name: "Crossfit",
    description:
      "Il Crossfit è un metodo di allenamento ad alta intensità che combina elementi di sollevamento pesi, cardiovascolare e ginnastica. Questo approccio versatile all'allenamento promuove la forza, l'agilità e la resistenza, aiutando gli atleti a raggiungere la forma fisica ottimale.",
    image: crossfit,
  },
];

const ServicesList = () => {
  const { lang } = useParams();

  return (
    <div className="py-[50px] md:py-[60px] lg:py-[140px]">
      <div className="container mx-auto">
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="500"
          data-aos-once="true"
          className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        >
          {classesData.map((service, index) => (
            <ServiceItem key={index} lang={lang} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
