import type {MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Us - KickVibes'},
    {name: 'description', content: 'Get in touch with KickVibes South Africa. We\'re here to help with your sneaker needs.'},
  ];
};

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            We're here to help you find the perfect kicks. 
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <h2>📍 Visit Our Store</h2>
              <p>
                <strong>KickVibes South Africa</strong><br />
                123 Long Street<br />
                Cape Town, Western Cape 8001<br />
                South Africa
              </p>
            </div>

            <div className="contact-card">
              <h2>📞 Call Us</h2>
              <p>
                <strong>Phone:</strong> +27 21 123 4567<br />
                <strong>WhatsApp:</strong> +27 82 123 4567<br />
                <strong>Hours:</strong> Mon-Fri 9AM-6PM, Sat 9AM-4PM
              </p>
            </div>

            <div className="contact-card">
              <h2>✉️ Email Us</h2>
              <p>
                <strong>General:</strong> info@kickvibes.co.za<br />
                <strong>Support:</strong> support@kickvibes.co.za<br />
                <strong>Orders:</strong> orders@kickvibes.co.za
              </p>
            </div>


          </div>


        </div>


      </div>
    </div>
  );
}
