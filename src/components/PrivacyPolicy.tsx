import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to OSSIdeas ("we," "our," or "us"). We are committed to
                protecting your privacy and ensuring you have a positive
                experience on our platform. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website and use our services.
              </p>
              <p className="text-gray-700">
                OSSIdeas is a platform that helps users discover startup
                opportunities based on open source projects. By using our
                service, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Name and email address when you create an account</li>
                <li>Profile information including avatar and preferences</li>
                <li>Authentication data when you sign in with Google OAuth</li>
                <li>Payment information when you subscribe to our services</li>
                <li>Communication preferences and settings</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.2 Usage Information
              </h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information about your use of
                our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Pages visited and features used</li>
                <li>Search queries and filtering preferences</li>
                <li>Ideas saved and interactions with content</li>
                <li>Device information and browser type</li>
                <li>IP address and general location data</li>
                <li>Time spent on different sections of the platform</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.3 Technical Information
              </h3>
              <p className="text-gray-700 mb-4">
                We collect technical information to improve our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Log files and error reports</li>
                <li>Performance metrics and analytics data</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Device identifiers and browser settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Provide Services:</strong> To deliver our platform
                  features and maintain your account
                </li>
                <li>
                  <strong>Personalization:</strong> To customize your experience
                  and show relevant content
                </li>
                <li>
                  <strong>Communication:</strong> To send you updates,
                  newsletters, and support messages
                </li>
                <li>
                  <strong>Payment Processing:</strong> To handle subscriptions
                  and billing through Stripe
                </li>
                <li>
                  <strong>Analytics:</strong> To understand usage patterns and
                  improve our platform
                </li>
                <li>
                  <strong>Security:</strong> To protect against fraud and ensure
                  platform security
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To meet legal obligations
                  and enforce our terms
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We work with trusted third-party service providers:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>
                  <strong>Supabase:</strong> For database storage and
                  authentication
                </li>
                <li>
                  <strong>Stripe:</strong> For payment processing and
                  subscription management
                </li>
                <li>
                  <strong>Google:</strong> For OAuth authentication (when you
                  choose to sign in with Google)
                </li>
                <li>
                  <strong>Analytics Services:</strong> To understand platform
                  usage and performance
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law or to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Comply with legal processes or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Prevent fraud or security threats</li>
                <li>Enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and authorization systems</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
                <li>Monitoring for suspicious activities</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the internet is 100%
                secure. While we strive to protect your information, we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal
                information:
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.1 Access and Control
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Access and review your personal information</li>
                <li>Update or correct your profile information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.2 Communication Preferences
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Opt out of marketing communications</li>
                <li>Manage email notification settings</li>
                <li>Control cookie preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.3 Data Retention
              </h3>
              <p className="text-gray-700">
                We retain your information for as long as your account is active
                or as needed to provide services. You may request deletion of
                your account and data at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your
                experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  platform functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  users interact with our platform
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used for targeted
                  advertising (if applicable)
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookie settings through your browser
                preferences. However, disabling certain cookies may affect
                platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                Our platform integrates with third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Google OAuth:</strong> For authentication (subject to
                  Google's privacy policy)
                </li>
                <li>
                  <strong>Stripe:</strong> For payment processing (subject to
                  Stripe's privacy policy)
                </li>
                <li>
                  <strong>Supabase:</strong> For backend services (subject to
                  Supabase's privacy policy)
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                These services have their own privacy policies. We encourage you
                to review them to understand how they handle your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your information in accordance with this
                Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our platform is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>
                  Sending you an email notification for significant changes
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                Your continued use of our platform after any changes constitutes
                acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@ossideas.ai
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Support:</strong> support@ossideas.ai
                </p>
                <p className="text-gray-700">Melbourne, VIC</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. California Privacy Rights
              </h2>
              <p className="text-gray-700 mb-4">
                California residents have additional rights under the California
                Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Right to know what personal information is collected and how
                  it's used
                </li>
                <li>Right to delete personal information</li>
                <li>Right to opt out of the sale of personal information</li>
                <li>
                  Right to non-discrimination for exercising privacy rights
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at
                privacy@ossideas.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. GDPR Compliance
              </h2>
              <p className="text-gray-700 mb-4">
                For users in the European Union, you have additional rights
                under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision making</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at
                privacy@ossideas.com. We will respond to your request within 30
                days.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
