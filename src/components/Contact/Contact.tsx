import React, { useRef, createElement } from "react";
import { content } from "@/config/content";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import styles from './Contact.module.css'; // Import CSS Module
import { Helmet } from 'react-helmet-async'; // Import Helmet
// Import types
import { ContactContent, SocialMediaItem } from "@/types/content";
// Import Lucide icons if needed for social links (already imported in Content.js)

const Contact: React.FC = () => {
  // Use imported type for content destructuring
  const { Contact: contactData }: { Contact: ContactContent } = content;
  const form = useRef<HTMLFormElement>(null);

  // Define environment variables (ensure they are string or undefined)
  const serviceId: string | undefined = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId: string | undefined = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey: string | undefined = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Sending Email
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if environment variables and form ref are available
    if (!serviceId || !templateId || !publicKey) {
      toast.error("Email configuration is missing. Please contact support.");
      console.error("EmailJS configuration environment variables not set.");
      return;
    }
    if (!form.current) {
      toast.error("An error occurred with the form. Please refresh and try again.");
      console.error("Contact form ref is not set.");
      return;
    }

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        (result) => {
          console.log('EmailJS Success:', result.text);
          form.current?.reset(); // Use optional chaining for reset
          toast.success("Your message has been sent successfully! I'll get back to you soon.");
        },
        (error) => {
          console.error('EmailJS Error:', error.text);
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
            {contactData.social_media.map((item: SocialMediaItem, i: number) => (
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
