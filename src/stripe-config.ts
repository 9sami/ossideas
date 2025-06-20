export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SVdmYNkGqmumKg',
    priceId: 'price_1RacUs2MXOPLeHpJfbJ4fMaM',
    name: 'test 2',
    description: 'Test product for payment processing',
    mode: 'payment',
    price: 100, // A$1.00 in cents
    currency: 'aud',
  },
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};