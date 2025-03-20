import React, { useState } from 'react';
import { Menu, X, ArrowLeft, ChevronDown, ArrowUpDown } from 'lucide-react';

type Mode = 'buy' | 'sell' | 'login';

function App() {
  const [mode, setMode] = useState<Mode>('buy');
  const [amount, setAmount] = useState('1000');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState('10.64');
  const [showDetails, setShowDetails] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showError, setShowError] = useState(false);

  // Constants
  const USDT_TO_INR = 93;
  const ONRAMP_FEE_RATE = 0.0025; // 2.5 Rs per 1000 Rs
  const TDS_RATE = 0.01; // 1%
  const PAYMENT_GATEWAY_FEE = 11.8;
  const MIN_INR_AMOUNT = 1000;
  const MIN_USDT_AMOUNT = 10;

  const handleBack = () => {
    setShowWalletModal(false);
  };

  const calculateBuyFees = (inrAmount: number) => {
    const onrampFee = Math.max((inrAmount * ONRAMP_FEE_RATE), 2.5);
    return {
      onrampFee: onrampFee.toFixed(2),
      blockchainFee: '0',
      totalFee: onrampFee.toFixed(2)
    };
  };

  const calculateSellFees = (usdtAmount: number) => {
    const inrValue = usdtAmount * USDT_TO_INR;
    const onrampFee = Math.max((usdtAmount * 0.25), 2.5);
    const tds = (inrValue * TDS_RATE);
    return {
      onrampFee: onrampFee.toFixed(2),
      tds: tds.toFixed(2),
      paymentGatewayFee: PAYMENT_GATEWAY_FEE.toFixed(2),
      totalFee: (onrampFee + tds + PAYMENT_GATEWAY_FEE).toFixed(2)
    };
  };

  const handleAmountChange = (value: string) => {
    setShowError(false);
    if (mode === 'buy') {
      const numValue = parseFloat(value) || 0;
      if (numValue < MIN_INR_AMOUNT) {
        setShowError(true);
      }
      setAmount(value);
      setCryptoAmount((numValue / USDT_TO_INR).toFixed(2));
    } else if (mode === 'sell') {
      const numValue = parseFloat(value) || 0;
      if (numValue < MIN_USDT_AMOUNT) {
        setAmount(MIN_USDT_AMOUNT.toString());
        setCryptoAmount((MIN_USDT_AMOUNT * USDT_TO_INR).toFixed(2));
      } else {
        setAmount(value);
        setCryptoAmount((numValue * USDT_TO_INR).toFixed(2));
      }
    }
  };

  const renderContent = () => {
    if (mode === 'login') {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Enter mobile number</h2>
          <p className="text-sm text-gray-500 mb-6">Sign up or log in with your mobile number</p>
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 h-5" />
              <span>+91</span>
            </div>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="mobile number"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium mb-4">
            Next
          </button>
          <p className="text-xs text-gray-500 text-center">
            By clicking Next, you agree to our Terms and Conditions and Privacy Policy
          </p>
        </div>
      );
    }

    const fees = mode === 'buy' 
      ? calculateBuyFees(parseFloat(amount) || 0)
      : calculateSellFees(parseFloat(amount) || 0);

    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('buy')}
              className={`flex-1 py-2 rounded-lg font-medium ${
                mode === 'buy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`flex-1 py-2 rounded-lg font-medium ${
                mode === 'sell'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">{mode === 'buy' ? 'Pay' : 'Sell'}</label>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-xl"
                placeholder="0"
                min={mode === 'buy' ? MIN_INR_AMOUNT : MIN_USDT_AMOUNT}
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow">
                {mode === 'buy' ? (
                  <>
                    <img src="https://flagcdn.com/w20/in.png" alt="INR" className="w-5 h-5" />
                    <span>INR</span>
                  </>
                ) : (
                  <>
                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-5 h-5" />
                    <span>USDT</span>
                  </>
                )}
              </div>
            </div>
            {showError && mode === 'buy' && (
              <p className="text-red-500 text-sm">Minimum amount is ₹1,000</p>
            )}
          </div>

          {/* Crypto Amount */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">You get</label>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={cryptoAmount}
                readOnly
                className="flex-1 bg-transparent outline-none text-xl"
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow">
                {mode === 'buy' ? (
                  <>
                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-5 h-5" />
                    <span>USDT</span>
                  </>
                ) : (
                  <>
                    <img src="https://flagcdn.com/w20/in.png" alt="INR" className="w-5 h-5" />
                    <span>INR</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-1">
              <span>1 USDT ≈ ₹{USDT_TO_INR}</span>
              <span>BEP20 · Network Fee ₹0</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-600">
                {mode === 'buy' ? `You pay ₹${amount}` : `You get ₹${cryptoAmount}`} including fees
              </span>
              <ArrowUpDown size={16} />
            </button>
            {showDetails && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Onramp fee</span>
                  <span>₹{fees.onrampFee}</span>
                </div>
                {mode === 'buy' && (
                  <div className="flex justify-between text-sm">
                    <span>Blockchain Fee</span>
                    <span>₹{fees.blockchainFee} (0 USDT)</span>
                  </div>
                )}
                {mode === 'sell' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>TDS (1%)</span>
                      <span>₹{fees.tds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment gateway fee</span>
                      <span>₹{fees.paymentGatewayFee}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total fee</span>
                  <span>₹{fees.totalFee}</span>
                </div>
                {mode === 'sell' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Note: TDS of 1% is levied by Income Tax department, GoI
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          {mode === 'buy' && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Pay with</label>
              <div className="flex items-center justify-center p-4">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png?f=webp"
                  alt="UPI"
                  className="h-12"
                />
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={() => setShowWalletModal(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[url('https://t4.ftcdn.net/jpg/02/07/15/43/360_F_207154341_oGjfqwyT7r1Er73QSQQGvuYiDZdHtmCX.jpg')] bg-cover bg-center">
      <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setShowSidebar(true)} className="p-2">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold">Fiat to Crypto</h1>
            <button onClick={() => {
              setShowWalletModal(false);
              setMode('buy');
            }} className="p-2">
              <X size={24} />
            </button>
          </div>

          {!showWalletModal ? renderContent() : (
            /* Wallet Connection Modal */
            <div className="p-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-6"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h2 className="text-xl font-semibold mb-4">Enter Address</h2>
              <input
                type="text"
                placeholder="BEP20 network address (0x...)"
                className="w-full p-4 bg-gray-50 rounded-lg mb-4"
              />
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <p className="text-sm">
                  Address must support the network/token:
                  <br />
                  Network: BEP20
                  <br />
                  Token: USDT
                </p>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium">
                Connect wallet
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSidebar(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button onClick={() => setShowSidebar(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <button 
                  className="w-full text-left py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setMode('buy');
                    setShowSidebar(false);
                  }}
                >
                  Buy
                </button>
                <button 
                  className="w-full text-left py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setMode('sell');
                    setShowSidebar(false);
                  }}
                >
                  Sell
                </button>
                <button 
                  className="w-full text-left py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setMode('login');
                    setShowSidebar(false);
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;