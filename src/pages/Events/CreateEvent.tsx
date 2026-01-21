import { useState } from "react";
import { 
  Calendar, MapPin, Users, ArrowLeft, Save, Send, 
  Camera, UtensilsCrossed, Music, Palette, Car, Shield, Sparkles, 
  CreditCard, Star, ChevronRight, CheckCircle, Building, Ticket,
  Banknote, Smartphone, Wallet, Lock, Eye, ImageIcon, PartyPopper
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useEvents, StoredEvent } from "@/hooks/useEvents";

type Step = "details" | "services" | "payment" | "review";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addEvent } = useEvents();
  
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    transactionId: string;
    amount: number;
    method: string;
    timestamp: string;
  } | null>(null);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    venue: "",
    address: "",
    maxAttendees: "",
    ticketPrice: "",
    category: "",
    eventType: "",
    status: "draft",
    services: [] as string[],
    coverImage: "",
    tags: [] as string[]
  });

  const [paymentData, setPaymentData] = useState({
    method: "" as "card" | "upi" | "netbanking" | "wallet" | "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
    upiId: "",
    bankName: "",
    walletProvider: "",
    // Net Banking fields
    nbUsername: "",
    nbPassword: "",
    nbOtp: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Net Banking flow state
  type NetBankingStep = "select-bank" | "credentials" | "otp" | "verified";
  const [netBankingStep, setNetBankingStep] = useState<NetBankingStep>("select-bank");
  const [isVerifyingCredentials, setIsVerifyingCredentials] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: "details", label: "Event Details", icon: Calendar },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Eye }
  ];

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === "details") {
      if (!eventData.title.trim()) newErrors.title = "Event title is required";
      if (!eventData.date) newErrors.date = "Date is required";
      if (!eventData.time) newErrors.time = "Start time is required";
      if (!eventData.venue.trim()) newErrors.venue = "Venue is required";
      if (!eventData.maxAttendees || parseInt(eventData.maxAttendees) <= 0) {
        newErrors.maxAttendees = "Valid attendee count required";
      }
      if (!eventData.category) newErrors.category = "Please select a category";
    }

    if (step === "payment" && eventData.ticketPrice && parseFloat(eventData.ticketPrice) > 0) {
      if (!paymentData.method) newErrors.paymentMethod = "Please select a payment method";
      if (paymentData.method === "card") {
        if (!paymentData.cardNumber) newErrors.cardNumber = "Card number required";
        if (!paymentData.expiryMonth || !paymentData.expiryYear) newErrors.expiry = "Expiry date required";
        if (!paymentData.cvv) newErrors.cvv = "CVV required";
        if (!paymentData.nameOnCard) newErrors.nameOnCard = "Name on card required";
      }
      if (paymentData.method === "upi" && !paymentData.upiId) {
        newErrors.upiId = "UPI ID required";
      }
      if (paymentData.method === "netbanking") {
        if (!paymentData.bankName) {
          newErrors.bankName = "Please select a bank";
        } else if (netBankingStep !== "verified") {
          if (netBankingStep === "select-bank") {
            newErrors.netBankingFlow = "Please select a bank and complete verification";
          } else if (netBankingStep === "credentials") {
            newErrors.netBankingFlow = "Please enter your credentials and verify";
          } else if (netBankingStep === "otp") {
            newErrors.nbOtp = "Please verify OTP to proceed";
          }
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const stepOrder: Step[] = ["details", "services", "payment", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["details", "services", "payment", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const generateTransactionId = () => {
    const prefix = paymentData.method === 'upi' ? 'UPI' : paymentData.method === 'card' ? 'CRD' : paymentData.method === 'netbanking' ? 'NB' : 'WLT';
    return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setIsProcessing(true);
    
    const totalAmount = calculateTotal();
    const hasPaidServices = totalAmount > 0;
    
    // Simulate realistic payment processing
    if (hasPaidServices && status === "published") {
      // Step 1: Validate payment details
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Process payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const txnId = generateTransactionId();
      const txnDetails = {
        transactionId: txnId,
        amount: totalAmount,
        method: paymentData.method === 'card' ? `Card ending ${paymentData.cardNumber.slice(-4)}` :
                paymentData.method === 'upi' ? `UPI (${paymentData.upiId})` :
                paymentData.method === 'netbanking' ? paymentData.bankName :
                paymentData.walletProvider,
        timestamp: new Date().toISOString()
      };
      
      setTransactionDetails(txnDetails);
      
      // Add event with payment details
      const newEvent = addEvent({
        ...eventData,
        status: status as "draft" | "published" | "completed" | "cancelled",
        paymentStatus: "completed",
        paymentMethod: txnDetails.method,
        paymentAmount: txnDetails.amount,
        transactionId: txnDetails.transactionId
      });
      
      setPaymentSuccess(true);
      setIsProcessing(false);
      
      toast({
        title: "🎉 Payment Successful!",
        description: `Transaction ID: ${txnId}`,
      });
      
      return;
    }
    
    // For drafts or free events
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addEvent({
      ...eventData,
      status: status as "draft" | "published" | "completed" | "cancelled",
      paymentStatus: hasPaidServices ? "pending" : "free",
      paymentAmount: totalAmount
    });
    
    setIsProcessing(false);
    
    toast({
      title: status === "draft" ? "📝 Event Saved as Draft" : "🎉 Event Published!",
      description: `"${eventData.title}" has been ${status === "draft" ? "saved as draft" : "published successfully"}.`,
    });
    
    navigate("/events");
  };

  const updateField = (field: string, value: string | string[]) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleService = (service: string) => {
    setEventData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const services = [
    { id: "catering", label: "Catering & Food", description: "Professional catering services", icon: UtensilsCrossed, color: "from-orange-500 to-amber-500", price: 5000 },
    { id: "photography", label: "Photography", description: "HD photo & video coverage", icon: Camera, color: "from-purple-500 to-violet-500", price: 8000 },
    { id: "music", label: "Audio/Music", description: "Sound system & DJ services", icon: Music, color: "from-green-500 to-emerald-500", price: 3000 },
    { id: "decoration", label: "Decoration", description: "Theme-based decorations", icon: Palette, color: "from-pink-500 to-rose-500", price: 6000 },
    { id: "transport", label: "Transportation", description: "Guest pickup & drop", icon: Car, color: "from-blue-500 to-cyan-500", price: 4000 },
    { id: "security", label: "Security", description: "Professional security team", icon: Shield, color: "from-red-500 to-rose-500", price: 7000 }
  ];

  const calculateServiceTotal = () => {
    return services
      .filter(s => eventData.services.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const calculatePlatformFee = () => {
    const ticketPrice = parseFloat(eventData.ticketPrice) || 0;
    return Math.round(ticketPrice * 0.05); // 5% platform fee
  };

  const calculateTotal = () => {
    const ticketPrice = parseFloat(eventData.ticketPrice) || 0;
    return ticketPrice + calculateServiceTotal() + calculatePlatformFee();
  };

  const banks = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda"
  ];

  const wallets = ["Paytm", "PhonePe", "Google Pay", "Amazon Pay", "MobiKwik"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header showBackButton={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb />
            
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-light to-secondary p-8 mb-8">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tNiA0aC00djJoNHYtMnptLTYgMGgtNHYyaDR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(-1)}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <span className="text-accent font-medium text-sm">Premium Event Creator</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Create Your Event</h1>
                    <p className="text-white/80 mt-1">Design an unforgettable experience</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-white text-sm font-medium">Premium Features Enabled</span>
                </div>
              </div>
            </div>

            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => {
                        const stepOrder: Step[] = ["details", "services", "payment", "review"];
                        const currentIndex = stepOrder.indexOf(currentStep);
                        const targetIndex = stepOrder.indexOf(step.id);
                        if (targetIndex <= currentIndex) {
                          setCurrentStep(step.id);
                        }
                      }}
                      className={`flex flex-col items-center group ${
                        steps.indexOf(steps.find(s => s.id === currentStep)!) >= index
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep === step.id
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110"
                          : steps.indexOf(steps.find(s => s.id === currentStep)!) > index
                          ? "bg-success text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {steps.indexOf(steps.find(s => s.id === currentStep)!) > index ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        currentStep === step.id ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {step.label}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-colors ${
                        steps.indexOf(steps.find(s => s.id === currentStep)!) > index
                          ? "bg-success"
                          : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Event Details */}
                {currentStep === "details" && (
                  <>
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          Event Information
                        </CardTitle>
                        <CardDescription>Fill in the basic details about your event</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Event Title <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={eventData.title}
                              onChange={(e) => updateField("title", e.target.value)}
                              placeholder="Enter an engaging event title"
                              className={`h-12 text-lg ${errors.title ? "border-destructive ring-destructive" : "focus:ring-primary"}`}
                            />
                            {errors.title && <p className="text-destructive text-sm mt-1 flex items-center gap-1"><span>⚠</span>{errors.title}</p>}
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                            <textarea
                              value={eventData.description}
                              onChange={(e) => updateField("description", e.target.value)}
                              placeholder="Describe what makes your event special..."
                              rows={4}
                              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Event Type <span className="text-destructive">*</span>
                            </label>
                            <select
                              value={eventData.eventType}
                              onChange={(e) => updateField("eventType", e.target.value)}
                              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="">Select type</option>
                              <option value="in-person">🏢 In-Person</option>
                              <option value="virtual">💻 Virtual</option>
                              <option value="hybrid">🔄 Hybrid</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Category <span className="text-destructive">*</span>
                            </label>
                            <select
                              value={eventData.category}
                              onChange={(e) => updateField("category", e.target.value)}
                              className={`flex h-12 w-full rounded-xl border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                                errors.category ? "border-destructive" : "border-input focus:ring-ring"
                              }`}
                            >
                              <option value="">Select category</option>
                              <option value="conference">📊 Conference</option>
                              <option value="workshop">🛠️ Workshop</option>
                              <option value="seminar">📚 Seminar</option>
                              <option value="networking">🤝 Networking</option>
                              <option value="wedding">💒 Wedding</option>
                              <option value="corporate">🏢 Corporate</option>
                              <option value="social">🎉 Social</option>
                              <option value="other">📋 Other</option>
                            </select>
                            {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Date <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="date"
                              value={eventData.date}
                              onChange={(e) => updateField("date", e.target.value)}
                              className={`h-12 ${errors.date ? "border-destructive" : ""}`}
                              min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Start Time <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="time"
                              value={eventData.time}
                              onChange={(e) => updateField("time", e.target.value)}
                              className={`h-12 ${errors.time ? "border-destructive" : ""}`}
                            />
                            {errors.time && <p className="text-destructive text-sm mt-1">{errors.time}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">End Time</label>
                            <Input
                              type="time"
                              value={eventData.endTime}
                              onChange={(e) => updateField("endTime", e.target.value)}
                              className="h-12"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-secondary via-accent to-success" />
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-secondary/10 rounded-lg">
                            <Building className="h-5 w-5 text-secondary" />
                          </div>
                          Venue & Capacity
                        </CardTitle>
                        <CardDescription>Where will your event take place?</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Venue Name <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={eventData.venue}
                              onChange={(e) => updateField("venue", e.target.value)}
                              placeholder="e.g., Grand Convention Center"
                              className={`h-12 ${errors.venue ? "border-destructive" : ""}`}
                            />
                            {errors.venue && <p className="text-destructive text-sm mt-1">{errors.venue}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              Max Attendees <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                type="number"
                                value={eventData.maxAttendees}
                                onChange={(e) => updateField("maxAttendees", e.target.value)}
                                placeholder="100"
                                min="1"
                                className={`h-12 pl-10 ${errors.maxAttendees ? "border-destructive" : ""}`}
                              />
                            </div>
                            {errors.maxAttendees && <p className="text-destructive text-sm mt-1">{errors.maxAttendees}</p>}
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-foreground mb-2 block">Full Address</label>
                            <Input
                              value={eventData.address}
                              onChange={(e) => updateField("address", e.target.value)}
                              placeholder="Enter complete address with city and pincode"
                              className="h-12"
                            />
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4 text-accent" />
                                Ticket Price (₹)
                              </div>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">₹</span>
                              <Input
                                type="number"
                                value={eventData.ticketPrice}
                                onChange={(e) => updateField("ticketPrice", e.target.value)}
                                placeholder="0 for free event"
                                min="0"
                                step="100"
                                className="h-12 pl-8 text-lg font-medium"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Leave empty or 0 for free events</p>
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                              <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-primary" />
                                Cover Image URL
                              </div>
                            </label>
                            <Input
                              value={eventData.coverImage}
                              onChange={(e) => updateField("coverImage", e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="h-12"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Step 2: Services */}
                {currentStep === "services" && (
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-accent via-success to-primary" />
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Sparkles className="h-5 w-5 text-accent" />
                        </div>
                        Premium Services
                      </CardTitle>
                      <CardDescription>Enhance your event with professional services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden ${
                              eventData.services.includes(service.id)
                                ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                                : "border-border hover:border-primary/50 hover:shadow-md"
                            }`}
                          >
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${service.color} text-white`}>
                                  <service.icon className="h-5 w-5" />
                                </div>
                                {eventData.services.includes(service.id) && (
                                  <CheckCircle className="h-5 w-5 text-success" />
                                )}
                              </div>
                              <h4 className="font-semibold text-foreground mb-1">{service.label}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                              <p className="text-lg font-bold text-primary">₹{service.price.toLocaleString('en-IN')}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {eventData.services.length > 0 && (
                        <div className="p-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl border border-primary/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">Selected Services</p>
                              <p className="text-sm text-muted-foreground">{eventData.services.length} service(s) selected</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="text-2xl font-bold text-primary">₹{calculateServiceTotal().toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Payment */}
                {currentStep === "payment" && (
                  <>
                    {(!eventData.ticketPrice || parseFloat(eventData.ticketPrice) === 0) && calculateServiceTotal() === 0 ? (
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-success/10 to-card overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-success to-primary" />
                        <CardContent className="py-12 text-center">
                          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-success" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-2">Free Event!</h3>
                          <p className="text-muted-foreground">No payment required for this event. You can proceed to review.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                              Payment Method
                            </CardTitle>
                            <CardDescription>Choose your preferred payment method</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { id: "card", label: "Card", icon: CreditCard, color: "from-blue-500 to-indigo-500" },
                                { id: "upi", label: "UPI", icon: Smartphone, color: "from-purple-500 to-pink-500" },
                                { id: "netbanking", label: "Net Banking", icon: Building, color: "from-green-500 to-teal-500" },
                                { id: "wallet", label: "Wallet", icon: Wallet, color: "from-orange-500 to-amber-500" }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => {
                                    setPaymentData(prev => ({ ...prev, method: method.id as any }));
                                    // Reset net banking state when switching payment methods
                                    if (method.id !== "netbanking") {
                                      setNetBankingStep("select-bank");
                                    }
                                  }}
                                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                                    paymentData.method === method.id
                                      ? "border-primary bg-primary/10 shadow-lg scale-105"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-2`}>
                                    <method.icon className="h-5 w-5 text-white" />
                                  </div>
                                  <p className="text-sm font-semibold">{method.label}</p>
                                </button>
                              ))}
                            </div>
                            {errors.paymentMethod && <p className="text-destructive text-sm">{errors.paymentMethod}</p>}
                          </CardContent>
                        </Card>

                        {paymentData.method === "card" && (
                          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                            <CardHeader>
                              <CardTitle>Card Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                              <div>
                                <label className="text-sm font-semibold mb-2 block">Card Number</label>
                                <Input
                                  value={paymentData.cardNumber}
                                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  className={`h-12 ${errors.cardNumber ? "border-destructive" : ""}`}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-semibold mb-2 block">Month</label>
                                  <select
                                    value={paymentData.expiryMonth}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
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
                                  <label className="text-sm font-semibold mb-2 block">Year</label>
                                  <select
                                    value={paymentData.expiryYear}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, expiryYear: e.target.value }))}
                                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
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
                                  <label className="text-sm font-semibold mb-2 block">CVV</label>
                                  <Input
                                    type="password"
                                    value={paymentData.cvv}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                    placeholder="***"
                                    maxLength={4}
                                    className="h-12"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-semibold mb-2 block">Name on Card</label>
                                <Input
                                  value={paymentData.nameOnCard}
                                  onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                                  placeholder="Enter name as on card"
                                  className="h-12"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {paymentData.method === "upi" && (
                          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                            <CardHeader>
                              <CardTitle>UPI Payment</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div>
                                <label className="text-sm font-semibold mb-2 block">UPI ID</label>
                                <Input
                                  value={paymentData.upiId}
                                  onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
                                  placeholder="yourname@upi"
                                  className={`h-12 ${errors.upiId ? "border-destructive" : ""}`}
                                />
                                {errors.upiId && <p className="text-destructive text-sm mt-1">{errors.upiId}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {paymentData.method === "netbanking" && (
                          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-green-500 to-teal-500" />
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle>
                                    {netBankingStep === "select-bank" && "Select Your Bank"}
                                    {netBankingStep === "credentials" && `Login to ${paymentData.bankName}`}
                                    {netBankingStep === "otp" && "Enter OTP"}
                                    {netBankingStep === "verified" && "Verification Complete"}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {netBankingStep === "select-bank" && "Choose your bank to proceed"}
                                    {netBankingStep === "credentials" && "Enter your net banking credentials"}
                                    {netBankingStep === "otp" && "We've sent an OTP to your registered mobile number"}
                                    {netBankingStep === "verified" && "Your bank account has been verified successfully"}
                                  </CardDescription>
                                </div>
                                {netBankingStep !== "select-bank" && (
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${netBankingStep === "credentials" || netBankingStep === "otp" || netBankingStep === "verified" ? "bg-success" : "bg-muted"}`} />
                                    <div className={`w-8 h-0.5 ${netBankingStep === "otp" || netBankingStep === "verified" ? "bg-success" : "bg-muted"}`} />
                                    <div className={`w-3 h-3 rounded-full ${netBankingStep === "otp" || netBankingStep === "verified" ? "bg-success" : "bg-muted"}`} />
                                    <div className={`w-8 h-0.5 ${netBankingStep === "verified" ? "bg-success" : "bg-muted"}`} />
                                    <div className={`w-3 h-3 rounded-full ${netBankingStep === "verified" ? "bg-success" : "bg-muted"}`} />
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Step 1: Select Bank */}
                              {netBankingStep === "select-bank" && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {banks.map(bank => (
                                    <button
                                      key={bank}
                                      onClick={() => {
                                        setPaymentData(prev => ({ ...prev, bankName: bank, nbUsername: "", nbPassword: "", nbOtp: "" }));
                                        setNetBankingStep("credentials");
                                        setErrors(prev => ({ ...prev, bankName: "" }));
                                      }}
                                      className={`p-3 rounded-lg border text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 ${
                                        paymentData.bankName === bank
                                          ? "border-primary bg-primary/10"
                                          : "border-border"
                                      }`}
                                    >
                                      <Building className="h-5 w-5 mx-auto mb-2 text-primary" />
                                      {bank}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Step 2: Credentials */}
                              {netBankingStep === "credentials" && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Building className="h-8 w-8 text-primary" />
                                    <div>
                                      <p className="font-semibold">{paymentData.bankName}</p>
                                      <p className="text-sm text-muted-foreground">Secure Net Banking</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-semibold mb-2 block">Username / Customer ID</label>
                                    <Input
                                      value={paymentData.nbUsername}
                                      onChange={(e) => {
                                        setPaymentData(prev => ({ ...prev, nbUsername: e.target.value }));
                                        setErrors(prev => ({ ...prev, nbUsername: "" }));
                                      }}
                                      placeholder="Enter your username"
                                      className={`h-12 ${errors.nbUsername ? "border-destructive" : ""}`}
                                    />
                                    {errors.nbUsername && <p className="text-destructive text-sm mt-1">{errors.nbUsername}</p>}
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-semibold mb-2 block">Password</label>
                                    <Input
                                      type="password"
                                      value={paymentData.nbPassword}
                                      onChange={(e) => {
                                        setPaymentData(prev => ({ ...prev, nbPassword: e.target.value }));
                                        setErrors(prev => ({ ...prev, nbPassword: "" }));
                                      }}
                                      placeholder="Enter your password"
                                      className={`h-12 ${errors.nbPassword ? "border-destructive" : ""}`}
                                    />
                                    {errors.nbPassword && <p className="text-destructive text-sm mt-1">{errors.nbPassword}</p>}
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        setNetBankingStep("select-bank");
                                        setPaymentData(prev => ({ ...prev, bankName: "", nbUsername: "", nbPassword: "" }));
                                      }}
                                      className="flex-1"
                                    >
                                      <ArrowLeft className="h-4 w-4 mr-2" />
                                      Change Bank
                                    </Button>
                                    <Button
                                      type="button"
                                      onClick={async () => {
                                        if (!paymentData.nbUsername || !paymentData.nbPassword) {
                                          setErrors({
                                            nbUsername: !paymentData.nbUsername ? "Username is required" : "",
                                            nbPassword: !paymentData.nbPassword ? "Password is required" : ""
                                          });
                                          return;
                                        }
                                        setIsVerifyingCredentials(true);
                                        // Simulate credential verification
                                        await new Promise(resolve => setTimeout(resolve, 1500));
                                        setIsVerifyingCredentials(false);
                                        setNetBankingStep("otp");
                                        toast({
                                          title: "OTP Sent",
                                          description: "Please check your registered mobile number for OTP",
                                        });
                                      }}
                                      disabled={isVerifyingCredentials}
                                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                    >
                                      {isVerifyingCredentials ? (
                                        <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                          Verifying...
                                        </>
                                      ) : (
                                        <>
                                          Continue
                                          <ChevronRight className="h-4 w-4 ml-2" />
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    <span>Your credentials are encrypted and secure</span>
                                  </div>
                                </div>
                              )}

                              {/* Step 3: OTP Verification */}
                              {(netBankingStep === "otp" || netBankingStep === "verified") && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Building className="h-8 w-8 text-primary" />
                                    <div>
                                      <p className="font-semibold">{paymentData.bankName}</p>
                                      <p className="text-sm text-muted-foreground">Logged in as: {paymentData.nbUsername}</p>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-success ml-auto" />
                                  </div>
                                  
                                  {netBankingStep === "verified" ? (
                                    <div className="text-center py-4">
                                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="h-8 w-8 text-success" />
                                      </div>
                                      <h4 className="font-semibold mb-1 text-success">Bank Verified!</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Your bank account is ready for payment
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Smartphone className="h-8 w-8 text-primary" />
                                      </div>
                                      <h4 className="font-semibold mb-1">Enter OTP</h4>
                                      <p className="text-sm text-muted-foreground">
                                        OTP sent to your registered mobile number
                                      </p>
                                    </div>
                                  )}
                                  
                                  {netBankingStep !== "verified" && (
                                    <>
                                      <div>
                                        <Input
                                          value={paymentData.nbOtp}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setPaymentData(prev => ({ ...prev, nbOtp: value }));
                                            setErrors(prev => ({ ...prev, nbOtp: "" }));
                                          }}
                                          placeholder="Enter 6-digit OTP"
                                          maxLength={6}
                                          className={`h-14 text-center text-2xl tracking-widest font-mono ${errors.nbOtp ? "border-destructive" : ""}`}
                                        />
                                        {errors.nbOtp && <p className="text-destructive text-sm mt-1 text-center">{errors.nbOtp}</p>}
                                      </div>
                                      
                                      <div className="flex gap-3">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                            setNetBankingStep("credentials");
                                            setPaymentData(prev => ({ ...prev, nbOtp: "" }));
                                          }}
                                          className="flex-1"
                                        >
                                          <ArrowLeft className="h-4 w-4 mr-2" />
                                          Back
                                        </Button>
                                    <Button
                                      type="button"
                                      onClick={async () => {
                                        if (!paymentData.nbOtp || paymentData.nbOtp.length !== 6) {
                                          setErrors({ nbOtp: "Please enter valid 6-digit OTP" });
                                          return;
                                        }
                                        setIsVerifyingOtp(true);
                                        // Simulate OTP verification
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                        setIsVerifyingOtp(false);
                                        setNetBankingStep("verified");
                                        toast({
                                          title: "✓ Bank Verified",
                                          description: "Your bank account has been verified successfully",
                                        });
                                        setErrors({});
                                      }}
                                      disabled={isVerifyingOtp || paymentData.nbOtp.length !== 6}
                                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                    >
                                        {isVerifyingOtp ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Verifying...
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Verify OTP
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    
                                    <div className="text-center">
                                      <button 
                                        type="button"
                                        className="text-sm text-primary hover:underline"
                                        onClick={() => {
                                          toast({
                                            title: "OTP Resent",
                                            description: "A new OTP has been sent to your mobile number",
                                          });
                                        }}
                                      >
                                        Didn't receive OTP? Resend
                                      </button>
                                    </div>
                                  </>
                                  )}
                                </div>
                              )}

                              {errors.bankName && <p className="text-destructive text-sm">{errors.bankName}</p>}
                            </CardContent>
                          </Card>
                        )}

                        {paymentData.method === "wallet" && (
                          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                            <CardHeader>
                              <CardTitle>Select Wallet</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {wallets.map(wallet => (
                                  <button
                                    key={wallet}
                                    onClick={() => setPaymentData(prev => ({ ...prev, walletProvider: wallet }))}
                                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                                      paymentData.walletProvider === wallet
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                  >
                                    {wallet}
                                  </button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Step 4: Review */}
                {currentStep === "review" && !paymentSuccess && (
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-success via-primary to-secondary" />
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <Eye className="h-5 w-5 text-success" />
                        </div>
                        Review Your Event
                      </CardTitle>
                      <CardDescription>Confirm all details before publishing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-xl">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Event Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-muted-foreground">Title:</span> <span className="font-medium">{eventData.title}</span></div>
                            <div><span className="text-muted-foreground">Category:</span> <span className="font-medium capitalize">{eventData.category}</span></div>
                            <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{eventData.date}</span></div>
                            <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">{eventData.time}{eventData.endTime && ` - ${eventData.endTime}`}</span></div>
                            <div><span className="text-muted-foreground">Venue:</span> <span className="font-medium">{eventData.venue}</span></div>
                            <div><span className="text-muted-foreground">Capacity:</span> <span className="font-medium">{eventData.maxAttendees} attendees</span></div>
                          </div>
                        </div>

                        {eventData.services.length > 0 && (
                          <div className="p-4 bg-muted/30 rounded-xl">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" /> Selected Services
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {eventData.services.map(serviceId => {
                                const service = services.find(s => s.id === serviceId);
                                return service && (
                                  <Badge key={serviceId} variant="secondary" className="py-1 px-3">
                                    {service.label} - ₹{service.price.toLocaleString('en-IN')}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {paymentData.method && (
                          <div className="p-4 bg-muted/30 rounded-xl">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" /> Payment Method
                            </h4>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                {paymentData.method === 'card' && <CreditCard className="h-5 w-5 text-primary" />}
                                {paymentData.method === 'upi' && <Smartphone className="h-5 w-5 text-primary" />}
                                {paymentData.method === 'netbanking' && <Building className="h-5 w-5 text-primary" />}
                                {paymentData.method === 'wallet' && <Wallet className="h-5 w-5 text-primary" />}
                              </div>
                              <div>
                                <p className="font-medium capitalize">{paymentData.method === 'netbanking' ? 'Net Banking' : paymentData.method}</p>
                                <p className="text-sm text-muted-foreground">
                                  {paymentData.method === 'card' && `**** **** **** ${paymentData.cardNumber.slice(-4)}`}
                                  {paymentData.method === 'upi' && paymentData.upiId}
                                  {paymentData.method === 'netbanking' && paymentData.bankName}
                                  {paymentData.method === 'wallet' && paymentData.walletProvider}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Banknote className="h-4 w-4" /> Payment Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            {eventData.ticketPrice && parseFloat(eventData.ticketPrice) > 0 && (
                              <div className="flex justify-between">
                                <span>Ticket Price</span>
                                <span>₹{parseFloat(eventData.ticketPrice).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            {calculateServiceTotal() > 0 && (
                              <div className="flex justify-between">
                                <span>Services</span>
                                <span>₹{calculateServiceTotal().toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            {calculatePlatformFee() > 0 && (
                              <div className="flex justify-between text-muted-foreground">
                                <span>Platform Fee (5%)</span>
                                <span>₹{calculatePlatformFee().toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-primary">₹{calculateTotal().toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Success Screen */}
                {paymentSuccess && transactionDetails && (
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-success/5 to-card overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-success via-primary to-secondary" />
                    <CardContent className="py-12 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 bg-success/10 rounded-full animate-ping" />
                        </div>
                        <div className="w-24 h-24 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                          <CheckCircle className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <PartyPopper className="h-6 w-6 text-accent" />
                        <h2 className="text-3xl font-bold text-foreground">Payment Successful!</h2>
                        <PartyPopper className="h-6 w-6 text-accent" />
                      </div>
                      <p className="text-muted-foreground mb-8">Your event has been created and published successfully</p>

                      <div className="max-w-md mx-auto bg-muted/30 rounded-xl p-6 space-y-4 mb-8">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Transaction ID</span>
                          <span className="font-mono font-bold text-primary">{transactionDetails.transactionId}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount Paid</span>
                          <span className="text-2xl font-bold text-success">₹{transactionDetails.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-medium">{transactionDetails.method}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Date & Time</span>
                          <span className="text-sm">{new Date(transactionDetails.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => navigate("/events")} className="gap-2">
                          <Eye className="h-4 w-4" />
                          View All Events
                        </Button>
                        <Button onClick={() => navigate("/")} className="gap-2 bg-gradient-to-r from-primary to-secondary">
                          <Calendar className="h-4 w-4" />
                          Go to Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                {!paymentSuccess && (
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === "details" || isProcessing}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    
                    {currentStep !== "review" ? (
                      <Button
                        onClick={handleNext}
                        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleSubmit("draft")}
                          disabled={isProcessing}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Draft
                        </Button>
                        <Button
                          onClick={() => handleSubmit("published")}
                          disabled={isProcessing}
                          className="gap-2 bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90 min-w-[180px]"
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Processing Payment...</span>
                            </div>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              {calculateTotal() > 0 ? `Pay ₹${calculateTotal().toLocaleString('en-IN')}` : 'Publish Event'}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Preview */}
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10 sticky top-8 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-xl flex items-center justify-center overflow-hidden">
                      {eventData.coverImage ? (
                        <img src={eventData.coverImage} alt="Event cover" className="w-full h-full object-cover" />
                      ) : (
                        <Calendar className="h-12 w-12 text-primary/40" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2">{eventData.title || "Your Event Title"}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {eventData.description || "Event description..."}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{eventData.date || "Date"} • {eventData.time || "Time"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="truncate">{eventData.venue || "Venue"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-accent" />
                        <span>0/{eventData.maxAttendees || "0"} seats</span>
                      </div>
                    </div>

                    {eventData.category && (
                      <Badge className="capitalize">{eventData.category}</Badge>
                    )}

                    {eventData.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {eventData.services.slice(0, 3).map(id => (
                          <Badge key={id} variant="outline" className="text-xs">
                            {services.find(s => s.id === id)?.label}
                          </Badge>
                        ))}
                        {eventData.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{eventData.services.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculateTotal() > 0 ? `₹${calculateTotal().toLocaleString('en-IN')}` : "Free"}
                        </span>
                      </div>
                      {calculateTotal() > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Includes ticket + services + 5% platform fee
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                      <Lock className="h-3 w-3" />
                      <span>Secure payment with 256-bit encryption</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateEvent;
