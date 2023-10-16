import { About } from "../components/About/About";
import { Header } from "../components/Header/Header";
import { HeroSlider } from "../components/Hero slider/HeroSlider";

export const Landing = () => {
  return (
    <div>
      <Header />
      <HeroSlider />
      <About />
    </div>
  );
};
