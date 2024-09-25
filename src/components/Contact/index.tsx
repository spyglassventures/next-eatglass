import NewsLatterBox from "./NewsLatterBox";
import ContactText from "./ContactText";
// import ContactForm from "./ContactForm";

const Contact = () => {

  return (
    <section id="contact" className="overflow-hidden py-6 md:py-10 lg:py-18">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <ContactText />
            {/* <ContactForm /> */}
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
