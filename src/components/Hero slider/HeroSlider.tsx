import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useState, useEffect } from "react";
import "./hero-slider.css";

export const HeroSlider = () => {
  const slidesNumber = 4; // In case you want to update the number of slides (add or remove images), all you have to do is updating this variable
  // Notice: all images should be labeled as: "slide (slide's index)", taking into consideration that it's one-based indexed.

  const [currentSlide, setCurrentSlide] = useState(1); // to set the index of the current slide
  const [firstSlide, setFirstSlide] = useState(true); // to fix the first slide issue (transition isn't working)
  const [textTransition, setTextTransition] = useState(false); // to make a small text animation for the first render

  // create slides by pushing the images into an array and returning it
  const creactSlides = (numberOfSlides: number) => {
    const slidesContainer = [];
    for (let i = 1; i <= numberOfSlides; i++) {
      slidesContainer.push(
        <img
          src={`/images/slider/slide ${i}.jpg`}
          style={{
            left: `${(i - 1) * 100}%`,
          }}
          className={`background ${i === currentSlide ? `active` : ``} ${
            i === 1 && firstSlide ? `beginning` : ``
          }`}
          key={i}
        />
      );
    }
    return slidesContainer;
  };

  // create bullets by pushing them into an array and returning it
  const createBullets = (numberOfBullets: number) => {
    const bulletsContainer = [];
    for (let i = 1; i <= numberOfBullets; i++) {
      bulletsContainer.push(
        <li
          key={i}
          className={i === currentSlide ? `active` : ``}
          onClick={() => {
            setFirstSlide(false); // to broke the animation of the first slide and make it like the others (using the transition property)
            setCurrentSlide(i);
          }}
        ></li>
      );
    }
    return bulletsContainer;
  };

  // update the current slide by clicking left or right arrow
  const updateSlider = (toLeft: boolean) => {
    if (toLeft) {
      if (currentSlide === 1)
        return; // it means that the current slide is the first one, so we need to prevent sliding to the left
      else setCurrentSlide((currentSlide) => currentSlide - 1);
    } else {
      if (currentSlide === slidesNumber)
        return; // it means that the current slide is the last one, so we need to prevent sliding to the right
      else {
        setFirstSlide(false); // to broke the animation of the first slide and make it like the others (using the transition property)
        setCurrentSlide((currentSlide) => currentSlide + 1);
      }
    }
  };

  useEffect(() => {
    setTextTransition(true); // to start the text transition when the first render process is done
    const timer = setInterval(
      () =>
        setCurrentSlide((current) => {
          setFirstSlide(false); // to broke the animation of the first slide and make it like the others (using the transition property)
          if (current < slidesNumber) return current + 1;
          else return 1; // current slide index isn't less than slides number => the current slide is the last one, so take me to the first slide again
        }),
      5000 // sliding process will take place every 5s.
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing section" id="Home">
      <div className="wrapper">
        <div
          className="slider"
          style={{ left: `-${(currentSlide - 1) * 100}%` }}
        >
          {creactSlides(slidesNumber) as React.ReactNode}
        </div>
        <div className="fixed-background"></div>
      </div>
      <div className="desc">
        <div className={`text ${textTransition ? `active` : ``}`}>
          <h1 className="heading">Ma'rifah</h1>
          <p>
            "Elevate your education with personalized learning. Your path to
            academic success starts here."
          </p>
        </div>
      </div>
      <ArrowLeft
        size={50}
        className="arrow-left"
        onClick={() => updateSlider(true)}
      />
      <ArrowRight
        size={50}
        className="arrow-right"
        onClick={() => updateSlider(false)}
      />
      <ul className="bullets">
        {createBullets(slidesNumber) as React.ReactNode}
      </ul>
    </div>
  );
};
