import { Header } from "../components/Header/Header";
import { HeroSlider } from "../components/Hero slider/HeroSlider";
import AboutUs from "../components/Landing/About us/AboutUs";

export const Landing = () => {
  return (
    <div>
      <Header />
      <HeroSlider />
      <AboutUs />
    </div>
  );
};
