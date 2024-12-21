import { useEffect } from "react";
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";
import AOS from "aos";

import Hero from "../../Components/Hero/Hero";
import MainTitle from "../../Components/UI/Words/MainTitle";

import Packages from "../Packages/Packages";
import HomeTestimonalsSlider from "./HomeTestimonalsSlider";
import ButtonTwo from "../../Components/UI/Buttons/ButtonTwo";
import About from "../About/About";
import Contact from "../Contact/Contact";
import ScrollTopBtn from "../../Components/UI/Buttons/ScrollTopBtn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { t: key } = useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const role = useSelector((state) => state.userInfo.role);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  useEffect(() => {
    if (isLogin) {
      if (role === "user") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    }
  });

  return (
    <>
      <ScrollTopBtn />
      <Hero />
      <About />
      <section className="my-5 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("packages")} />
          <h2 className="mb-5 mt-3 fw-bold">{key("choosePackage")}</h2>
          <Packages />
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.Testimonials}>
        <MainTitle title={key("testimonials")} />
        <HomeTestimonalsSlider />
        <div className="text-center">
          <ButtonTwo text={key("rateUs")} />
        </div>
      </section>
      <div data-aos="fade-up" data-aos-duration="1000" className="my-5">
        <Contact />
      </div>
    </>
  );
};

export default Home;
