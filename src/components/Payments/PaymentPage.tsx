import { useState } from "react";
import { CreditCard, Shield, Lock, CheckCircle, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PaymentPageProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    ticketPrice: number;
    maxAttendees: number;
  };
}

const PaymentPage = ({ event }: PaymentPageProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
    email: "",
    phone: ""
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");

  const handlePayment = async () => {
    if (paymentMethod === "card") {
      if (!paymentData.cardNumber || !paymentData.expiryMonth || !paymentData.expiryYear || !paymentData.cvv || !paymentData.nameOnCard) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful! 🎉",
        description: `You have successfully registered for ${event.title}`,
      });
      
      // Navigate to success page or event details
      navigate(`/events/${event.id}?payment=success`);
      setIsProcessing(false);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const taxes = Math.round(event.ticketPrice * 0.18);
  const processingFee = 25;
  const totalAmount = event.ticketPrice + taxes + processingFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Secure Payment</h1>
            <p className="text-muted-foreground">Complete your event registration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Card</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                  >
                    <div className="h-6 w-6 mx-auto mb-2 bg-primary rounded text-primary-foreground flex items-center justify-center text-xs font-bold">
                      UPI
                    </div>
                    <p className="text-sm font-medium">UPI</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-muted-foreground"
                    }`}
                  >
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Net Banking</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            {paymentMethod === "card" && (
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Card Number *</label>
                    <Input
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Month *</label>
                      <select
                        value={paymentData.expiryMonth}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Year *</label>
                      <select
                        value={paymentData.expiryYear}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryYear: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={String(new Date().getFullYear() + i)}>
                            {new Date().getFullYear() + i}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">CVV *</label>
                      <Input
                        type="password"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name on Card *</label>
                    <Input
                      value={paymentData.nameOnCard}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                      placeholder="Enter name as on card"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
                  <Input
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20 sticky top-8">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-secondary/60" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-secondary" />
                    <span>1 ticket</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Ticket Price</span>
                    <span>₹{event.ticketPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes (18%)</span>
                    <span>₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing Fee</span>
                    <span>₹{processingFee}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;