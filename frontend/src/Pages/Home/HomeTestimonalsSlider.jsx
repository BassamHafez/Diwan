import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./HomeTestimonalsSlider.module.css";
import AOS from "aos";
import like_emotion from "../../assets/emotion_like.png";
import love_emotion from "../../assets/emotion_love.png";
import dislike_emotion from "../../assets/emotion_dislike.png";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import LoadingOne from "../../Components/UI/Loading/LoadingOne";
import TestimonialItem from "../../Components/TestimonialItem/TestimonialItem";

const HomeTestimonalsSlider = () => {
  
  const { data, isFetching } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => mainFormsHandlerTypeRaw({ type: "testimonials",isLimited:true}),
    staleTime: Infinity,
  });

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  });

  return (
    <>
      {!data || (isFetching && <LoadingOne />)}
      {data?.data?.length > 0 ? (
        <>
          <div className={styles.like_emotion}>
            <img src={like_emotion} alt="like_emotion" className="w-100" />
          </div>
          <div className={styles.love_emotion}>
            <img src={love_emotion} alt="love_emotion" className="w-100" />
          </div>
          <div className={styles.dislike_emotion}>
            <img
              src={dislike_emotion}
              alt="dislike_emotion"
              className="w-100"
            />
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
          >
            {data?.data?.map((content) => (
              <SwiperSlide key={content?._id} className={styles.slide}>
                <TestimonialItem content={content} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : null}
    </>
  );
};

export default HomeTestimonalsSlider;
