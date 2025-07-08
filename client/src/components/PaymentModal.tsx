import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Copy, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'confirm'>('select');
  const [selectedPackage, setSelectedPackage] = useState<{
    points: number;
    price: number;
    name: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [transactionId, setTransactionId] = useState('');
  
  const { user, updatePoints } = useAuth();

  const packages = [
    { points: 100, price: 10, name: 'Basic Pack' },
    { points: 500, price: 40, name: 'Pro Pack' },
    { points: 1500, price: 100, name: 'VIP Pack' }
  ];

  const walletAddress = 'TRX9a5u8SVs7Jn4t2Qx7k3L8mN9pQ1rS2tU3v4W5x6Y7z8A9b';

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setPaymentStep('payment');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      toast({
        title: 'Transaction ID Required',
        description: 'Please enter the transaction ID',
        variant: 'destructive',
      });
      return;
    }

    setPaymentStatus('processing');
    
    setTimeout(() => {
      if (selectedPackage && user) {
        updatePoints(user.points + selectedPackage.points);
        setPaymentStatus('completed');
        
        toast({
          title: 'Payment Successful!',
          description: `${selectedPackage.points} points added to your account`,
        });
        
        setTimeout(() => {
          onClose();
          resetModal();
        }, 2000);
      }
    }, 3000);
  };

  const resetModal = () => {
    setPaymentStep('select');
    setSelectedPackage(null);
    setPaymentStatus('pending');
    setTransactionId('');
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-md bg-white border-gray-200 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-center text-xl sm:text-2xl">
            Purchase Points
          </DialogTitle>
        </DialogHeader>

        {paymentStep === 'select' && (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-600 text-center text-sm sm:text-base">Select a points package:</p>
            
            {packages.map((pkg, index) => (
              <Card 
                key={index}
                className="bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer transition-all"
                onClick={() => handlePackageSelect(pkg)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-800 font-semibold text-sm sm:text-base">{pkg.name}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{pkg.points} Points</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-500 font-bold text-sm sm:text-base">${pkg.price} USDT</p>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-600 mt-1 text-xs sm:text-sm">
                        Best Value
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {paymentStep === 'payment' && selectedPackage && (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <h3 className="text-gray-800 font-semibold text-sm sm:text-base">{selectedPackage.name}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{selectedPackage.points} Points for ${selectedPackage.price} USDT</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-address" className="text-gray-800 text-sm sm:text-base">Send USDT to this address:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="wallet-address"
                  value={walletAddress}
                  readOnly
                  className="bg-gray-50 border-gray-300 text-gray-800 font-mono flex-1 text-xs sm:text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyAddress}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-id" className="text-gray-800 text-sm sm:text-base">Enter Transaction ID:</Label>
              <Input
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your transaction ID"
                className="bg-white border-gray-300 text-gray-800 text-xs sm:text-sm"
              />
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base py-2"
              onClick={() => setPaymentStep('confirm')}
            >
              Proceed to Confirmation
            </Button>
          </div>
        )}

        {paymentStep === 'confirm' && selectedPackage && (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <h3 className="text-gray-800 font-semibold text-sm sm:text-base">Confirm Payment</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Please verify your payment details</p>
            </div>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Package:</span>
                  <span className="text-gray-800 font-medium text-xs sm:text-sm">{selectedPackage.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Points:</span>
                  <span className="text-gray-800 font-medium text-xs sm:text-sm">{selectedPackage.points}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Amount:</span>
                  <span className="text-gray-800 font-medium text-xs sm:text-sm">${selectedPackage.price} USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Transaction ID:</span>
                  <span className="text-gray-800 font-mono text-xs sm:text-sm">{transactionId}</span>
                </div>
              </CardContent>
            </Card>

            {paymentStatus === 'pending' && (
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base py-2"
                onClick={confirmPayment}
              >
                Confirm Payment
              </Button>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-blue-500" />
                <p className="text-gray-600 text-xs sm:text-sm mt-2">Processing payment...</p>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <div className="text-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto" />
                <p className="text-gray-800 font-semibold text-sm sm:text-base mt-2">Payment Successful!</p>
                <p className="text-gray-600 text-xs sm:text-sm">{selectedPackage.points} points added to your account.</p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto" />
                <p className="text-gray-800 font-semibold text-sm sm:text-base mt-2">Payment Failed</p>
                <p className="text-gray-600 text-xs sm:text-sm">Please try again or contact support.</p>
                <Button
                  className="mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base py-2"
                  onClick={() => setPaymentStatus('pending')}
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};