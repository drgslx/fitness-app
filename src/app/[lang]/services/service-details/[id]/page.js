"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import Image from "next/image";

// Import images
import muay from "/public/images/classes/muay.jpg";
import kick from "/public/images/classes/luci_kick.jpeg";
import mma from "/public/images/classes/MMA.jpg";
import bjj from "/public/images/classes/bjj.jpg";
import box from "/public/images/classes/box.jpg";
import crossfit from "/public/images/classes/crossfit.jpg";

// Services data
const classDetails = [
  {
    id: 1,
    name: "Muay Thai",
    description: `La disciplina Muay Thai è nota come l'arte delle otto armi o la scienza degli otto arti perché consente ai due contendenti che si sfidano di utilizzare combinazioni di pugni, calci, gomitate e ginocchiate, quindi otto parti del corpo utilizzate come punti di contatto rispetto ai due del`,

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
    name: "BJJ",
    description:
      "Il Brazilian Jiu-Jitsu, noto anche come BJJ, è una forma di lotta a terra che si concentra sull'utilizzo di leve, sottomissioni e posizioni strategiche per sconfiggere un avversario più forte, dimostrando che la tecnica può superare la forza fisica.",
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

const ServiceDetailsPage = ({ params: { lang, id } }) => {
  const [service, setService] = useState(null);

  useEffect(() => {
    if (id) {
      const foundService = classDetails.find(
        (service) => service.id === parseInt(id)
      );
      setService(foundService);
    }
  }, [id]);

  if (!service) {
    return <p>Caricamento...</p>;
  }

  return (
    <>
      <PageBannerTitle
        title={service.name}
        homeText="Home"
        homeUrl={`/${lang}`}
        image="/images/shape1.jpg"
        image2="/images/shape2.jpg"
        image3="/images/shape3.jpg"
        image4="/images/shape4.jpg"
      />

      <div className="bg-black">
        <div className="container mx-auto py-[50px] md:py-[60px] lg:py-[140px]">
          <h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
            {service.name}
          </h3>
          <div className="relative pt-[20px] pl-[20px]">
            <Image src={service.image} alt={service.name} />
          </div>
          <div className="pl-[25px] pt-[25px]">
            <p className="mb-[25px]">{service.description}</p>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default ServiceDetailsPage;
