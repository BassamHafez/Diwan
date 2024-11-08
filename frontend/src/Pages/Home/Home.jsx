import Hero from "../../Components/Hero/Hero";
import MainTitle from "../../Components/UI/Words/MainTitle";

const Home = () => {
  return (
    <>
      <Hero />
      <section className="my-5">
        <div className="text-center">
          <MainTitle title="Features " />
          <h2 className="my-4">Why Choose Our Platform</h2>
          
        </div>
      </section>
    </>
  );
};

export default Home;
