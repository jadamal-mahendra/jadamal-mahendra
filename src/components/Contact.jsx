import { createElement, useRef } from "react";
import { content } from "../Content";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
// Import Lucide icons if needed for social links (already imported in Content.js)

const Contact = () => {
  const { Contact } = content;
  const form = useRef();

  // Sending Email
  const sendEmail = (e) => {
    e.preventDefault();

    // IMPORTANT: Replace with your actual EmailJS Service ID, Template ID, and Public Key
    const serviceId = "service_3wiqat4"; // Replace with your Service ID
    const templateId = "template_eflkmpl"; // Replace with your Template ID
    const publicKey = "Mv6JRTa_Bdyfoa6cx"; // Replace with your Public Key (User ID)

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        (result) => {
          console.log("EmailJS Success:", result.text);
          form.current.reset();
          toast.success("Message sent successfully!");
        },
        (error) => {
          console.error("EmailJS Error:", error.text);
          toast.error(`Failed to send message: ${error.text || 'Unknown error'}`);
        }
      );
  };

  return (
    <section className="section-padding contact-section" id="contact">
      <Toaster position="top-right" />
      <div className="contact-grid container mx-auto">
        <h2 className="section-title">
          {Contact.title}
        </h2>
        <h4 className="section-subtitle">
          {Contact.subtitle}
        </h4>
        
        <form
          ref={form}
          onSubmit={sendEmail}
          className="contact-form"
        >
          <div>
            <label htmlFor="from_name" className="form-label-sr">Name</label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              placeholder="Your Name"
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="user_email" className="form-label-sr">Email</label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              placeholder="Your Email Address"
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="message" className="form-label-sr">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows="5"
              className="form-textarea"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn"
          >
            Send Message
          </button>
        </form>
        
        <div className="contact-info">
          {Contact.social_media.map((item, i) => (
            <div key={i} className="contact-item">
               <div className="contact-icon">
                 {createElement(item.icon, { size: 24 })}
               </div>
               <div>
                 <a 
                   href={item.link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="contact-link"
                 >
                   {item.text}
                 </a>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
