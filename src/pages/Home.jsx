import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Welcome to TexTrack</h1>
          <p>Your AI-powered textile fabric platform.</p>
          <Link to="/products">
            <button className="btn hero-btn">Explore Fabrics</button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-container">
          <h2>About TexTrack</h2>
          <p>
            TexTrack is a platform dedicated to bringing you the finest textile fabrics—cotton, silk, wool, linen, scarves, and home textiles. Our mission is to provide an AI-powered, intuitive experience to explore, track, and purchase high-quality fabrics with ease.
          </p>
          <img
            src="https://i.pinimg.com/736x/10/03/b2/1003b29b605cc204932a9ab773f161b8.jpg"
            alt="Textile Fabrics"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>How do I browse textile products?</h3>
            <p>Explore different fabric categories from the Products page and use the search bar to find specific fabrics.</p>
          </div>
          <div className="faq-card">
            <h3>How can I track my orders?</h3>
            <p>Once logged in, visit the Orders page to see all placed orders and their status.</p>
          </div>
          <div className="faq-card">
            <h3>Can I add multiple fabrics to the cart?</h3>
            <p>Yes, you can add as many fabrics as you like and checkout at once.</p>
          </div>
          <div className="faq-card">
            <h3>Do you provide international shipping?</h3>
            <p>Currently, we provide shipping within India, but international shipping will be available soon.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>Reach out for queries, feedback, or collaborations.</p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required></textarea>
          <button type="submit" className="btn">Send Message</button>
        </form>
      </section>

      {/* Footer */}
     <footer className="footer">
  <div className="footer-container">

    <div className="footer-brand">
      <h3>TexTrack</h3>
      <p>
        AI-powered textile discovery platform helping you explore premium fabrics
        with intelligence and style.
      </p>

      <div className="footer-social">
        <span>🌐</span>
        <span>📸</span>
        <span>💼</span>
      </div>
    </div>

    <div className="footer-links">
      <h4>Quick Links</h4>
      <a href="#hero">Home</a>
      <Link to="/products">Products</Link>
      <a href="#about">About</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </div>

    <div className="footer-platform">
      <h4>Platform</h4>
      <p>AI Fabric Intelligence</p>
      <p>Secure Order Tracking</p>
      <p>Modern UI Experience</p>
      <p>Built with Firebase</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 TexTrack • Designed by Sravanthi Kondaviti
  </div>
</footer>
    </div>
  );
}

export default Home;