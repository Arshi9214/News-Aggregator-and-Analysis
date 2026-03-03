import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, BookOpen, FileText, Globe, Download, HelpCircle } from 'lucide-react';
import { Language, ThemeMode } from '../App';

interface OnboardingProps {
  language: Language;
  onComplete: () => void;
  themeMode?: ThemeMode;
}

interface OnboardingStep {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: any;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: {
      en: 'Welcome to AI News Analyzer! 🚀',
      hi: 'AI न्यूज़ एनालाइज़र में आपका स्वागत है! 🚀',
      ta: 'AI செய்தி பகுப்பாய்வாளருக்கு வரவேற்கிறோம்! 🚀',
      bn: 'AI নিউজ অ্যানালাইজারে স্বাগতম! 🚀',
      te: 'AI న్యూస్ అనలైజర్కు స్వాగతం! 🚀',
      mr: 'AI न्यूज अॅनालायझरमध्ये आपले स्वागत! 🚀',
      gu: 'AI ન્યૂઝ એનાલાઇઝરમાં આપનું સ્વાગત! 🚀',
      kn: 'AI ನ್ಯೂಸ್ ಅನಾಲೈಜರ್ಗೆ ಸ್ವಾಗತ! 🚀',
      ml: 'AI ന്യൂസ് അനലൈസറിലേക്ക് സ്വാഗതം! 🚀',
      pa: 'AI ਨਿਊਜ਼ ਐਨਾਲਾਇਜ਼ਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ! 🚀',
      ur: 'AI نیوز تجزیہ کار میں خوش آمدید! 🚀'
    },
    description: {
      en: 'Get comprehensive news analysis with AI-powered full article summaries, web scraping, and detailed insights. Perfect for competitive exam preparation!',
      hi: 'AI-संचालित पूर्ण लेख सारांश, वेब स्क्रैपिंग और विस्तृत अंतर्दृष्टि के साथ व्यापक समाचार विश्लेषण प्राप्त करें। प्रतियोगी परीक्षा की तैयारी के लिए एकदम सही!',
      ta: 'AI-இயங்கும் முழு கட்டுரை சுருக்கங்கள், வலை ஸ்கிராப்பிங் மற்றும் விரிவான நுண்ணறிவுகளுடன் விரிவான செய்தி பகுப்பாய்வைப் பெறுங்கள். போட்டித் தேர்வு தயாரிப்புக்கு சரியானது!',
      bn: 'AI-চালিত সম্পূর্ণ নিবন্ধ সারাংশ, ওয়েব স্ক্র্যাপিং এবং বিস্তারিত অন্তর্দৃষ্টি সহ ব্যাপক সংবাদ বিশ্লেষণ পান। প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতির জন্য নিখুঁত!',
      te: 'AI-శక్తితో కూడిన పూర్తి వ్యాసాల సారాంశాలు, వెబ్ స్క్రాపింగ్ మరియు వివరణాత్మక అంతర్దృష్టులతో సమగ్ర వార్తా విశ్లేషణను పొందండి। పోటీ పరీక్షల తయారీకి సరైనది!',
      mr: 'AI-चालित संपूर्ण लेख सारांश, वेब स्क्रॅपिंग आणि तपशीलवार अंतर्दृष्टीसह सर्वसमावेशक बातम्या विश्लेषण मिळवा। स्पर्धा परीक्षांच्या तयारीसाठी योग्य!',
      gu: 'AI-સંચાલિત સંપૂર્ણ લેખ સારાંશ, વેબ સ્ક્રેપિંગ અને વિગતવાર આંતરદૃષ્ટિ સાથે વ્યાપક સમાચાર વિશ્લેષણ મેળવો। સ્પર્ધાત્મક પરીક્ષાની તૈયારી માટે યોગ્ય!',
      kn: 'AI-ಚಾಲಿತ ಸಂಪೂರ್ಣ ಲೇಖನ ಸಾರಾಂಶಗಳು, ವೆಬ್ ಸ್ಕ್ರಾಪಿಂಗ್ ಮತ್ತು ವಿವರವಾದ ಒಳನೋಟಗಳೊಂದಿಗೆ ಸಮಗ್ರ ಸುದ್ದಿ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಿರಿ। ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಯ ತಯಾರಿಕೆಗೆ ಸೂಕ್ತ!',
      ml: 'AI-പവർഡ് പൂർണ്ണ ലേഖന സംഗ്രഹങ്ങൾ, വെബ് സ്ക്രാപ്പിംഗ്, വിശദമായ ഉൾക്കാഴ്ചകൾ എന്നിവയോടെ സമഗ്ര വാർത്താ വിശകലനം നേടുക. മത്സര പരീക്ഷാ തയ്യാറെടുപ്പിന് അനുയോജ്യം!',
      pa: 'AI-ਸੰਚਾਲਿਤ ਪੂਰੇ ਲੇਖ ਸਾਰਾਂਸ਼, ਵੈੱਬ ਸਕ੍ਰੈਪਿੰਗ ਅਤੇ ਵਿਸਤ੍ਰਿਤ ਸੂਝ-ਬੂਝ ਨਾਲ ਵਿਆਪਕ ਖ਼ਬਰਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰੋ। ਪ੍ਰਤੀਯੋਗੀ ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਲਈ ਸੰਪੂਰਨ!',
      ur: 'AI سے چلنے والے مکمل مضمون کے خلاصے، ویب سکریپنگ اور تفصیلی بصیرت کے ساتھ جامع خبروں کا تجزیہ حاصل کریں۔ مسابقتی امتحان کی تیاری کے لیے بہترین!'
    },
    icon: Sparkles
  },
  {
    id: 'full-article-analysis',
    title: {
      en: 'Full Article Analysis 🌐',
      hi: 'पूर्ण लेख विश्लेषण 🌐',
      ta: 'முழு கட்டுரை பகுப்பாய்வு 🌐',
      bn: 'সম্পূর্ণ নিবন্ধ বিশ্লেষণ 🌐',
      te: 'పూర్తి వ్యాసం విశ్లేషణ 🌐',
      mr: 'संपूर्ण लेख विश्लेषण 🌐',
      gu: 'સંપૂર્ણ લેખ વિશ્લેષણ 🌐',
      kn: 'ಸಂಪೂರ್ಣ ಲೇಖನ ವಿಶ್ಲೇಷಣೆ 🌐',
      ml: 'പൂർണ്ണ ലേഖന വിശകലനം 🌐',
      pa: 'ਪੂਰਾ ਲੇਖ ਵਿਸ਼ਲੇਸ਼ਣ 🌐',
      ur: 'مکمل مضمون کا تجزیہ 🌐'
    },
    description: {
      en: 'Our AI fetches complete article content from news websites (not just headlines) and provides detailed 4-5 sentence summaries with specific facts, numbers, and context.',
      hi: 'हमारा AI समाचार वेबसाइटों से पूर्ण लेख सामग्री प्राप्त करता है (केवल शीर्षक नहीं) और विशिष्ट तथ्यों, संख्याओं और संदर्भ के साथ विस्तृत 4-5 वाक्य सारांश प्रदान करता है।',
      ta: 'எங்கள் AI செய்தி வலைத்தளங்களிலிருந்து முழுமையான கட்டுரை உள்ளடக்கத்தைப் பெறுகிறது (தலைப்புகள் மட்டுமல்ல) மற்றும் குறிப்பிட்ட உண்மைகள், எண்கள் மற்றும் சூழலுடன் விரிவான 4-5 வாக்கிய சுருக்கங்களை வழங்குகிறது।',
      bn: 'আমাদের AI সংবাদ ওয়েবসাইট থেকে সম্পূর্ণ নিবন্ধের বিষয়বস্তু সংগ্রহ করে (শুধু শিরোনাম নয়) এবং নির্দিষ্ট তথ্য, সংখ্যা এবং প্রসঙ্গ সহ বিস্তারিত 4-5 বাক্যের সারাংশ প্রদান করে।',
      te: 'మా AI వార్తా వెబ్‌సైట్‌ల నుండి పూర్తి వ్యాస కంటెంట్‌ను పొందుతుంది (కేవలం హెడ్‌లైన్‌లు మాత్రమే కాదు) మరియు నిర్దిష్ట వాస్తవాలు, సంఖ్యలు మరియు సందర్భంతో వివరణాత్మక 4-5 వాక్య సారాంశాలను అందిస్తుంది।',
      mr: 'आमचे AI बातम्या वेबसाइटवरून संपूर्ण लेख सामग्री मिळवते (फक्त मथळे नाही) आणि विशिष्ट तथ्ये, संख्या आणि संदर्भासह तपशीलवार 4-5 वाक्य सारांश प्रदान करते.',
      gu: 'અમારું AI સમાચાર વેબસાઇટ્સમાંથી સંપૂર્ણ લેખ સામગ્રી મેળવે છે (માત્ર હેડલાઇન્સ નહીં) અને વિશિષ્ટ તથ્યો, સંખ્યાઓ અને સંદર્ભ સાથે વિગતવાર 4-5 વાક્ય સારાંશ પ્રદાન કરે છે.',
      kn: 'ನಮ್ಮ AI ಸುದ್ದಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಂದ ಸಂಪೂರ್ಣ ಲೇಖನ ವಿಷಯವನ್ನು ಪಡೆಯುತ್ತದೆ (ಕೇವಲ ಶೀರ್ಷಿಕೆಗಳಲ್ಲ) ಮತ್ತು ನಿರ್ದಿಷ್ಟ ಸತ್ಯಗಳು, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಸಂದರ್ಭದೊಂದಿಗೆ ವಿವರವಾದ 4-5 ವಾಕ್ಯ ಸಾರಾಂಶಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.',
      ml: 'ഞങ്ങളുടെ AI വാർത്താ വെബ്‌സൈറ്റുകളിൽ നിന്ന് പൂർണ്ണമായ ലേഖന ഉള്ളടക്കം ലഭിക്കുന്നു (കേവലം തലക്കെട്ടുകൾ മാത്രമല്ല) കൂടാതെ നിർദ്ദിഷ്ട വസ്തുതകൾ, സംഖ്യകൾ, സന്ദർഭം എന്നിവയോടെ വിശദമായ 4-5 വാക്യ സംഗ്രഹങ്ങൾ നൽകുന്നു.',
      pa: 'ਸਾਡਾ AI ਖ਼ਬਰਾਂ ਦੀਆਂ ਵੈੱਬਸਾਈਟਾਂ ਤੋਂ ਪੂਰਾ ਲੇਖ ਸਮੱਗਰੀ ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ (ਸਿਰਫ਼ ਸਿਰਲੇਖ ਨਹੀਂ) ਅਤੇ ਖਾਸ ਤੱਥਾਂ, ਸੰਖਿਆਵਾਂ ਅਤੇ ਸੰਦਰਭ ਦੇ ਨਾਲ ਵਿਸਤ੍ਰਿਤ 4-5 ਵਾਕ ਸਾਰਾਂਸ਼ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।',
      ur: 'ہمارا AI خبروں کی ویب سائٹس سے مکمل مضمون کا مواد حاصل کرتا ہے (صرف سرخیاں نہیں) اور مخصوص حقائق، اعداد اور سیاق و سباق کے ساتھ تفصیلی 4-5 جملوں کا خلاصہ فراہم کرتا ہے۔'
    },
    icon: Globe,
    targetElement: 'news-cards',
    position: 'top'
  },
  {
    id: 'smart-summaries',
    title: {
      en: 'Smart AI Summaries ⚡',
      hi: 'स्मार्ट AI सारांश ⚡',
      ta: 'ஸ்மார்ட் AI சுருக்கங்கள் ⚡',
      bn: 'স্মার্ট AI সারাংশ ⚡',
      te: 'స్మార్ట్ AI సారాంశాలు ⚡',
      mr: 'स्मार्ट AI सारांश ⚡',
      gu: 'સ્માર્ટ AI સારાંશ ⚡',
      kn: 'ಸ್ಮಾರ್ಟ್ AI ಸಾರಾಂಶಗಳು ⚡',
      ml: 'സ്മാർട്ട് AI സംഗ്രഹങ്ങൾ ⚡',
      pa: 'ਸਮਾਰਟ AI ਸਾਰਾਂਸ਼ ⚡',
      ur: 'سمارٹ AI خلاصے ⚡'
    },
    description: {
      en: 'Click "Generate Summary" to get professional-grade analysis with specific details from the full article.',
      hi: '"सारांश जेनरेट करें" पर क्लिक करके पूर्ण लेख से विशिष्ट विवरण के साथ पेशेवर-ग्रेड विश्लेषण प्राप्त करें।',
      ta: 'முழு கட்டுரையிலிருந்து குறிப்பிட்ட விவரங்களுடன் தொழில்முறை-தர பகுப்பாய்வைப் பெற "சுருக்கம் உருவாக்கு" என்பதைக் கிளிக் செய்யவும்.',
      bn: 'সম্পূর্ণ নিবন্ধ থেকে নির্দিষ্ট বিবরণ সহ পেশাদার-গ্রেড বিশ্লেষণ পেতে "সারাংশ তৈরি করুন" ক্লিক করুন।',
      te: 'పూర్తి వ్యాసం నుండి నిర్దిష్ట వివరాలతో వృత్తిపరమైన-గ్రేడ్ విశ్లేషణ పొందడానికి "సారాంశం రూపొందించండి" క్లిక్ చేయండి।',
      mr: 'संपूर्ण लेखातील विशिष्ट तपशीलांसह व्यावसायिक-दर्जाचे विश्लेषण मिळविण्यासाठी "सारांश तयार करा" वर क्लिक करा.',
      gu: 'સંપૂર્ણ લેખમાંથી વિશિષ્ટ વિગતો સાથે વ્યાવસાયિક-ગ્રેડ વિશ્લેષણ મેળવવા માટે "સારાંશ બનાવો" પર ક્લિક કરો.',
      kn: 'ಸಂಪೂರ್ಣ ಲೇಖನದಿಂದ ನಿರ್ದಿಷ್ಟ ವಿವರಗಳೊಂದಿಗೆ ವೃತ್ತಿಪರ-ದರ್ಜೆಯ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಲು "ಸಾರಾಂಶವನ್ನು ರಚಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
      ml: 'പൂർണ്ണ ലേഖനത്തിൽ നിന്ന് നിർദ്ദിഷ്ട വിശദാംശങ്ങളോടെ പ്രൊഫഷണൽ-ഗ്രേഡ് വിശകലനം നേടാൻ "സംഗ്രഹം സൃഷ്ടിക്കുക" ക്ലിക്ക് ചെയ്യുക.',
      pa: 'ਪੂਰੇ ਲੇਖ ਤੋਂ ਖਾਸ ਵੇਰਵਿਆਂ ਦੇ ਨਾਲ ਪੇਸ਼ੇਵਰ-ਗ੍ਰੇਡ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ "ਸਾਰਾਂਸ਼ ਬਣਾਓ" ਤੇ ਕਲਿੱਕ ਕਰੋ।',
      ur: 'مکمل مضمون سے مخصوص تفصیلات کے ساتھ پیشہ ورانہ درجے کا تجزیہ حاصل کرنے کے لیے "خلاصہ بنائیں" پر کلک کریں۔'
    },
    icon: BookOpen,
    targetElement: 'news-cards',
    position: 'bottom'
  },
  {
    id: 'export-features',
    title: {
      en: 'Export & Study Offline 📥',
      hi: 'निर्यात और ऑफ़लाइन अध्ययन 📥',
      ta: 'ஏற்றுமதி மற்றும் ஆஃப்லைன் படிப்பு 📥',
      bn: 'রপ্তানি এবং অফলাইন অধ্যয়ন 📥',
      te: 'ఎగుమతి మరియు ఆఫ్‌లైన్ అధ్యయనం 📥',
      mr: 'निर्यात आणि ऑफलाइन अभ्यास 📥',
      gu: 'નિકાસ અને ઓફલાઇન અભ્યાસ 📥',
      kn: 'ರಫ್ತು ಮತ್ತು ಆಫ್‌ಲೈನ್ ಅಧ್ಯಯನ 📥',
      ml: 'കയറ്റുമതിയും ഓഫ്‌ലൈൻ പഠനവും 📥',
      pa: 'ਨਿਰਯਾਤ ਅਤੇ ਆਫਲਾਈਨ ਅਧਿਐਨ 📥',
      ur: 'برآمد اور آف لائن مطالعہ 📥'
    },
    description: {
      en: 'Download your analyzed articles and summaries as PDF or JSON files. Perfect for creating your own study materials and revision notes!',
      hi: 'अपने विश्लेषित लेखों और सारांशों को PDF या JSON फ़ाइलों के रूप में डाउनलोड करें। अपनी स्वयं की अध्ययन सामग्री और रिवीजन नोट्स बनाने के लिए एकदम सही!',
      ta: 'உங்கள் பகுப்பாய்வு செய்யப்பட்ட கட்டுரைகள் மற்றும் சுருக்கங்களை PDF அல்லது JSON கோப்புகளாக பதிவிறக்கம் செய்யுங்கள். உங்கள் சொந்த படிப்பு பொருட்கள் மற்றும் திருத்த குறிப்புகளை உருவாக்க சரியானது!',
      bn: 'আপনার বিশ্লেষিত নিবন্ধ এবং সারাংশগুলি PDF বা JSON ফাইল হিসাবে ডাউনলোড করুন। আপনার নিজস্ব অধ্যয়ন উপকরণ এবং পুনর্বিবেচনা নোট তৈরির জন্য নিখুঁত!',
      te: 'మీ విశ్లేషించిన వ్యాసాలు మరియు సారాంశాలను PDF లేదా JSON ఫైల్‌లుగా డౌన్‌లోడ్ చేయండి. మీ స్వంత అధ్యయన సామగ్రి మరియు రివిజన్ నోట్స్ సృష్టించడానికి సరైనది!',
      mr: 'तुमचे विश्लेषित लेख आणि सारांश PDF किंवा JSON फाइल्स म्हणून डाउनलोड करा. तुमची स्वतःची अभ्यास सामग्री आणि पुनरावलोकन नोट्स तयार करण्यासाठी योग्य!',
      gu: 'તમારા વિશ્લેષિત લેખો અને સારાંશને PDF અથવા JSON ફાઇલો તરીકે ડાઉનલોડ કરો. તમારી પોતાની અભ્યાસ સામગ્રી અને પુનરાવર્તન નોંધો બનાવવા માટે યોગ્ય!',
      kn: 'ನಿಮ್ಮ ವಿಶ್ಲೇಷಿಸಿದ ಲೇಖನಗಳು ಮತ್ತು ಸಾರಾಂಶಗಳನ್ನು PDF ಅಥವಾ JSON ಫೈಲ್‌ಗಳಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ. ನಿಮ್ಮ ಸ್ವಂತ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು ಮತ್ತು ಪುನರಾವರ್ತನೆ ಟಿಪ್ಪಣಿಗಳನ್ನು ರಚಿಸಲು ಸೂಕ್ತ!',
      ml: 'നിങ്ങളുടെ വിശകലനം ചെയ്ത ലേഖനങ്ങളും സംഗ്രഹങ്ങളും PDF അല്ലെങ്കിൽ JSON ഫയലുകളായി ഡൗൺലോഡ് ചെയ്യുക. നിങ്ങളുടെ സ്വന്തം പഠന സാമഗ്രികളും പുനരവലോകന കുറിപ്പുകളും സൃഷ്ടിക്കുന്നതിന് അനുയോജ്യം!',
      pa: 'ਆਪਣੇ ਵਿਸ਼ਲੇਸ਼ਿਤ ਲੇਖਾਂ ਅਤੇ ਸਾਰਾਂਸ਼ਾਂ ਨੂੰ PDF ਜਾਂ JSON ਫਾਈਲਾਂ ਦੇ ਰੂਪ ਵਿੱਚ ਡਾਊਨਲੋਡ ਕਰੋ। ਆਪਣੀ ਖੁਦ ਦੀ ਅਧਿਐਨ ਸਮੱਗਰੀ ਅਤੇ ਰਿਵਿਜ਼ਨ ਨੋਟਸ ਬਣਾਉਣ ਲਈ ਸੰਪੂਰਨ!',
      ur: 'اپنے تجزیہ شدہ مضامین اور خلاصوں کو PDF یا JSON فائلوں کے طور پر ڈاؤن لوڈ کریں۔ اپنا مطالعاتی مواد اور نظرثانی کے نوٹس بنانے کے لیے بہترین!'
    },
    icon: Download,
    targetElement: 'export-button',
    position: 'left'
  }
];

const TRANSLATIONS = {
  en: {
    skip: 'Skip',
    next: 'Next',
    previous: 'Previous',
    finish: 'Start Analyzing!',
    helpButton: 'Need help? Click to restart tour',
    exploreSelf: 'I\'ll explore myself',
    poweredBy: 'Powered by advanced web scraping & AI analysis'
  },
  hi: {
    skip: 'छोड़ें',
    next: 'अगला',
    previous: 'पिछला',
    finish: 'विश्लेषण शुरू करें!',
    helpButton: 'सहायता चाहिए? टूर पुनः शुरू करने के लिए क्लिक करें',
    exploreSelf: 'मैं खुद देखूंगा',
    poweredBy: 'उन्नत वेब स्क्रैपिंग और AI विश्लेषण द्वारा संचालित'
  },
  ta: {
    skip: 'தவிர்க்கவும்',
    next: 'அடுத்து',
    previous: 'முந்தைய',
    finish: 'பகுப்பாய்வு தொடங்கு!',
    helpButton: 'உதவி தேவையா? சுற்றுப்பயணத்தை மறுதொடக்கம் செய்ய கிளிக் செய்யவும்',
    exploreSelf: 'நான் தானே பார்க்கிறேன்',
    poweredBy: 'மேம்பட்ட வலை ஸ்கிராப்பிங் மற்றும் AI பகுப்பாய்வால் இயக்கப்படுகிறது'
  },
  bn: {
    skip: 'এড়িয়ে যান',
    next: 'পরবর্তী',
    previous: 'পূর্ববর্তী',
    finish: 'বিশ্লেষণ শুরু করুন!',
    helpButton: 'সাহায্য দরকার? ট্যুর পুনরায় শুরু করতে ক্লিক করুন',
    exploreSelf: 'আমি নিজেই দেখব',
    poweredBy: 'উন্নত ওয়েব স্ক্র্যাপিং এবং AI বিশ্লেষণ দ্বারা চালিত'
  },
  te: {
    skip: 'దాటవేయండి',
    next: 'తదుపరి',
    previous: 'మునుపటి',
    finish: 'విశ్లేషణ ప్రారంభించండి!',
    helpButton: 'సహాయం కావాలా? టూర్ పునఃప్రారంభించడానికి క్లిక్ చేయండి',
    exploreSelf: 'నేను స్వయంగా చూస్తాను',
    poweredBy: 'అధునాతన వెబ్ స్క్రాపింగ్ మరియు AI విశ్లేషణతో శక్తివంతం'
  },
  mr: {
    skip: 'वगळा',
    next: 'पुढे',
    previous: 'मागे',
    finish: 'विश्लेषण सुरू करा!',
    helpButton: 'मदत हवी? टूर पुन्हा सुरू करण्यासाठी क्लिक करा',
    exploreSelf: 'मी स्वतः पाहीन',
    poweredBy: 'प्रगत वेब स्क्रॅपिंग आणि AI विश्लेषणाद्वारे चालविले'
  },
  gu: {
    skip: 'છોડો',
    next: 'આગળ',
    previous: 'પાછળ',
    finish: 'વિશ્લેષણ શરૂ કરો!',
    helpButton: 'મદદ જોઈએ? ટૂર ફરીથી શરૂ કરવા માટે ક્લિક કરો',
    exploreSelf: 'હું પોતે જોઈશ',
    poweredBy: 'અદ્યતન વેબ સ્ક્રેપિંગ અને AI વિશ્લેષણ દ્વારા સંચાલિત'
  },
  kn: {
    skip: 'ಬಿಟ್ಟುಬಿಡಿ',
    next: 'ಮುಂದೆ',
    previous: 'ಹಿಂದೆ',
    finish: 'ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ!',
    helpButton: 'ಸಹಾಯ ಬೇಕೇ? ಪ್ರವಾಸವನ್ನು ಮರುಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    exploreSelf: 'ನಾನು ಸ್ವತಃ ನೋಡುತ್ತೇನೆ',
    poweredBy: 'ಸುಧಾರಿತ ವೆಬ್ ಸ್ಕ್ರಾಪಿಂಗ್ ಮತ್ತು AI ವಿಶ್ಲೇಷಣೆಯಿಂದ ಚಾಲಿತ'
  },
  ml: {
    skip: 'ഒഴിവാക്കുക',
    next: 'അടുത്തത്',
    previous: 'മുമ്പത്തെ',
    finish: 'വിശകലനം ആരംഭിക്കുക!',
    helpButton: 'സഹായം വേണോ? ടൂർ പുനരാരംഭിക്കാൻ ക്ലിക്ക് ചെയ്യുക',
    exploreSelf: 'ഞാൻ തന്നെ നോക്കാം',
    poweredBy: 'വിപുലമായ വെബ് സ്ക്രാപ്പിംഗും AI വിശകലനവും കൊണ്ട് പ്രവർത്തിക്കുന്നു'
  },
  pa: {
    skip: 'ਛੱਡੋ',
    next: 'ਅਗਲਾ',
    previous: 'ਪਿਛਲਾ',
    finish: 'ਵਿਸ਼ਲੇਸ਼ਣ ਸ਼ੁਰੂ ਕਰੋ!',
    helpButton: 'ਮਦਦ ਚਾਹੀਦੀ ਹੈ? ਟੂਰ ਮੁੜ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
    exploreSelf: 'ਮੈਂ ਖੁਦ ਦੇਖਾਂਗਾ',
    poweredBy: 'ਉੱਨਤ ਵੈੱਬ ਸਕ੍ਰੈਪਿੰਗ ਅਤੇ AI ਵਿਸ਼ਲੇਸ਼ਣ ਦੁਆਰਾ ਸੰਚਾਲਿਤ'
  },
  ur: {
    skip: 'چھوڑیں',
    next: 'اگلا',
    previous: 'پچھلا',
    finish: 'تجزیہ شروع کریں!',
    helpButton: 'مدد چاہیے؟ ٹور دوبارہ شروع کرنے کے لیے کلک کریں',
    exploreSelf: 'میں خود دیکھوں گا',
    poweredBy: 'جدید ویب سکریپنگ اور AI تجزیہ سے چلایا جاتا ہے'
  }
};

export function Onboarding({ language, onComplete, themeMode }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const step = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboarding_completed');
    
    if (completed === 'true') {
      setHasCompletedOnboarding(true);
      setShowHelpButton(true);
    } else {
      // Show onboarding immediately for better UX
      setIsVisible(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    setShowHelpButton(true);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNext = () => {
    console.log(`Onboarding: Moving from step ${currentStep} to ${currentStep + 1}`);
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestartTour = () => {
    setCurrentStep(0);
    setHasCompletedOnboarding(false);
    setIsVisible(true);
    setShowHelpButton(false);
  };

  // Floating help button
  if (showHelpButton && !isVisible) {
    return (
      <button
        onClick={handleRestartTour}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 group ${
          themeMode === 'newspaper'
            ? 'bg-[#8b7355] hover:bg-[#6b5744] text-[#f9f3e8]'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label={t.helpButton}
        title={t.helpButton}
      >
        <HelpCircle className="h-6 w-6" />
        <span className={`absolute bottom-full right-0 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${
          themeMode === 'newspaper'
            ? 'bg-[#3d2817] text-[#f9f3e8]'
            : 'bg-gray-900 text-white'
        }`}>
          {t.helpButton}
        </span>
      </button>
    );
  }

  if (!isVisible) {
    return null;
  }

  const Icon = step.icon;
  const title = step.title[language] || step.title.en;
  const description = step.description[language] || step.description.en;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300" />

      {/* Onboarding Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-in zoom-in-95 fade-in duration-300 border-2 ${
          themeMode === 'newspaper'
            ? 'bg-[#f9f3e8] border-[#8b7355]'
            : 'bg-white dark:bg-gray-800 border-blue-500 dark:border-blue-400'
        }`}>
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={t.skip}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${
                themeMode === 'newspaper'
                  ? 'bg-[#8b7355]'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <Icon className={`h-7 w-7 ${
                  themeMode === 'newspaper' ? 'text-[#f9f3e8]' : 'text-white'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${
                  themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
                }`}>
                  {title}
                </h3>
              </div>
            </div>
            
            <p className={`leading-relaxed ${
              themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center gap-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? themeMode === 'newspaper' ? 'w-8 bg-[#8b7355]' : 'w-8 bg-blue-600 dark:bg-blue-500'
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : themeMode === 'newspaper' ? 'w-2 bg-[#ddd0ba]' : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              {currentStep + 1} / {ONBOARDING_STEPS.length}
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex items-center justify-between gap-3">
            {isFirstStep ? (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t.exploreSelf}
              </button>
            ) : (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.previous}
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105 shadow-lg ${
                themeMode === 'newspaper'
                  ? 'bg-[#8b7355] hover:bg-[#6b5744] text-[#f9f3e8]'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              {isLastStep ? t.finish : t.next}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight effect on target elements */}
      {step.targetElement && (
        <div 
          className="fixed z-45 pointer-events-none"
          style={{
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          {/* This would highlight the target element - implement based on your layout */}
        </div>
      )}
    </>
  );
}

/**
 * Hook to check onboarding status
 */
export function useOnboardingStatus() {
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed') === 'true';
    setHasCompleted(completed);
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setHasCompleted(false);
  };

  return { hasCompleted, resetOnboarding };
}
