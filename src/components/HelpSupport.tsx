import React from 'react';
import { HelpCircle, MessageCircle, FileText, Mail, Phone } from 'lucide-react';

const HelpSupport: React.FC = () => {
  const faqs = [
    {
      question: 'How do I save an idea?',
      answer:
        "Click the bookmark icon on any idea card to save it to your collection. You can view all your saved ideas in the 'My Saved Ideas' section.",
    },
    {
      question: 'Can I submit my own repository?',
      answer:
        "Yes! You can submit open source repositories for analysis. Go to the 'My Submissions' page and click 'Submit Repository' to get started.",
    },
    {
      question: 'How are opportunity scores calculated?',
      answer:
        'Opportunity scores are based on factors like GitHub stars, forks, recent activity, and community engagement. Higher scores indicate greater business potential.',
    },
    {
      question: 'What subscription plans are available?',
      answer:
        'We offer free and premium plans. Premium plans include advanced filtering, unlimited saved ideas, and priority support. Check our pricing page for details.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          </div>
          <p className="text-gray-600">
            Get help with using OSSIdeas and find answers to common questions
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Live Chat
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team in real-time
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Email Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Send us an email and we'll get back to you
            </p>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Send Email
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Phone Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us for immediate assistance
            </p>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Call Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">User Guide</h3>
                <p className="text-sm text-gray-600">
                  Complete guide to using OSSIdeas
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">API Documentation</h3>
                <p className="text-sm text-gray-600">
                  Integrate OSSIdeas into your workflow
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Privacy Policy</h3>
                <p className="text-sm text-gray-600">
                  How we protect your data
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Terms of Service</h3>
                <p className="text-sm text-gray-600">
                  Our terms and conditions
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
