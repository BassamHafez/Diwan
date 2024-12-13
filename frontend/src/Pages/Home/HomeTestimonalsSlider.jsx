import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./HomeTestimonalsSlider.module.css";

import person1 from "../../assets/p1.jpeg";
import person2 from "../../assets/p2.jpeg";
import person3 from "../../assets/p3.jpeg";
import person4 from "../../assets/p4.jpg";
import person5 from "../../assets/p5.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import like_emotion from "../../assets/emotion_like.png";
import love_emotion from "../../assets/emotion_love.png";
import dislike_emotion from "../../assets/emotion_dislike.png";

const HomeTestimonalsSlider = () => {
    
  useEffect(() => {
    AOS.init({disable: 'mobile'});;
  });

  return (
    <>
      <div className={styles.like_emotion}>
        <img src={like_emotion} alt="like_emotion" className="w-100" />
      </div>
      <div className={styles.love_emotion}>
        <img src={love_emotion} alt="love_emotion" className="w-100" />
      </div>
      <div className={styles.dislike_emotion}>
        <img src={dislike_emotion} alt="dislike_emotion" className="w-100" />
      </div>
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: true,
        }}
        loop={true}
        navigation={true}
        modules={[Navigation, Autoplay]}
        className={`${styles.Swiper_container} mySwiper`}
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        dir="ltr"
      >
        <SwiperSlide className={styles.slide}>
          <div className={styles.slide_content}>
            <div className={`${styles.slide_header} d-flex align-items-center`}>
              <img src={person1} className={`${styles.person}`} alt="person" />
              <div
                className={`${styles.slide_header_caption} d-flex flex-column  ms-3`}
              >
                <h5 className={styles.person_name}>Ahmed Tarek</h5>
                <span className={styles.person_date}>Real Estate Investor</span>
              </div>
              <div
                className={`${styles.five_starts} d-flex justify-content-between ms-auto`}
              >
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
              </div>
            </div>
            <div className={styles.person_comment}>
              <p>
                Using this platform has completely transformed how I manage my
                properties. The smart dashboard and automated payment features
                save me so much time every month. Highly recommended!
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div className={styles.slide_content}>
            <div className={`${styles.slide_header} d-flex align-items-center`}>
              <img src={person4} className={`${styles.person}`} alt="person" />

              <div
                className={`${styles.slide_header_caption} d-flex flex-column  ms-3`}
              >
                <h5 className={styles.person_name}>Ramy Gamal</h5>
                <span className={styles.person_date}>Property Manager</span>
              </div>
              <div
                className={`${styles.five_starts} d-flex justify-content-between ms-auto`}
              >
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
              </div>
            </div>
            <div className={styles.person_comment}>
              <p>
                I have tried several property management tools, but this one
                stands out for its ease of use and powerful features. The
                customer support team is also fantastic. It is been a
                game-changer for my business!
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div className={styles.slide_content}>
            <div className={`${styles.slide_header} d-flex align-items-center`}>
              <img src={person3} className={`${styles.person}`} alt="person" />
              <div
                className={`${styles.slide_header_caption} d-flex flex-column  ms-3`}
              >
                <h5 className={styles.person_name}>Hazem Amr</h5>
                <span className={styles.person_date}>Landlord</span>
              </div>
              <div
                className={`${styles.five_starts} d-flex justify-content-between ms-auto`}
              >
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
              </div>
            </div>
            <div className={styles.person_comment}>
              <p>
                This platform has streamlined my entire workflow. From tracking
                tenant payments to generating financial reports, everything is
                just a few clicks away. I could not be happier with the service
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div className={styles.slide_content}>
            <div className={`${styles.slide_header} d-flex align-items-center`}>
              <img src={person5} className={`${styles.person}`} alt="person" />
              <div
                className={`${styles.slide_header_caption} d-flex flex-column  ms-3`}
              >
                <h5 className={styles.person_name}>Kareem Taha</h5>
                <span className={styles.person_date}>Rental Property Owner</span>
              </div>
              <div
                className={`${styles.five_starts} d-flex justify-content-between ms-auto`}
              >
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
              </div>
            </div>
            <div className={styles.person_comment}>
              <p>
                The automated rent collection system has been a lifesaver! I
                never have to worry about late payments anymore. The efficiency
                this platform offers is unmatched
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div className={styles.slide_content}>
            <div className={`${styles.slide_header} d-flex align-items-center`}>
              <img src={person2} className={`${styles.person}`} alt="person" />
              <div
                className={`${styles.slide_header_caption} d-flex flex-column  ms-3`}
              >
                <h5 className={styles.person_name}>Dr.Amr Eid</h5>
                <span className={styles.person_date}>First-Time Landlord</span>
              </div>
              <div
                className={`${styles.five_starts} d-flex justify-content-between ms-auto`}
              >
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
                <FontAwesomeIcon icon={faStar} className="color-main" />
              </div>
            </div>
            <div className={styles.person_comment}>
              <p>
                As someone new to property management, this tool has been
                incredibly intuitive. It made managing contracts, tenants, and
                finances so much easier. I wish I had found it sooner!
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default HomeTestimonalsSlider;
