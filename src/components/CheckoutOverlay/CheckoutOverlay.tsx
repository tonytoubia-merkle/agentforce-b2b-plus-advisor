import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScene } from '@/contexts/SceneContext';
import { useCustomer } from '@/contexts/CustomerContext';
import { Button } from '@/components/ui/Button';

type CheckoutState = 'idle' | 'processing' | 'confirmed';

export const CheckoutOverlay: React.FC = () => {
  const { scene, closeCheckout } = useScene();
  const { customer } = useCustomer();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
  const [orderId] = useState(() => `PO-${Date.now().toString(36).toUpperCase()}`);
  const [poNumber, setPoNumber] = useState('');

  const products = scene.products;
  const total = products.reduce((sum, p) => {
    const qty = p.attributes?.minOrderQty ? parseInt(p.attributes.minOrderQty.replace(/[^0-9]/g, '')) || 1000 : 1000;
    return sum + p.price * qty;
  }, 0);
  const defaultAddress = customer?.shippingAddresses.find((a) => a.isDefault);
  const accountTier = customer?.loyalty?.tier ?? 'Standard';
  const paymentTerms = accountTier === 'platinum' || accountTier === 'gold' ? 'Net 45' : 'Net 30';

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { weekday: 'long', month: 'long', day: 'numeric' }
  );

  const handleSubmitOrder = () => {
    setCheckoutState('processing');
    setTimeout(() => {
      setCheckoutState('confirmed');
    }, 2000);
  };

  const handleDone = () => {
    closeCheckout();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={checkoutState === 'idle' ? closeCheckout : undefined}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

        {checkoutState === 'confirmed' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Submitted</h2>
            <p className="text-gray-500 mb-1">Reference: {orderId}</p>
            {poNumber && <p className="text-gray-500 mb-1">PO#: {poNumber}</p>}
            <p className="text-gray-500 mb-1">Payment: {paymentTerms}</p>
            <p className="text-gray-500 mb-6">Estimated ship date: {estimatedDelivery}</p>
            <div className="space-y-2 mb-6">
              {products.map((product) => {
                const qty = product.attributes?.minOrderQty || '1,000 lbs';
                return (
                  <p key={product.id} className="text-gray-700 text-sm">
                    {product.name} — {qty} @ ${product.price.toFixed(2)}/lb
                  </p>
                );
              })}
              <p className="font-semibold text-gray-900 mt-2">
                Estimated Total: ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Button onClick={handleDone} size="lg" className="w-full bg-[#59285D] hover:bg-[#472047] text-white">
              Done
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Submit Order
            </h2>

            <div className="space-y-3 mb-6">
              {products.map((product) => {
                const qty = product.attributes?.minOrderQty || '1,000 lbs';
                return (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.brand} · {qty}</p>
                    </div>
                    <span className="font-medium text-sm">${product.price.toFixed(2)}/lb</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* PO Number */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">PO Number (optional)</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder="Enter your PO number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#59285D]/30 focus:border-[#59285D]"
              />
            </div>

            {/* Payment Terms */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Payment Terms</span>
              <span className="font-medium text-sm">{paymentTerms}</span>
            </div>

            {defaultAddress && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Ship to</span>
                <span className="font-medium text-sm text-right">
                  {defaultAddress.city}, {defaultAddress.state}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold">Estimated Total</span>
              <span className="text-lg font-semibold">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <Button
              onClick={handleSubmitOrder}
              disabled={checkoutState === 'processing'}
              size="lg"
              className="w-full bg-[#59285D] hover:bg-[#472047] text-white"
            >
              {checkoutState === 'processing' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Order'
              )}
            </Button>

            <button
              onClick={closeCheckout}
              disabled={checkoutState === 'processing'}
              className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
