import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CustomerProfile } from '@/types/customer';
import { MOCK_CUSTOMER } from '@/mocks/customer';

interface CustomerContextValue {
  customer: CustomerProfile | null;
  isLoading: boolean;
  error: Error | null;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCustomer(MOCK_CUSTOMER);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch customer'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, isLoading, error }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextValue => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }
  return context;
};
