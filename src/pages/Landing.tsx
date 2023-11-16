import { Header } from "../components/LandingHeader/Header";
import { HeroSlider } from "../components/Hero slider/HeroSlider";
import AboutUs from "../components/Landing/About us/AboutUs";
import AcademicSupport from "../components/Landing/Academic Support/AcademicSupport";
import ContactUs from "../components/Landing/Contact us/ContactUs";
import QuestionsAnswers from "../components/Landing/Questions & Answers/QuestionsAnswers";
import Footer from "../components/Footer/Footer";

export const Landing = () => {
  return (
    <div className="landing-container">
      <Header />
      <HeroSlider />
      <AboutUs />
      <AcademicSupport />
      <QuestionsAnswers />
      <ContactUs />
      <Footer />
    </div>
  );
};
