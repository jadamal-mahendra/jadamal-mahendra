import { createElement, useRef } from "react";
import { content } from "../Content";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import styles from './Contact.module.css'; // Import CSS Module
import { Helmet } from 'react-helmet-async'; // Import Helmet
// Import Lucide icons if needed for social links (already imported in Content.js)

const Contact = () => {
  const { Contact: contactData } = content;
  const form = useRef();

  // Sending Email
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // Access from env
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          // Clear inputs
          form.current.reset();
          toast.success("Your message has been sent successfully! I'll get back to you soon.");
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send email. Please try again later.");
        }
      );
  };

  return (
    <section className={`${styles.contactSection} section-padding`} id="contact">
      <Helmet>
        <title>Contact Jadamal Mahendra</title>
        <meta name="description" content="Get in touch with Jadamal Mahendra for web development projects or collaborations. Contact via email, phone, or LinkedIn." />
      </Helmet>
      <Toaster />
      <div className="container">
        <h2 className="section-title" data-aos="fade-down">
          {contactData.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-down">
          {contactData.subtitle}
        </h4>
        <br />
        <div className={styles.contactGrid}>
          {/* Contact Info */}
          <div className={styles.contactInfo} data-aos="fade-right">
            {contactData.social_media.map((item, i) => (
              <div key={i} className={styles.infoItem}>
                 <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.infoIcon}>
                   {createElement(item.icon)}
                 </a>
                 <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.infoText}>
                   {item.text}
                 </a>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className={styles.contactForm}
            data-aos="fade-left"
          >
            <div className={styles.formGroup}>
              <label htmlFor="from_name" className={styles.formLabelSr}>Name</label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                placeholder="Your Name"
                required
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="user_email" className={styles.formLabelSr}>Email</label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                placeholder="Your Email Address"
                required
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabelSr}>Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                className={`${styles.formControl} ${styles.textarea}`}
                required
              ></textarea>
            </div>
            <button type="submit" className={`${styles.formButton} btn`}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
