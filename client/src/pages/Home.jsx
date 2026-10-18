import { useMemo, useState } from 'react';
import { useCategories, useFetch } from '../hooks';
import { FINISHES } from '../content';
import useHomeMotion from '../features/home/useHomeMotion.js';
import HeroSection from '../features/home/components/HeroSection.jsx';
import MarqueeSection from '../features/home/components/MarqueeSection.jsx';
import CategorySection from '../features/home/components/CategorySection.jsx';
import SectorsSection from '../features/home/components/SectorsSection.jsx';
import FeaturedSection from '../features/home/components/FeaturedSection.jsx';
import FinishesSection from '../features/home/components/FinishesSection.jsx';
import StepsSection from '../features/home/components/StepsSection.jsx';
import FaqSection from '../features/home/components/FaqSection.jsx';
import ContactCtaSection from '../features/home/components/ContactCtaSection.jsx';

export default function Home() {
  const { data: cats, error: categoriesError } = useCategories();
  const featured = useFetch('/products?featured=1&limit=60', []).data?.items || [];
  const [sector, setSector] = useState(0);
  const [tab, setTab] = useState('chairs');
  const [finish, setFinish] = useState(FINISHES[0].slug);
  const tabProducts = useFetch(`/products?category=${tab}&limit=8`, [tab]);
  const covers = useMemo(() => {
    const leafToRoot = {};
    cats.forEach((root) => {
      leafToRoot[root.slug] = root.slug;
      root.children.forEach((child) => { leafToRoot[child.slug] = root.slug; });
    });
    const out = {};
    featured.forEach((product) => {
      const root = leafToRoot[product.category?.slug];
      if (root && !out[root]) out[root] = product;
    });
    return out;
  }, [cats, featured]);

  const cutlery = FINISHES.map((item) => ({ ...item, product: featured.find((p) => p.category?.slug === item.slug) }));
  const selectedFinish = cutlery.find((item) => item.slug === finish) || cutlery[0];

  useHomeMotion(setSector);

  return (
    <>
      <HeroSection />

      <MarqueeSection />

      <CategorySection cats={cats} covers={covers} categoriesError={categoriesError} />

      <SectorsSection sector={sector} />

      <FeaturedSection tab={tab} setTab={setTab} tabProducts={tabProducts} />

      <FinishesSection finish={finish} setFinish={setFinish} selectedFinish={selectedFinish} />

      <StepsSection />

      <FaqSection />

      <ContactCtaSection />
    </>
  );
}
