import { motion } from 'framer-motion';
import { useScene } from '@/contexts/SceneContext';
import { useCustomer } from '@/contexts/CustomerContext';
import { Button } from '@/components/ui/Button';

export const CheckoutOverlay: React.FC = () => {
  const { scene, closeCheckout } = useScene();
  const { customer } = useCustomer();

  const products = scene.products;
  const total = products.reduce((sum, p) => sum + p.price, 0);
  const defaultPayment = customer?.savedPaymentMethods.find((p) => p.isDefault);
  const defaultAddress = customer?.shippingAddresses.find((a) => a.isDefault);

  const handleConfirmPurchase = () => {
    console.log('Processing purchase...', { products, total });
    setTimeout(() => {
      closeCheckout();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeCheckout}
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

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Quick Checkout
        </h2>

        <div className="space-y-4 mb-6">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.brand}</p>
              </div>
              <span className="font-medium">${product.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 my-4" />

        {defaultPayment && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Payment</span>
            <span className="font-medium">
              {defaultPayment.brand?.toUpperCase()} &bull;&bull;&bull;&bull; {defaultPayment.last4}
            </span>
          </div>
        )}

        {defaultAddress && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">Ship to</span>
            <span className="font-medium text-right">
              {defaultAddress.city}, {defaultAddress.state}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-xl font-semibold">${total.toFixed(2)}</span>
        </div>

        <Button
          onClick={handleConfirmPurchase}
          size="lg"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Confirm Purchase
        </Button>

        <button
          onClick={closeCheckout}
          className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
