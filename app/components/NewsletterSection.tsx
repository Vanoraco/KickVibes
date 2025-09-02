import { useState } from 'react';
import type { NewsletterSettings } from '~/lib/metaobjects/newsletter-settings';
import { DEFAULT_NEWSLETTER_SETTINGS } from '~/lib/metaobjects/newsletter-settings';

export function NewsletterSection({
  newsletterSettings
}: {
  newsletterSettings?: NewsletterSettings
}) {
  // Use provided settings or fallback to default
  const settings = newsletterSettings || DEFAULT_NEWSLETTER_SETTINGS;
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

  // Don't render if not active
  if (!settings.isActive) {
    return null;
  }

  return (
    <section
      className="newsletter-section"
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
      }}
    >
      <div className="newsletter-container">
        {!isSubscribed ? (
          <div className="newsletter-content">
            <h2 className="newsletter-title">{settings.title}</h2>
            <p className="newsletter-description">
              {settings.description}
            </p>

            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={settings.placeholderText || 'Enter your email'}
                  className="newsletter-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  disabled={isLoading || !email}
                  style={{
                    backgroundColor: settings.buttonColor,
                  }}
                >
                  {isLoading ? (settings.loadingText || 'Subscribing...') : settings.buttonText}
                </button>
              </div>
            </form>

            {settings.showPrivacyText && settings.privacyText && (
              <p className="newsletter-privacy">
                {settings.privacyText}
              </p>
            )}
          </div>
        ) : (
          <div className="newsletter-success">
            <h3 className="newsletter-success-title">{settings.successTitle}</h3>
            <p className="newsletter-success-message">
              {settings.successMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
