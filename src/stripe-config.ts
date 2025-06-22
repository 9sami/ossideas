export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription';
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
}

// IMPORTANT: Replace these placeholder price IDs with your actual Stripe price IDs
// You need to create these prices in your Stripe Dashboard first
export const stripeProducts: StripeProduct[] = [
  {
    id: 'basic-monthly',
    priceId: 'price_1QYourActualBasicMonthlyPriceId', // Replace with your actual Stripe price ID
    name: 'Basic',
    description: 'Perfect for individual entrepreneurs and small projects',
    mode: 'subscription',
    price: 1000, // $10.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Access to 100+ curated startup ideas',
      'Basic filtering and search',
      'Save up to 10 ideas',
      'Email support',
      'Monthly idea updates',
      'Basic market insights'
    ]
  },
  {
    id: 'pro-monthly',
    priceId: 'price_1QYourActualProMonthlyPriceId', // Replace with your actual Stripe price ID
    name: 'Pro',
    description: 'Ideal for serious entrepreneurs and growing teams',
    mode: 'subscription',
    price: 2000, // $20.00 in cents
    currency: 'usd',
    interval: 'month',
    popular: true,
    features: [
      'Access to 500+ premium startup ideas',
      'Advanced filtering and AI-powered search',
      'Unlimited saved ideas',
      'Priority email & chat support',
      'Weekly trending reports',
      'Detailed market analysis',
      'Export to Notion, PDF, and more',
      'Community access and networking',
      'Early access to new features'
    ]
  },
  {
    id: 'basic-yearly',
    priceId: 'price_1QYourActualBasicYearlyPriceId', // Replace with your actual Stripe price ID
    name: 'Basic',
    description: 'Perfect for individual entrepreneurs and small projects',
    mode: 'subscription',
    price: 8000, // $80.00 in cents (20% discount)
    currency: 'usd',
    interval: 'year',
    features: [
      'Access to 100+ curated startup ideas',
      'Basic filtering and search',
      'Save up to 10 ideas',
      'Email support',
      'Monthly idea updates',
      'Basic market insights'
    ]
  },
  {
    id: 'pro-yearly',
    priceId: 'price_1QYourActualProYearlyPriceId', // Replace with your actual Stripe price ID
    name: 'Pro',
    description: 'Ideal for serious entrepreneurs and growing teams',
    mode: 'subscription',
    price: 16000, // $160.00 in cents (20% discount)
    currency: 'usd',
    interval: 'year',
    popular: true,
    features: [
      'Access to 500+ premium startup ideas',
      'Advanced filtering and AI-powered search',
      'Unlimited saved ideas',
      'Priority email & chat support',
      'Weekly trending reports',
      'Detailed market analysis',
      'Export to Notion, PDF, and more',
      'Community access and networking',
      'Early access to new features'
    ]
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductsByInterval = (interval: 'month' | 'year'): StripeProduct[] => {
  return stripeProducts.filter(product => product.interval === interval);
};

export const getSubscriptionProducts = (): StripeProduct[] => {
  return stripeProducts;
};

// Helper function to validate if price IDs are properly configured
export const validateStripeConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  stripeProducts.forEach(product => {
    if (product.priceId.startsWith('price_1QYourActual')) {
      errors.push(`${product.name} ${product.interval} plan needs a real Stripe price ID`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};