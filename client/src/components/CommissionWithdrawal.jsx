import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Banknote, Wallet, CheckCircle, Loader2 } from 'lucide-react';

export const CommissionWithdrawal = () => {
  const [usdtAddress, setUsdtAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleWithdraw = async () => {
    if (!usdtAddress.trim()) {
      toast({
        title: 'Address Required',
        description: 'Please enter your USDT address',
        variant: 'destructive',
      });
      return;
    }

    if (user.commission < 100) {
      toast({
        title: 'Minimum Not Met',
        description: 'Minimum withdrawal amount is ¥100',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          userId: user.id,
          amount: user.commission,
          usdtAddress 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      toast({
        title: 'Withdrawal Requested',
        description: `¥${user.commission} withdrawal to ${usdtAddress} is processing`,
      });
      setUsdtAddress('');
    } catch (error) {
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Failed to process withdrawal',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Banknote className="h-6 w-6 mr-2 text-yellow-500" />
            Commission Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center py-4">
            ¥{user?.commission?.toFixed(2) || '0.00'}
          </div>
          <p className="text-center text-gray-600 mb-4">
            Minimum withdrawal amount: ¥100
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-6 w-6 mr-2 text-green-500" />
            Withdraw Funds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="usdt-address">USDT Wallet Address</Label>
              <Input
                id="usdt-address"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                placeholder="Enter your TRC20 USDT address"
                className="mt-1"
              />
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Withdrawals are processed within 24 hours. 
                    Minimum withdrawal amount is ¥100. 
                    Commission rate: 15% for referrals.
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-black py-2"
              onClick={handleWithdraw}
              disabled={isSubmitting || !user || user.commission < 100}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Request Withdrawal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};