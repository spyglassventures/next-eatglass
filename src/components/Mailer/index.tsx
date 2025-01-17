import NewsLatterBox from "../Contact/NewsLatterBox";

import ContactForm from "./ContactForm"; // Name, Email, Text Forms
import BookDemoForm from "./BookDemoForm";

const Contact = () => {

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            {/* <ContactText /> */}
            <ContactForm />
            <BookDemoForm />
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            {/* <NewsLatterBox /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
// export default BookDemoForm;
