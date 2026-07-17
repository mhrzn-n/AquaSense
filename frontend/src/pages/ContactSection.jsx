import { useState } from "react";
import Container from "../components/Container";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", form);
    alert("Thank you! We will contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Container>
      <section id="contact" className="w-full py-12 md:py-20  min-h-[85vh] flex items-center">
        <div className="max-w-2xl px-4 mx-auto text-center">
          <h3 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
            Contact Us
          </h3>

          <p className="mb-8 text-gray-600">
            Have questions or feedback? We’d love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              required
            ></textarea>

            <button
              type="submit"
              className="px-6 py-3 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </Container>
  );
};

export default ContactSection;
