import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "../../config/featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-6 md:py-10 lg:py-18">
        <div className="container">
          <SectionTitle
            title="Unsere Leistungen"
            paragraph=""
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
