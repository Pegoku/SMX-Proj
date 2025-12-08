import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Professional Services for Your Needs
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            We provide top-notch solutions to help your business grow.
          </p>
          <a
            href="#contact"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Consulting", desc: "Expert advice to optimize your strategy." },
            { title: "Development", desc: "Custom software solutions built for you." },
            { title: "Support", desc: "24/7 maintenance and technical support." },
          ].map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Ready to start a project? Fill out the form below and we'll get back to you.
            </p>
          </div>
          
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} SMX Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
