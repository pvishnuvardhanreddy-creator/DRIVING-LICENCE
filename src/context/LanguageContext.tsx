import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    portalTitle: 'Ministry of Road Transport & Highways',
    appHeading: 'RTO Vehicle Registration & Driving License Portal',
    subHeading: 'Government of India e-Governance Services',
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    vehicleRegistration: 'Vehicle Registration',
    drivingLicense: 'Driving License',
    onlineServices: 'Online Services',
    contact: 'Contact Us',
    trackApplication: 'Track Application',
    payFees: 'Pay Fees',
    applyLicense: 'Apply License',
    renewLicense: 'Renew License',
    rcTransfer: 'RC Transfer',
    verifyQR: 'Scan / Verify QR',
    citizenPortal: 'Citizen Portal',
    officerPortal: 'RTO Officer Portal',
    adminPortal: 'Admin Dashboard',
    switchRole: 'Switch Role (Demo)',
    registeredVehicles: 'Registered Vehicles',
    activeLicenses: 'Active Licenses',
    pendingApps: 'Pending Applications',
    revenueGenerated: 'Total Fee Collected',
    aiAssistant: 'RTO Sahayak AI',
    darkTheme: 'Dark Theme',
    lightTheme: 'Light Theme',
  },
  hi: {
    portalTitle: 'सड़क परिवहन और राजमार्ग मंत्रालय',
    appHeading: 'आरटीओ वाहन पंजीकरण एवं ड्राइविंग लाइसेंस पोर्टल',
    subHeading: 'भारत सरकार ई-गवर्नेंस सेवाएं',
    home: 'मुख्य पृष्ठ',
    about: 'हमारे बारे में',
    services: 'सेवाएं',
    vehicleRegistration: 'वाहन पंजीकरण',
    drivingLicense: 'ड्राइविंग लाइसेंस',
    onlineServices: 'ऑनलाइन सेवाएं',
    contact: 'संपर्क करें',
    trackApplication: 'आवेदन ट्रैक करें',
    payFees: 'शुल्क भुगतान',
    applyLicense: 'लाइसेंस आवेदन',
    renewLicense: 'लाइसेंस नवीनीकरण',
    rcTransfer: 'आरसी ट्रांसफर',
    verifyQR: 'क्यूआर स्कैन / जांच',
    citizenPortal: 'नागरिक पोर्टल',
    officerPortal: 'आरटीओ अधिकारी पोर्टल',
    adminPortal: 'एडमिन डैशबोर्ड',
    switchRole: 'भूमिका बदलें (डेमो)',
    registeredVehicles: 'पंजीकृत वाहन',
    activeLicenses: 'सक्रिय लाइसेंस',
    pendingApps: 'लंबित आवेदन',
    revenueGenerated: 'कुल शुल्क संग्रह',
    aiAssistant: 'आरटीओ सहायक एआई',
    darkTheme: 'डार्क मोड',
    lightTheme: 'लाइट मोड',
  },
  mr: {
    portalTitle: 'रस्ते वाहतूक आणि महामार्ग मंत्रालय',
    appHeading: 'RTO वाहन नोंदणी आणि ड्रायव्हिंग लायसन्स पोर्टल',
    subHeading: 'महाराष्ट्र शासन / भारत सरकार ई-सेवा',
    home: 'मुख्यपृष्ठ',
    about: 'आमच्याबद्दल',
    services: 'सेवा',
    vehicleRegistration: 'वाहन नोंदणी',
    drivingLicense: 'ड्रायव्हिंग लायसन्स',
    onlineServices: 'ऑनलाईन सेवा',
    contact: 'संपर्क',
    trackApplication: 'अर्जाची स्थिती',
    payFees: 'शुल्क भरा',
    applyLicense: 'लायसन्स अर्ज',
    renewLicense: 'लायसन्स नूतनीकरण',
    rcTransfer: 'आरसी हस्तांतरण',
    verifyQR: 'क्यूआर तपासा',
    citizenPortal: 'नागरिक पोर्टल',
    officerPortal: 'RTO अधिकारी पोर्टल',
    adminPortal: 'प्रशासक डॅशबोर्ड',
    switchRole: 'रोल बदला (डेमो)',
    registeredVehicles: 'नोंदणीकृत वाहने',
    activeLicenses: 'सक्रिय लायसन्स',
    pendingApps: 'प्रलंबित अर्ज',
    revenueGenerated: 'एकूण जमा शुल्क',
    aiAssistant: 'RTO सहाय्यक AI',
    darkTheme: 'डार्क मोड',
    lightTheme: 'लाइट मोड',
  },
  ta: {
    portalTitle: 'சாலைப் போக்குவரத்து மற்றும் நெடுஞ்சாலைத் துறை',
    appHeading: 'RTO வாகனப் பதிவு மற்றும் ஓட்டுநர் உரிம இணையதளம்',
    subHeading: 'இந்திய அரசு மின்-ஆளுமை சேவைகள்',
    home: 'முகப்பு',
    about: 'எங்களைப் பற்றி',
    services: 'சேவைகள்',
    vehicleRegistration: 'வாகனப் பதிவு',
    drivingLicense: 'ஓட்டுநர் உரிமம்',
    onlineServices: 'ஆன்லைன் சேவைகள்',
    contact: 'தொடர்புகொள்ள',
    trackApplication: 'விண்ணப்ப நிலை',
    payFees: 'கட்டணம் செலுத்துக',
    applyLicense: 'உரிமம் விண்ணப்பிக்க',
    renewLicense: 'புதுப்பித்தல்',
    rcTransfer: 'RC மாற்றம்',
    verifyQR: 'QR சரிபார்ப்பு',
    citizenPortal: 'குடிமக்கள் தளம்',
    officerPortal: 'RTO அதிகாரி தளம்',
    adminPortal: 'நிர்வாகி தளம்',
    switchRole: 'பங்கு மாற்றம்',
    registeredVehicles: 'பதிவுசெய்த வாகனங்கள்',
    activeLicenses: 'செயலில் உள்ள உரிமங்கள்',
    pendingApps: 'நிலுவையில் உள்ள விண்ணப்பங்கள்',
    revenueGenerated: 'மொத்த கட்டணம்',
    aiAssistant: 'RTO AI உதவி',
    darkTheme: 'இரவு முறை',
    lightTheme: 'பகல் முறை',
  },
  te: {
    portalTitle: 'రవాణా మరియు రహదారుల మంత్రిత్వ శాఖ',
    appHeading: 'RTO వాహన నమోదు & డ్రైవింగ్ లైసెన్స్ పోర్టల్',
    subHeading: 'భారత ప్రభుత్వం ఈ-గవర్నెన్స్ సేవలు',
    home: 'హోమ్',
    about: 'మా గురించి',
    services: 'సేవలు',
    vehicleRegistration: 'వాహన నమోదు',
    drivingLicense: 'డ్రైవింగ్ లైసెన్స్',
    onlineServices: 'ఆన్‌లైన్ సేవలు',
    contact: 'సంప్రదించండి',
    trackApplication: 'దరఖాస్తు స్థితి',
    payFees: 'ఫీజు చెల్లించండి',
    applyLicense: 'లైసెన్స్ దరఖాస్తు',
    renewLicense: 'లైసెన్స్ పునరుద్ధరణ',
    rcTransfer: 'RC బదిలీ',
    verifyQR: 'QR తనిఖీ',
    citizenPortal: 'పౌరుల పోర్టల్',
    officerPortal: 'RTO అధికారి పోర్టల్',
    adminPortal: 'అడ్మిన్ డాష్‌బోర్డ్',
    switchRole: 'పాత్ర మార్చండి',
    registeredVehicles: 'నమోదిత వాహనాలు',
    activeLicenses: 'యాక్టివ్ లైసెన్సులు',
    pendingApps: 'పెండింగ్ దరఖాస్తులు',
    revenueGenerated: 'మొత్తం వసూళ్లు',
    aiAssistant: 'RTO సహాయక్ AI',
    darkTheme: 'డార్క్ థీమ్',
    lightTheme: 'లైట్ థీమ్',
  },
  bn: {
    portalTitle: 'সড়ক পরিবহন ও মহাসড়ক মন্ত্রক',
    appHeading: 'আরটিও যানবাহন নিবন্ধন ও ড্রাইভিং লাইসেন্স পোর্টাল',
    subHeading: 'ভারত সরকার ই-গভর্ন্যান্স পরিষেবা',
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    services: 'পরিষেবা',
    vehicleRegistration: 'যানবাহন নিবন্ধন',
    drivingLicense: 'ড্রাইভিং লাইসেন্স',
    onlineServices: 'অনলাইন পরিষেবা',
    contact: 'যোগাযোগ',
    trackApplication: 'আবেদন ট্র্যাক করুন',
    payFees: 'ফি প্রদান করুন',
    applyLicense: 'লাইসেন্স আবেদন',
    renewLicense: 'লাইসেন্স নবায়ন',
    rcTransfer: 'আরসি মালিকানা স্থানান্তর',
    verifyQR: 'কিউআর যাচাই',
    citizenPortal: 'নাগরিক পোর্টাল',
    officerPortal: 'আরটিও অফিসার পোর্টাল',
    adminPortal: 'অ্যাডমিন ড্যাশবোর্ড',
    switchRole: 'রোল পরিবর্তন করুন',
    registeredVehicles: 'নিবন্ধিত যানবাহন',
    activeLicenses: 'সক্রিয় লাইসেন্স',
    pendingApps: 'পেন্ডিং আবেদন',
    revenueGenerated: 'মোট ফি সংগৃহীত',
    aiAssistant: 'আরটিও সহায়ক এআই',
    darkTheme: 'ডার্ক থিম',
    lightTheme: 'লাইট থিম',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
