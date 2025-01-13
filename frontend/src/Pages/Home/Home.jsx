import styles from "./Home.module.css";
import AOS from "aos";
import Packages from "../Packages/Packages";
import About from "../About/About";
import Contact from "../Contact/Contact";
import {
  useSelector,
  useNavigate,
  useTranslation,
  useEffect,
} from "../../shared/hooks";
import {
  MainTitle,
  HomeTestimonalsSlider,
  ScrollTopBtn,
  Hero,
} from "../../shared/components";

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

      <section className={styles.Testimonials}>
        <MainTitle title={key("testimonials")} />
        <HomeTestimonalsSlider />
      </section>
      <div data-aos="fade-up" data-aos-duration="1000" className="my-5">
        <Contact />
      </div>
    </>
  );
};

export default Home;
