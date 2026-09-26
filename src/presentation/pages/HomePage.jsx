import { DEFAULT_SEO, useSeo } from '../hooks/useSeo';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Pillars } from '../components/sections/Pillars';
import { Experiences } from '../components/sections/Experiences';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Schedule } from '../components/sections/Schedule';
import { Mentors } from '../components/sections/Mentors';
import { Faq } from '../components/sections/Faq';
import { FinalCta } from '../components/sections/FinalCta';

// Landing page: composes the public sections in reading order.
export default function HomePage() {
  useSeo(DEFAULT_SEO);

  return (
    <>
      <Hero />
      <About />
      <Pillars />
      <Experiences />
      <HowItWorks />
      <Schedule />
      <Mentors />
      <Faq />
      <FinalCta />
    </>
  );
}
