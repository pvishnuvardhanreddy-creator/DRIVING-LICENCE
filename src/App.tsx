import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/public/HeroSection';
import { LoginModal } from './components/public/LoginModal';
import { QROnlineVerifierModal } from './components/public/QROnlineVerifierModal';
import { AIChatbot } from './components/public/AIChatbot';
import { UniversalSearchModal } from './components/public/UniversalSearchModal';
import { GrievancePortalModal } from './components/public/GrievancePortalModal';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ApplyLicenseModal } from './components/citizen/ApplyLicenseModal';
import { ApplyVehicleRegistrationModal } from './components/citizen/ApplyVehicleRegistrationModal';
import { PaymentGatewayModal } from './components/citizen/PaymentGatewayModal';
import { OnlineTestSimulatorModal } from './components/citizen/OnlineTestSimulatorModal';
import { DigitalSmartCardModal } from './components/citizen/DigitalSmartCardModal';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DrivingLicense, Vehicle, PaymentRecord } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Modal Visibility States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isApplyLicenseOpen, setIsApplyLicenseOpen] = useState(false);
  const [isApplyVehicleOpen, setIsApplyVehicleOpen] = useState(false);
  const [isPayFeesOpen, setIsPayFeesOpen] = useState(false);
  const [isTestSimulatorOpen, setIsTestSimulatorOpen] = useState(false);
  const [smartCardLicense, setSmartCardLicense] = useState<DrivingLicense | undefined>(undefined);
  const [smartCardVehicle, setSmartCardVehicle] = useState<Vehicle | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenSearchWithQuery = (q: string) => {
    setSearchQuery(q);
    setIsSearchOpen(true);
  };

  const handleOpenLicenseApply = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setIsApplyLicenseOpen(true);
  };

  const handleOpenVehicleApply = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setIsApplyVehicleOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-gray-900 font-sans selection:bg-[#0A4D8C] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenQRModal={() => setIsQROpen(true)}
        onOpenAIChat={() => setIsAIOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* PUBLIC LANDING VIEW (when not logged in or on Home view) */}
        {!user && (
          <HeroSection
            onOpenApplyLicense={handleOpenLicenseApply}
            onOpenApplyVehicle={handleOpenVehicleApply}
            onOpenPayFees={() => setIsLoginOpen(true)}
            onOpenQRVerify={() => setIsQROpen(true)}
            onOpenSearchWithQuery={handleOpenSearchWithQuery}
          />
        )}

        {/* CITIZEN PORTAL DASHBOARD */}
        {user && user.role === 'citizen' && (
          <CitizenDashboard
            onOpenApplyLicense={handleOpenLicenseApply}
            onOpenApplyVehicle={handleOpenVehicleApply}
            onOpenPayFees={() => setIsPayFeesOpen(true)}
            onOpenTestSimulator={() => setIsTestSimulatorOpen(true)}
            onViewSmartCardLicense={(lic) => {
              setSmartCardLicense(lic);
              setSmartCardVehicle(undefined);
            }}
            onViewSmartCardVehicle={(v) => {
              setSmartCardVehicle(v);
              setSmartCardLicense(undefined);
            }}
          />
        )}

        {/* OFFICER PORTAL DASHBOARD */}
        {user && user.role === 'officer' && <OfficerDashboard />}

        {/* ADMIN PORTAL DASHBOARD */}
        {user && user.role === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onOpenGrievance={() => setIsGrievanceOpen(true)} />

      {/* MODALS */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <QROnlineVerifierModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />

      <AIChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
      />

      <GrievancePortalModal isOpen={isGrievanceOpen} onClose={() => setIsGrievanceOpen(false)} />

      <ApplyLicenseModal
        isOpen={isApplyLicenseOpen}
        onClose={() => setIsApplyLicenseOpen(false)}
        onApplicationCreated={() => {
          // Trigger refresh or notification
        }}
      />

      <ApplyVehicleRegistrationModal
        isOpen={isApplyVehicleOpen}
        onClose={() => setIsApplyVehicleOpen(false)}
        onApplicationCreated={() => {
          // Trigger refresh
        }}
      />

      <PaymentGatewayModal
        isOpen={isPayFeesOpen}
        onClose={() => setIsPayFeesOpen(false)}
        applicationId="RTO2026-88120"
        applicantName={user?.name || 'Rajesh Sharma'}
        purpose="Driving License Fee + Smart Card Printing Charge"
        amount={1100}
        onPaymentSuccess={(receipt: PaymentRecord) => {
          // Trigger receipt acknowledge
        }}
      />

      <OnlineTestSimulatorModal
        isOpen={isTestSimulatorOpen}
        onClose={() => setIsTestSimulatorOpen(false)}
      />

      <DigitalSmartCardModal
        isOpen={!!smartCardLicense || !!smartCardVehicle}
        onClose={() => {
          setSmartCardLicense(undefined);
          setSmartCardVehicle(undefined);
        }}
        license={smartCardLicense}
        vehicle={smartCardVehicle}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
