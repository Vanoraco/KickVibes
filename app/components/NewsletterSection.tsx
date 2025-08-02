import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        {!isSubscribed ? (
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-description">
              Get notified about new releases and exclusive offers.
            </p>

            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>

            <p className="newsletter-privacy">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        ) : (
          <div className="newsletter-success">
            <h3 className="newsletter-success-title">Thank you!</h3>
            <p className="newsletter-success-message">
              You've been successfully subscribed to our newsletter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
