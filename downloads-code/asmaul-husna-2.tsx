import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  Share,
  Dimensions,
  BackHandler,
} from "react-native";

type AsmaulHusnaItem = {
  id: number;
  arabic: string;
  transliteration: string;
  transliterationGu: string;
  english: string;
  gujarati: string;
};

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useLanguage } from "../src/context/LanguageContext";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "../src/utils/logger";
import { ScreenHeader } from "../src/components/common";

const asmaulHusnaLogger = createLogger("AsmaulHusna");

const { width } = Dimensions.get("window");

// 99 Names of Allah with Arabic, transliteration, and meanings
// const ASMAUL_HUSNA = [
//   { id: 1, arabic: 'الرَّحْمٰنُ', transliteration: 'Ar-Rahman', transliterationGu: 'અર-રહમાનુ', english: 'The Most Gracious', gujarati: 'ઘણો મહેરબાન' },
//   { id: 2, arabic: 'الرَّحِيْمُ', transliteration: 'Ar-Raheem', transliterationGu: 'અર-રહીમુ', english: 'The Most Merciful', gujarati: 'ખૂબ જ દયાળુ' },
//   { id: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', transliterationGu: 'અલ્-મલિકુ', english: 'The King, The Sovereign', gujarati: 'બાદશાહ' },
//   { id: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', transliterationGu: 'અલ્-કુદ્દુસુ', english: 'The Holy, The Pure', gujarati: 'પાક (તમામ ખામીઓથી પાક)' },
//   { id: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', transliterationGu: 'અસ્-સલામુ', english: 'The Source of Peace', gujarati: 'સલામત રાખનારો' },
//   { id: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', transliterationGu: 'અલ્-મુઅ્‌મિનુ', english: 'The Giver of Security', gujarati: 'શાંતિ આપનાર' },
//   { id: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', transliterationGu: 'અલ્-મુહૈમિનુ', english: 'The Guardian, The Protector', gujarati: 'દેખરેખ રાખનાર' },
//   { id: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', transliterationGu: 'અલ્-અઝીઝુ', english: 'The Almighty', gujarati: 'પ્રભાવશાળી (જબરદસ્ત)' },
//   { id: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', transliterationGu: 'અલ્-જબ્-બારુ', english: 'The Compeller', gujarati: 'મજબૂત પકડ રાખનાર' },
//   { id: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', transliterationGu: 'અલ્-મુ-તકબ્-બિરુ', english: 'The Supreme, The Majestic', gujarati: 'મહાનતાવાળો' },
//   { id: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', transliterationGu: 'અલ્-ખાલિકુ', english: 'The Creator', gujarati: 'તે તમામ વસ્તુઓને પેદા કરાવનારો જેને આપણે જોઈએ છે અને જેને આપણે નથી જોતા' },
//   { id: 12, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', transliterationGu: 'અલ્-મુસવ્-વિરુ', english: 'The Fashioner', gujarati: 'તમામ મખલૂકની અલગ અલગ સૂરત-શકલ (ચહેરો) બનાવનાર' },
//   { id: 13, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari', transliterationGu: 'અલ્-બારિઉ', english: 'The Maker, The Evolver', gujarati: 'સમગ્ર વિશ્વને બનાવનાર' },
//   { id: 14, arabic: 'الْأَوَّلُ', transliteration: 'Al-Awwal', transliterationGu: 'અલ્-અવ્‌વાલુ', english: 'The First', gujarati: 'સૌથી પ્રથમ' },
//   { id: 15, arabic: 'الْآخِرُ', transliteration: 'Al-Akhir', transliterationGu: 'અલ્-આખિરુ', english: 'The Last', gujarati: 'સૌથી અંતિમ' },
//   { id: 16, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', transliterationGu: 'અઝ્-ઝાહિરુ', english: 'The Manifest', gujarati: 'તમામ ચીજો પર પ્રભુત્વ ધરાવનારો' },
//   { id: 17, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', transliterationGu: 'અલ્-બાતિન', english: 'The Hidden', gujarati: 'છૂપી વાતોને જાણનારો' },
//   { id: 18, arabic: 'السَّمِيعُ', transliteration: 'As-Sami', transliterationGu: 'અસ્-સમીઉ', english: 'The All-Hearing', gujarati: 'સાંભળનારો (સાંભળનાર)' },
//   { id: 19, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', transliterationGu: 'અલ્-બસીરુ', english: 'The All-Seeing', gujarati: 'જોનારો (નજર રાખનાર)' },
//   { id: 20, arabic: 'الْمَوْلَى', transliteration: 'Al-Mawla', transliterationGu: 'અલ્-મવલા', english: 'The Protector, The Ally', gujarati: 'વળી (દરેક રીતે ખયાલ રાખનારો)' },
//   { id: 21, arabic: 'النَّصِيرُ', transliteration: 'An-Nasir', transliterationGu: 'અન્-નસીરુ', english: 'The Helper', gujarati: 'મદદગાર' },
//   { id: 22, arabic: 'الْعَفُوُّ', transliteration: 'Al-Afuww', transliterationGu: 'અલ્-અફુવ્‌વુ', english: 'The Pardoner', gujarati: 'માફ કરનારો' },
//   { id: 23, arabic: 'الْقَدِيرُ', transliteration: 'Al-Qadir', transliterationGu: 'અલ્-કદીરુ', english: 'The All-Powerful', gujarati: 'તાકાત ધરાવનારો' },
//   { id: 24, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', transliterationGu: 'અલ્-લતીફુ', english: 'The Subtle, The Kind', gujarati: 'બંદાઓની સાથે ભલાઈ કરનારો, બારીકીથી બારીક મામલાની ખબર રાખનારો' },
//   { id: 25, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', transliterationGu: 'અલ્-ખબીરુ', english: 'The All-Aware', gujarati: 'દરેક વસ્તુથી ખબરદાર' },
//   { id: 26, arabic: 'الْوِتْرُ', transliteration: 'Al-Witr', transliterationGu: 'અલ્-વિત્‌રુ', english: 'The Unique', gujarati: 'એક' },
//   { id: 27, arabic: 'الْجَمِيلُ', transliteration: 'Al-Jamil', transliterationGu: 'અલ્-જમીલુ', english: 'The Beautiful', gujarati: 'ખૂબસૂરત' },
//   { id: 28, arabic: 'الْحَيِيُّ', transliteration: 'Al-Hayiyy', transliterationGu: 'અલ્-હય્‌યુ', english: 'The Ever-Living', gujarati: 'હયા (શરમ) કરનારો' },
//   { id: 29, arabic: 'السِّتِّيرُ', transliteration: 'As-Sittir', transliterationGu: 'અસુ-સિત્-તુ', english: 'The Concealer of faults', gujarati: 'ઢાંકનારો' },
//   { id: 30, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', transliterationGu: 'અલ્-કબીરુ', english: 'The Most Great', gujarati: 'સૌથી મહાન' },
//   { id: 31, arabic: 'الْمُتَعَالِ', transliteration: 'Al-Muta\'ali', transliterationGu: 'અલ્-મુ-તા-આ-લુ', english: 'The Most High', gujarati: 'સૌથી ઊચ્ચ' },
//   { id: 32, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', transliterationGu: 'અલ્-વાહિદુ', english: 'The One', gujarati: 'એકલો' },
//   { id: 33, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', transliterationGu: 'અલ્-કહ્હારુ', english: 'The Subduer', gujarati: 'જબરદસ્ત તાકાતવર' },
//   { id: 34, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', transliterationGu: 'અલ્-હક્કુ', english: 'The Truth', gujarati: 'સત્ય (સાચો)' },
//   { id: 35, arabic: 'الْمُبِينُ', transliteration: 'Al-Mubin', transliterationGu: 'અલ્-મુબીનુ', english: 'The Clear', gujarati: 'પ્રગટ કરનારો' },
//   { id: 36, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', transliterationGu: 'અલ્-કવીયુ', english: 'The Most Strong', gujarati: 'હિમ્મતવાન' },
//   { id: 37, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', transliterationGu: 'અલ્-મતીનુ', english: 'The Firm', gujarati: 'સક્ષમ' },
//   { id: 38, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', transliterationGu: 'અલ્-હય્‌યુ', english: 'The Ever-Living', gujarati: 'હંમેશા જીવંત રહેનાર' },
//   { id: 39, arabic: 'الْقَيُّوْمُ', transliteration: 'Al-Qayyum', transliterationGu: 'અલ્-કય્‌યુમુ', english: 'The Sustainer of All', gujarati: 'હંમેશા કાયમ અને બાકી રહેનાર અને કાયમ રાખનાર' },
//   { id: 40, arabic: 'الْعَلِيُّ', transliteration: 'Al-Aliyy', transliterationGu: 'અલ્-અલીય્યુ', english: 'The Most High', gujarati: 'ઉચ્ચ, બુલંદ' },
//   { id: 41, arabic: 'الْعَظِيمُ', transliteration: 'Al-Azim', transliterationGu: 'અલ્-અઝીમુ', english: 'The Magnificent', gujarati: 'ઇજ્જત (બુઝુર્ગી)વાળો' },
//   { id: 42, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', transliterationGu: 'અશ્-શકુર', english: 'The Appreciative', gujarati: 'કદર કરવાવાળો' },
//   { id: 43, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', transliterationGu: 'અલ્-હલીમુ', english: 'The Forbearing', gujarati: 'વિનમ્ર' },
//   { id: 44, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi', transliterationGu: 'અલ્-વાસિઉ', english: 'The Vast', gujarati: 'વિશાળ' },
//   { id: 45, arabic: 'الْعَلِيمُ', transliteration: 'Al-Alim', transliterationGu: 'અલ્-અલીમુ', english: 'The All-Knowing', gujarati: 'તમામ જાહેર તેમજ છુપી વસ્તુઓનું જ્ઞાન ધરાવનાર' },
//   { id: 46, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', transliterationGu: 'અલ્-તવ્વાબુ', english: 'The Acceptor of Repentance', gujarati: 'તૌબા કબૂલ કરનાર' },
//   { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', transliterationGu: 'અલ્-હકીમુ', english: 'The All-Wise', gujarati: 'હિકમતવાળો (શાણપણવાળો)' },
//   { id: 48, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', transliterationGu: 'અલ્-ગનીય્યુ', english: 'The Self-Sufficient', gujarati: 'બેનિયાઝ (બેપર્વાહ)' },
//   { id: 49, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', transliterationGu: 'અલ્-કરીમુ', english: 'The Generous', gujarati: 'કૃપાળુ' },
//   { id: 50, arabic: 'الْأَحَدُ', transliteration: 'Al-Ahad', transliterationGu: 'અલ્-અ-દ-દ', english: 'The One', gujarati: 'એક' },
//   { id: 51, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', transliterationGu: 'અસુ-સ-મ-દ', english: 'The Eternal, Self-Sufficient', gujarati: 'બેનિયાઝ (બેપર્વાહ)' },
//   { id: 52, arabic: 'الْقَرِيبُ', transliteration: 'Al-Qarib', transliterationGu: 'અલ્-કબીરુ', english: 'The Near', gujarati: 'નજીક રહેનારો' },
//   { id: 53, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', transliterationGu: 'અલ્-મુજીબુ', english: 'The Answerer', gujarati: 'કબૂલ કરનાર' },
//   { id: 54, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', transliterationGu: 'અલ્-ગફુર', english: 'The All-Forgiving', gujarati: 'ક્ષમા આપનારો' },
//   { id: 55, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', transliterationGu: 'અલ્-વદુદ', english: 'The Loving', gujarati: 'મુહબ્બત કરનાર' },
//   { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', transliterationGu: 'અલ્-વલિય્યુ', english: 'The Protecting Friend', gujarati: 'દોસ્ત, રક્ષક' },
//   { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', transliterationGu: 'અલ્-હમીદુ', english: 'The Praiseworthy', gujarati: 'પ્રશંસાને પાત્ર' },
//   { id: 58, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', transliterationGu: 'અલ્-હફીજુ', english: 'The Preserver', gujarati: 'રક્ષા કરનાર' },
//   { id: 59, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', transliterationGu: 'અલ્-મજીદ', english: 'The Glorious', gujarati: 'ઉચ્ચ ગુણવત્તા ધરાવનાર' },
//   { id: 60, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', transliterationGu: 'અલ્-ફત્તાહુ', english: 'The Opener', gujarati: 'ચુકાદો આપનાર' },
//   { id: 61, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', transliterationGu: 'અશા-શહીદુ', english: 'The Witness', gujarati: 'સાક્ષી' },
//   { id: 62, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', transliterationGu: 'અલ્-મુબ્‌દે-દિષુ', english: 'The One Who Brings Forward', gujarati: 'અગ્રિમતા આપનાર' },
//   { id: 63, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', transliterationGu: 'અલ્-મુઅખ્‌ખિ-ર', english: 'The One Who Delays', gujarati: 'પાછળ રાખનાર' },
//   { id: 64, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', transliterationGu: 'અલ્-મલિકુ', english: 'The King', gujarati: 'બાદશાહ' },
//   { id: 65, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', transliterationGu: 'અલ્-મુક્-તદીરુ', english: 'The Powerful', gujarati: 'કુદરતવાળો (શક્તિ ધરાવનાર)' },
//   { id: 66, arabic: 'الْمُسَعِّرُ', transliteration: 'Al-Musa\'ir', transliterationGu: 'અલ્-મુસખ્‌ખિ-ર', english: 'The Controller', gujarati: 'મૂલ્યાંકન કરનાર' },
//   { id: 67, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', transliterationGu: 'અલ્-કાબિજુ', english: 'The Withholder', gujarati: 'તંગી કરનાર' },
//   { id: 68, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', transliterationGu: 'અલ્-બાસિતુ', english: 'The Expander', gujarati: 'પ્રસારમાં કરનાર' },
//   { id: 69, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', transliterationGu: 'અર્-રફીકુ', english: 'The Gentle', gujarati: 'રોજી આપનાર' },
//   { id: 70, arabic: 'الْقَاهِرُ', transliteration: 'Al-Qahir', transliterationGu: 'અલ્-કાહિરુ', english: 'The Subduer', gujarati: 'પ્રભુત્વવાળો (ગણતરી રાખનાર)' },
//   { id: 71, arabic: 'الدَّيَّانُ', transliteration: 'Ad-Dayyan', transliterationGu: 'અદ્-દય્યાનુ', english: 'The Judge', gujarati: 'બદલો આપનાર' },
//   { id: 72, arabic: 'الشَّاكِرُ', transliteration: 'Ash-Shakir', transliterationGu: 'અશા-શાફિરુ', english: 'The Appreciative', gujarati: 'કદરદાન' },
//   { id: 73, arabic: 'الْمَنَّانُ', transliteration: 'Al-Mannan', transliterationGu: 'અલ્-મન્નાનુ', english: 'The Benefactor', gujarati: 'ઉપકાર કરનાર' },
//   { id: 74, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', transliterationGu: 'અલ્-કાદિરુ', english: 'The All-Powerful', gujarati: 'અંદાજે લગાવનાર' },
//   { id: 75, arabic: 'الْخَلَّاقُ', transliteration: 'Al-Khallaq', transliterationGu: 'અલ્-ખલાઉ', english: 'The Creator', gujarati: 'ઉત્પન્ન કરનાર' },
//   { id: 76, arabic: 'الْمَالِكُ', transliteration: 'Al-Malik', transliterationGu: 'અલ્-માલિકુ', english: 'The Owner', gujarati: 'સત્તાધીશ' },
//   { id: 77, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', transliterationGu: 'અર્-રઝ્ઝાકુ', english: 'The Provider', gujarati: 'રોજી આપનાર' },
//   { id: 78, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', transliterationGu: 'અલ્-વકીલુ', english: 'The Trustee', gujarati: 'વાળી રાખનારો' },
//   { id: 79, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', transliterationGu: 'અર્ફ્-રકીબુ', english: 'The Watchful', gujarati: 'કાર્ય સંપન્ન (કારસાજ)' },
//   { id: 80, arabic: 'الْمُحْسِنُ', transliteration: 'Al-Muhsin', transliterationGu: 'અલ્-મુહસિનુ', english: 'The Beneficent', gujarati: 'સદ્વર્તન કરનાર' },
//   { id: 81, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', transliterationGu: 'અલ્-હસીબુ', english: 'The Reckoner', gujarati: 'હિસાબ લેવાવાળો' },
//   { id: 82, arabic: 'الشَّافِي', transliteration: 'Ash-Shafi', transliterationGu: 'અશ્-શાફી', english: 'The Healer', gujarati: 'તંદુરસ્તી આપનાર' },
//   { id: 83, arabic: 'الرَّفِيقُ', transliteration: 'Ar-Rafiq', transliterationGu: 'અર-રફીકુ', english: 'The Gentle', gujarati: 'નમ્રતાવાળું' },
//   { id: 84, arabic: 'الْمُعْطِي', transliteration: 'Al-Mu\'ti', transliterationGu: 'અલ્-મુઅ્-તી', english: 'The Giver', gujarati: 'અર્પણ કરનાર' },
//   { id: 85, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', transliterationGu: 'અલ્-મુકીતુ', english: 'The Nourisher', gujarati: 'સર્વ શક્તિમાન' },
//   { id: 86, arabic: 'السَّيِّدُ', transliteration: 'As-Sayyid', transliterationGu: 'અસુ-સય્યિદુ', english: 'The Master', gujarati: 'સરદાર' },
//   { id: 87, arabic: 'الطَّيِّبُ', transliteration: 'At-Tayyib', transliterationGu: 'અલ્-તય્યિબુ', english: 'The Pure', gujarati: 'પાક' },
//   { id: 88, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', transliterationGu: 'અલ્-હ-ક-મુ', english: 'The Judge', gujarati: 'ફેસલો કરનાર' },
//   { id: 89, arabic: 'الْأَكْرَمُ', transliteration: 'Al-Akram', transliterationGu: 'અલ્-અક્-રમુ', english: 'The Most Generous', gujarati: 'દયાળુ' },
//   { id: 90, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', transliterationGu: 'અલ્-બર્-રુ', english: 'The Source of Goodness', gujarati: 'ઉપકાર કરનાર' },
//   { id: 91, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', transliterationGu: 'અલ્-ગફ્ફારુ', english: 'The Oft-Forgiving', gujarati: 'ખુબ માફ કરવાવાળો' },
//   { id: 92, arabic: 'الرَّؤُوفُ', transliteration: 'Ar-Ra\'uf', transliterationGu: 'અર્-રઊફુ', english: 'The Compassionate', gujarati: 'દયાળુ' },
//   { id: 93, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', transliterationGu: 'અલ્-વહ્હાબ', english: 'The Bestower', gujarati: 'ખુબ અર્પણ કરનાર' },
//   { id: 94, arabic: 'الْجَوَادُ', transliteration: 'Al-Jawwad', transliterationGu: 'અલ્-જુવ-વાદ', english: 'The Generous', gujarati: 'દાનવીર' },
//   { id: 95, arabic: 'السُّبُّوحُ', transliteration: 'As-Subbuh', transliterationGu: 'અસુ-સુબ્-બુહુ', english: 'The Perfect, The Glorious', gujarati: 'પાક (પવિત્ર)' },
//   { id: 96, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', transliterationGu: 'અલ્-વારિસુ', english: 'The Inheritor', gujarati: 'વારિસ' },
//   { id: 97, arabic: 'الرَّبُّ', transliteration: 'Ar-Rabb', transliterationGu: 'અર્-રબ્બુ', english: 'The Lord', gujarati: 'પાલન પોષણ કરનાર' },
//   { id: 98, arabic: 'الْأَعْلَى', transliteration: 'Al-A\'la', transliterationGu: 'અલ્-અઅલા', english: 'The Most High', gujarati: 'સૌથી ઉચ્ચ (બુલંદ)' },
//   { id: 99, arabic: 'الْإِلٰهُ', transliteration: 'Al-Ilah', transliterationGu: 'અલ્-ઇલાહ', english: 'The One worthy of worship', gujarati: 'સાચો માબુદ (ઇબાદતને લાયક)' },
// ];

const ASMAUL_HUSNA = [
  {
    id: 0,
    arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ",
    transliteration: "Huwallāhullazī lā ilāha illā Huwa",
    transliterationGu: "હુવલ્લાહુલ્લઝી લા ઇલાહ-ઇલ્લા હુવ",
    english: "He is Allah; none has the right to be worshipped except Him",
    gujarati: "તે જ અલ્લાહ છે જેના સિવાય કોઈ બંદગીને યોગ્ય નથી",
  },
  {
    id: 1,
    arabic: "الرَّحْمَٰنُ",
    transliteration: "Ar-Rahmān",
    transliterationGu: "અર્-રહમાનુર",
    english: "The Most Merciful",
    gujarati: "ખૂબ કૃપા કરવાવા‌‌ળો",
  },
  {
    id: 2,
    arabic: "الرَّحِيمُ",
    transliteration: "Ar-Rahīm",
    transliterationGu: "અર્-રહીમુલ",
    english: "The Most Compassionate",
    gujarati: "ખૂબ દયા કરવાવાળો",
  },
  {
    id: 3,
    arabic: "الْمَلِكُ",
    transliteration: "Al-Malik",
    transliterationGu: "અલ્-મલિક",
    english: "The King, Absolute Ruler",
    gujarati: "હકીકી બાદશાહ",
  },
  {
    id: 4,
    arabic: "الْقُدُّوسُ",
    transliteration: "Al-Quddūs",
    transliterationGu: "અલ્-કુદ્દૂસ",
    english: "The Most Holy, Pure",
    gujarati: "ખૂબ જ પાકીઝગીવાળો",
  },
  {
    id: 5,
    arabic: "السَّلَامُ",
    transliteration: "As-Salām",
    transliterationGu: "અસ્-સલામ",
    english: "The Source of Peace and Safety",
    gujarati: "સલામતીવાળો (હિફાજત કરનાર)",
  },
  {
    id: 6,
    arabic: "الْمُؤْمِنُ",
    transliteration: "Al-Mu'min",
    transliterationGu: "અલ્-મુઅમિન",
    english: "The Giver of Security",
    gujarati: "અમન (સુકૂન) આપવાવાળો",
  },
  {
    id: 7,
    arabic: "الْمُهَيْمِنُ",
    transliteration: "Al-Muhaymin",
    transliterationGu: "અલ્-મુહૈમિન",
    english: "The Protector, Guardian",
    gujarati: "નિગેહબાન (રક્ષક)",
  },
  {
    id: 8,
    arabic: "الْعَزِيزُ",
    transliteration: "Al-Azīz",
    transliterationGu: "અલ્-અઝીઝ",
    english: "The Almighty",
    gujarati: "તમામ લોકો પર વિજયી",
  },
  {
    id: 9,
    arabic: "الْجَبَّارُ",
    transliteration: "Al-Jabbār",
    transliterationGu: "અલ્-જબ્બાર",
    english: "The Compeller, The Powerful",
    gujarati: "જબરદસ્ત (તાકતવર)",
  },
  {
    id: 10,
    arabic: "الْمُتَكَبِّرُ",
    transliteration: "Al-Mutakabbir",
    transliterationGu: "અલ્-મુતકબ્બિર",
    english: "The Supreme, The Majestic",
    gujarati: "બળવાન (મોટાઇ) અને ઇજ્જતવાળો",
  },
  {
    id: 11,
    arabic: "الْخَالِقُ",
    transliteration: "Al-Khāliq",
    transliterationGu: "અલ્-ખાલિક",
    english: "The Creator",
    gujarati: "પેદા કરવાવાળો",
  },
  {
    id: 12,
    arabic: "الْبَارِئُ",
    transliteration: "Al-Bāri'",
    transliterationGu: "અલ્-બારિઉ",
    english: "The Originator",
    gujarati: "જાન આપનાર (અર્થાત વજૂદમાં લાવવાવાળો)",
  },
  {
    id: 13,
    arabic: "الْمُصَوِّرُ",
    transliteration: "Al-Muṣawwir",
    transliterationGu: "અલ્-મુસવ્વિર",
    english: "The Fashioner",
    gujarati: "સૂરતો (ચહેરાઓ) બનાવવાવાળો",
  },
  {
    id: 14,
    arabic: "الْغَفَّارُ",
    transliteration: "Al-Ghaffār",
    transliterationGu: "અલ્-ગફ્ફાર",
    english: "The Constant Forgiver",
    gujarati: "માફ કરવાવાળો",
  },
  {
    id: 15,
    arabic: "الْقَهَّارُ",
    transliteration: "Al-Qahhār",
    transliterationGu: "અલ્-કહ્હાર",
    english: "The Subduer",
    gujarati: "જબરદસ્ત તાકત અને કુવ્વતવાળો",
  },
  {
    id: 16,
    arabic: "الْوَهَّابُ",
    transliteration: "Al-Wahhāb",
    transliterationGu: "અલ્-વહ્હાબ",
    english: "The Supreme Bestower",
    gujarati: "ખૂબ વધારે આપવાવાળો",
  },
  {
    id: 17,
    arabic: "الرَّزَّاقُ",
    transliteration: "Ar-Razzāq",
    transliterationGu: "અર્-રઝ્ઝાક",
    english: "The Provider",
    gujarati: "રોજી આપવાવાળો",
  },
  {
    id: 18,
    arabic: "الْفَتَّاحُ",
    transliteration: "Al-Fattāḥ",
    transliterationGu: "અલ્-ફત્તાહ",
    english: "The Opener, The Judge",
    gujarati: "ખુલ્લું કરવાવાળો (અર્થાત હક અને બાતિલને સ્પષ્ટ કરનાર)",
  },
  {
    id: 19,
    arabic: "الْعَلِيمُ",
    transliteration: "Al-'Alīm",
    transliterationGu: "અલ્-અલીમ",
    english: "The All-Knowing",
    gujarati: "ખૂબ વિશાળ ઇલ્મવાળો (દરેક વસ્તુનું ઇલ્મ રાખનાર)",
  },
  {
    id: 20,
    arabic: "الْقَابِضُ",
    transliteration: "Al-Qābiḍ",
    transliterationGu: "અલ્-કાબિજ",
    english: "The Withholder",
    gujarati: "તંગી આપનાર (અર્થાત રોજી તંગ કરનાર)",
  },
  {
    id: 21,
    arabic: "الْبَاسِطُ",
    transliteration: "Al-Bāsiṭ",
    transliterationGu: "અલ્-બાસિત",
    english: "The Extender",
    gujarati: "કુશાદગી કરનાર (અર્થાત ખૂબ રોજી આપનાર)",
  },
  {
    id: 22,
    arabic: "الْخَافِضُ",
    transliteration: "Al-Khāfiḍ",
    transliterationGu: "અલ્-ખાફિજ",
    english: "The Abaser",
    gujarati: "પસ્ત (પરાજિત કરનાર)",
  },
  {
    id: 23,
    arabic: "الرَّافِعُ",
    transliteration: "Ar-Rāfi'",
    transliterationGu: "અર્-રાફિઅ",
    english: "The Exalter",
    gujarati: "ઉઠાવવાવાળો (વિજય આપનાર)",
  },
  {
    id: 24,
    arabic: "الْمُعِزُّ",
    transliteration: "Al-Mu'izz",
    transliterationGu: "અલ્-મુઇઝ્ઝ",
    english: "The Honourer",
    gujarati: "ઇજ્જત આપવાવાળો",
  },
  {
    id: 25,
    arabic: "الْمُذِلُّ",
    transliteration: "Al-Muzill",
    transliterationGu: "અલ્-મુઝિલ્લ",
    english: "The Dishonourer",
    gujarati: "અપમાનિત કરનાર (અર્થાત નાફરમાનોને અપમાનિત કરનાર)",
  },
  {
    id: 26,
    arabic: "السَّمِيعُ",
    transliteration: "As-Samī'",
    transliterationGu: "અસ્-સમીઅ",
    english: "The All-Hearing",
    gujarati: "બધું જ સાંભળવાવાળો",
  },
  {
    id: 27,
    arabic: "الْبَصِيرُ",
    transliteration: "Al-Baṣīr",
    transliterationGu: "અલ્-બસીર",
    english: "The All-Seeing",
    gujarati: "બધું જ જોવાવાળો",
  },
  {
    id: 28,
    arabic: "الْحَكَمُ",
    transliteration: "Al-Ḥakam",
    transliterationGu: "અલ્-હકમ",
    english: "The Judge",
    gujarati: "ફેસલો (નિર્ણય) કરવાવાળો",
  },
  {
    id: 29,
    arabic: "الْعَدْلُ",
    transliteration: "Al-'Adl",
    transliterationGu: "અલ્-અદ્લ",
    english: "The Just",
    gujarati: "ઇન્સાફ કરવાવાળો",
  },
  {
    id: 30,
    arabic: "اللَّطِيفُ",
    transliteration: "Al-Laṭīf",
    transliterationGu: "અલ્-લતીફ",
    english: "The Gentle",
    gujarati: "ખૂબ નરમી કરવાવાળો",
  },
  {
    id: 31,
    arabic: "الْخَبِيرُ",
    transliteration: "Al-Khabīr",
    transliterationGu: "અલ્-ખબીર",
    english: "The All-Aware",
    gujarati: "દરેક વસ્તુની ખબર રાખનાર",
  },
  {
    id: 32,
    arabic: "الْحَلِيمُ",
    transliteration: "Al-Ḥalīm",
    transliterationGu: "અલ્-હલીમ",
    english: "The Forbearing",
    gujarati: "સહનશીલ (ધીરજવાળો)",
  },
  {
    id: 33,
    arabic: "الْعَظِيمُ",
    transliteration: "Al-'Aẓīm",
    transliterationGu: "અલ્-અઝીમ",
    english: "The Magnificent",
    gujarati: "ખૂબ મોટો (મહાન)",
  },
  {
    id: 34,
    arabic: "الْغَفُورُ",
    transliteration: "Al-Ghafūr",
    transliterationGu: "અલ્-ગફૂર",
    english: "The Most Forgiving",
    gujarati: "ખૂબ માફ કરનાર",
  },
  {
    id: 35,
    arabic: "الشَّكُورُ",
    transliteration: "Ash-Shakūr",
    transliterationGu: "અશ્-શકૂર",
    english: "The Appreciative",
    gujarati: "ખૂબ જ અજર (બદલો) આપવાવાળો",
  },
  {
    id: 36,
    arabic: "الْعَلِيُّ",
    transliteration: "Al-'Aliyy",
    transliterationGu: "અલ્-અલિય્ય",
    english: "The Most High",
    gujarati: "ખૂબ ઊંચો (મહાન)",
  },
  {
    id: 37,
    arabic: "الْكَبِيرُ",
    transliteration: "Al-Kabīr",
    transliterationGu: "અલ્-કબીર",
    english: "The Most Great",
    gujarati: "ખૂબ મોટો",
  },
  {
    id: 38,
    arabic: "الْحَفِيظُ",
    transliteration: "Al-Ḥafīẓ",
    transliterationGu: "અલ્-હફીઝ",
    english: "The Preserver",
    gujarati: "દરેકની હિફાજત કરનાર",
  },
  {
    id: 39,
    arabic: "الْمُقِيتُ",
    transliteration: "Al-Muqīt",
    transliterationGu: "અલ્-મુકીત",
    english: "The Sustainer",
    gujarati: "દરેક લોકોને રોજી આપવાવાળો, દરેક વસ્તુ પર કુદરત રાખનાર",
  },
  {
    id: 40,
    arabic: "الْحَسِيبُ",
    transliteration: "Al-Ḥasīb",
    transliterationGu: "અલ્-હસીબ",
    english: "The Reckoner",
    gujarati: "હિસાબ લેવાવાળો, બધા માટે પૂરતો થઈ જવાવાળો",
  },
  {
    id: 41,
    arabic: "الْجَلِيلُ",
    transliteration: "Al-Jalīl",
    transliterationGu: "અલ્-જલીલ",
    english: "The Majestic",
    gujarati: "પ્રતાપવાન (પ્રભાવવાળો)",
  },
  {
    id: 42,
    arabic: "الْكَرِيمُ",
    transliteration: "Al-Karīm",
    transliterationGu: "અલ્-કરીમ",
    english: "The Generous",
    gujarati: "દુઆઓ સાંભળનાર તેમજ સ્વીકાર કરનાર",
  },
  {
    id: 43,
    arabic: "الرَّقِيبُ",
    transliteration: "Ar-Raqīb",
    transliterationGu: "અર્-રકીબ",
    english: "The Watchful",
    gujarati: "નિગેહબાન (નિરીક્ષક)",
  },
  {
    id: 44,
    arabic: "الْمُجِيبُ",
    transliteration: "Al-Mujīb",
    transliterationGu: "અલ્-મુજીબ",
    english: "The Responsive",
    gujarati: "દુઆ કબૂલ કરનાર",
  },
  {
    id: 45,
    arabic: "الْوَاسِعُ",
    transliteration: "Al-Wāsi'",
    transliterationGu: "અલ્-વાસિઅ",
    english: "The All-Encompassing",
    gujarati: "ખૂબ કુશાદગીવાળો",
  },
  {
    id: 46,
    arabic: "الْحَكِيمُ",
    transliteration: "Al-Ḥakīm",
    transliterationGu: "અલ્-હકીમ",
    english: "The All-Wise",
    gujarati: "ખૂબ હિકમતવાળો",
  },
  {
    id: 47,
    arabic: "الْوَدُودُ",
    transliteration: "Al-Wadūd",
    transliterationGu: "અલ્-વદૂદ",
    english: "The Most Loving",
    gujarati: "ખૂબ માયાળુ",
  },
  {
    id: 48,
    arabic: "الْمَجِيدُ",
    transliteration: "Al-Majīd",
    transliterationGu: "અલ્-મજીદ",
    english: "The Glorious",
    gujarati: "પ્રતિષ્ઠાવાન (ઊંચી શાનવાળો)",
  },
  {
    id: 49,
    arabic: "الْبَاعِثُ",
    transliteration: "Al-Bā'ith",
    transliterationGu: "અલ્-બાઇસ",
    english: "The Resurrector",
    gujarati: "મૃતકોને જીવિત કરનાર",
  },
  {
    id: 50,
    arabic: "الشَّهِيدُ",
    transliteration: "Ash-Shahīd",
    transliterationGu: "અશ્-શહીદ",
    english: "The Witness",
    gujarati: "ગવાહી આપનાર (સાક્ષી)",
  },
  {
    id: 51,
    arabic: "الْحَقُّ",
    transliteration: "Al-Ḥaqq",
    transliterationGu: "અલ્-હક્ક",
    english: "The Truth",
    gujarati: "સચ્ચો માલિક",
  },
  {
    id: 52,
    arabic: "الْوَكِيلُ",
    transliteration: "Al-Wakīl",
    transliterationGu: "અલ્-વકીલ",
    english: "The Trustee",
    gujarati: "સૌથી શ્રેષ્ઠ સંરક્ષક, કારસાજ (કામકાજની વ્યવસ્થા કરનાર)",
  },
  {
    id: 53,
    arabic: "الْقَوِيُّ",
    transliteration: "Al-Qawiyy",
    transliterationGu: "અલ્-કવિય્ય",
    english: "The Strong",
    gujarati: "ઘણો શક્તિવાળો",
  },
  {
    id: 54,
    arabic: "الْمَتِينُ",
    transliteration: "Al-Matīn",
    transliterationGu: "અલ્-મતીન",
    english: "The Firm",
    gujarati: "જબરદસ્ત કુવ્વતવાળો",
  },
  {
    id: 55,
    arabic: "الْوَلِيُّ",
    transliteration: "Al-Waliyy",
    transliterationGu: "અલ્-વલિય્ય",
    english: "The Protecting Friend",
    gujarati: "દોસ્ત, મદદગાર",
  },
  {
    id: 56,
    arabic: "الْحَمِيدُ",
    transliteration: "Al-Ḥamīd",
    transliterationGu: "અલ્-હમીદ",
    english: "The Praiseworthy",
    gujarati: "પ્રશંસિત (વખાણને લાયક)",
  },
  {
    id: 57,
    arabic: "الْمُحْصِي",
    transliteration: "Al-Muḥṣī",
    transliterationGu: "અલ્-મુહ્સી",
    english: "The All-Enumerating",
    gujarati: "ગણતરી કરવાવાળો (અર્થાત કયામતના દિવસે રજે રજનો હિસાબ લેનાર)",
  },
  {
    id: 58,
    arabic: "الْمُبْدِئُ",
    transliteration: "Al-Mubdi'",
    transliterationGu: "અલ્-મુબદિઉ",
    english: "The Originator",
    gujarati: "સૌથી પહેલો સર્જન (પેદા) કરનાર",
  },
  {
    id: 59,
    arabic: "الْمُعِيدُ",
    transliteration: "Al-Mu'īd",
    transliterationGu: "અલ્-મુઇદ",
    english: "The Restorer",
    gujarati: "બીજી વખત સર્જન (પેદા) કરનાર",
  },
  {
    id: 60,
    arabic: "الْمُحْيِي",
    transliteration: "Al-Muḥyī",
    transliterationGu: "અલ્-મુહયી",
    english: "The Giver of Life",
    gujarati: "જીવિત કરનાર",
  },
  {
    id: 61,
    arabic: "الْمُمِيتُ",
    transliteration: "Al-Mumīt",
    transliterationGu: "અલ્-મુમીત",
    english: "The Giver of Death",
    gujarati: "મૃત્યુ આપનાર",
  },
  {
    id: 62,
    arabic: "الْحَيُّ",
    transliteration: "Al-Ḥayy",
    transliterationGu: "અલ્-હય્ય",
    english: "The Ever-Living",
    gujarati: "હંમેશા બાકી (જીવિત રહેનાર)",
  },
  {
    id: 63,
    arabic: "الْقَيُّومُ",
    transliteration: "Al-Qayyūm",
    transliterationGu: "અલ્-કય્યુમ",
    english: "The Self-Sustaining",
    gujarati: "સૃષ્ટિનો રક્ષક, બધાને ટકાવી રાખનાર",
  },
  {
    id: 64,
    arabic: "الْوَاجِدُ",
    transliteration: "Al-Wājid",
    transliterationGu: "અલ્-વાજિદ",
    english: "The Finder",
    gujarati: "દરેક વસ્તુનો પાલનહાર",
  },
  {
    id: 65,
    arabic: "الْمَاجِدُ",
    transliteration: "Al-Mājid",
    transliterationGu: "અલ્-માજિદ",
    english: "The Noble",
    gujarati: "ખૂબ ઇજ્જતવાળો",
  },
  {
    id: 66,
    arabic: "الْوَاحِدُ",
    transliteration: "Al-Wāḥid",
    transliterationGu: "અલ્-વાહિદ",
    english: "The One",
    gujarati: "અદ્વિતીય",
  },
  {
    id: 67,
    arabic: "الْأَحَدُ",
    transliteration: "Al-Aḥad",
    transliterationGu: "અલ્-અહદ",
    english: "The Unique",
    gujarati: "તનહા (એકલો)",
  },
  {
    id: 68,
    arabic: "الصَّمَدُ",
    transliteration: "Aṣ-Ṣamad",
    transliterationGu: "અસ્-સમદ",
    english: "The Eternal Refuge",
    gujarati: "બેનિયાઝ (નિરપેક્ષ)",
  },
  {
    id: 69,
    arabic: "الْقَادِرُ",
    transliteration: "Al-Qādir",
    transliterationGu: "અલ્-કાદિર",
    english: "The All-Powerful",
    gujarati: "સંપૂર્ણ શક્તિમાન (દરેક વસ્તુ પર કુદરત રાખનાર)",
  },
  {
    id: 70,
    arabic: "الْمُقْتَدِرُ",
    transliteration: "Al-Muqtadir",
    transliterationGu: "અલ્-મુક્તદિર",
    english: "The Most Powerful",
    gujarati: "ખૂબ જ શક્તિશાળી",
  },
  {
    id: 71,
    arabic: "الْمُقَدِّمُ",
    transliteration: "Al-Muqaddim",
    transliterationGu: "અલ્-મુકદ્દિમ",
    english: "The Expediter",
    gujarati:
      "આગળ કરવાવાળો (અર્થાત જેને ઇચ્છે છે તેને આગળ કરી દે છે અને જેને ઇચ્છે તેને હંમેશા માટે પાછળ કરી દે છે)",
  },
  {
    id: 72,
    arabic: "الْمُؤَخِّرُ",
    transliteration: "Al-Mu'akhkhir",
    transliterationGu: "અલ્-મુઅખ્ખિર",
    english: "The Delayer",
    gujarati:
      "પાછળ કરવાવાળો (અલ્લાહ તઆલાની એક સિફત આ પણ છે કે તે પોતાના ખાસ બંદાઓના દુશ્મનને પાછળ કરી દે છે)",
  },
  {
    id: 73,
    arabic: "الْأَوَّلُ",
    transliteration: "Al-Awwal",
    transliterationGu: "અલ્-અવ્વલ",
    english: "The First",
    gujarati:
      "સૌથી પહેલો (અલ્લાહ તઆલાની એક સિફત દરેક વસ્તુ વજૂદમાં આવી તે પહેલા તો મોજૂદ હતો અને દરેક વસ્તુ નષ્ટ થશે ત્યારે પણ તે મોજૂદ હશે)",
  },
  {
    id: 74,
    arabic: "الْآخِرُ",
    transliteration: "Al-Ākhir",
    transliterationGu: "અલ્-આખિર",
    english: "The Last",
    gujarati:
      "સૌથી છેલ્લો (અર્થાત દરેક લોકોને મોત આપ્યા પછી પણ તે જીવિત રહેશે)",
  },
  {
    id: 75,
    arabic: "الظَّاهِرُ",
    transliteration: "Aẓ-Ẓāhir",
    transliterationGu: "અઝ્-ઝાહિર",
    english: "The Manifest",
    gujarati: "જાહિર",
  },
  {
    id: 76,
    arabic: "الْبَاطِنُ",
    transliteration: "Al-Bāṭin",
    transliterationGu: "અલ્-બાતિન",
    english: "The Hidden",
    gujarati: "છુપાયેલો (અર્થાત કોઈ આંખ તેને જોઈ શકતી નથી)",
  },
  {
    id: 77,
    arabic: "الْوَالِي",
    transliteration: "Al-Wālī",
    transliterationGu: "અલ્-વાલી",
    english: "The Governor",
    gujarati: "હકીકી માલિક",
  },
  {
    id: 78,
    arabic: "الْمُتَعَالِي",
    transliteration: "Al-Muta'ālī",
    transliterationGu: "અલ્-મુતઆલી",
    english: "The Most Exalted",
    gujarati: "સૌથી ઊંચો અને શ્રેષ્ઠ",
  },
  {
    id: 79,
    arabic: "الْبَرُّ",
    transliteration: "Al-Barr",
    transliterationGu: "અલ્-બર્ર",
    english: "The Source of Goodness",
    gujarati: "ઉપકાર કરવાવાળો",
  },
  {
    id: 80,
    arabic: "التَّوَّابُ",
    transliteration: "At-Tawwāb",
    transliterationGu: "અત્-તવ્વાબ",
    english: "The Accepter of Repentance",
    gujarati: "તૌબા કબૂલ કરવાવાળો",
  },
  {
    id: 81,
    arabic: "الْمُنْتَقِمُ",
    transliteration: "Al-Muntaqim",
    transliterationGu: "અલ્-મુંતકિમ",
    english: "The Avenger",
    gujarati: "ઇન્તિકામ લેવાવાળો (અર્થાત બુરાઇનો બદલો લેવાવાળો)",
  },
  {
    id: 82,
    arabic: "الْعَفُوُّ",
    transliteration: "Al-'Afūw",
    transliterationGu: "અલ્-અફૂવ્વ",
    english: "The Pardoner",
    gujarati: "દરગુજર કરવાવાળો",
  },
  {
    id: 83,
    arabic: "الرَّؤُوفُ",
    transliteration: "Ar-Ra'ūf",
    transliterationGu: "અર્-રઊફ",
    english: "The Kind",
    gujarati: "શફકત (મેહરબાની) કરનાર",
  },
  {
    id: 84,
    arabic: "مَالِكُ الْمُلْكِ",
    transliteration: "Mālik-ul-Mulk",
    transliterationGu: "માલિકુલ્-મુલ્ક",
    english: "Owner of the Kingdom",
    gujarati: "બાદશાહનો બાદશાહ, દુનિયા અને આખિરતનો બાદશાહ",
  },
  {
    id: 85,
    arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Dhū-l-Jalāli wa-l-Ikrām",
    transliterationGu: "ઝુલ્-જલાલી વલ્-ઇકરામ",
    english: "Lord of Glory and Honour",
    gujarati: "પ્રતાપવાન અને ઇજ્જતવાળો",
  },
  {
    id: 86,
    arabic: "الْمُقْسِطُ",
    transliteration: "Al-Muqsiṭ",
    transliterationGu: "અલ્-મુક્સિતુ",
    english: "The Equitable",
    gujarati: "ઇન્સાફ (ન્યાય) કરવાવાળો",
  },
  {
    id: 87,
    arabic: "الْجَامِعُ",
    transliteration: "Al-Jāmi'",
    transliterationGu: "અલ્-જામિઉ",
    english: "The Gatherer",
    gujarati: "ભેગા કરવાવાળો (અર્થાત કયામતના દિવસે ભેગા કરવાવાળો)",
  },
  {
    id: 88,
    arabic: "الْغَنِيُّ",
    transliteration: "Al-Ghaniyy",
    transliterationGu: "અલ્-ગનિય્યુ",
    english: "The Self-Sufficient",
    gujarati: "બેનિયાઝ (ધનવાન)",
  },
  {
    id: 89,
    arabic: "الْمُغْنِي",
    transliteration: "Al-Mughnī",
    transliterationGu: "અલ્-મુગ્ની",
    english: "The Enricher",
    gujarati: "બેનિયાઝ કરવાવાળો (અર્થાત ધનવાન બનાવનાર)",
  },
  {
    id: 90,
    arabic: "الْمَانِعُ",
    transliteration: "Al-Māni'",
    transliterationGu: "અલ્-માનિઉ",
    english: "The Preventer",
    gujarati:
      "રોકવાવાળો (અર્થાત તે જ્યારે જે વસ્તુને રોકવા ઇચ્છે તે વસ્તુને રોકી લે)",
  },
  {
    id: 91,
    arabic: "الضَّارُّ",
    transliteration: "Aḍ-Ḍārr",
    transliterationGu: "અઝ્-ઝાર્રુ",
    english: "The Distresser",
    gujarati: "નુકસાન પહોંચાડવાવાળો",
  },
  {
    id: 92,
    arabic: "النَّافِعُ",
    transliteration: "An-Nāfi'",
    transliterationGu: "અન્-નાફિઉ",
    english: "The Benefactor",
    gujarati: "ફાયદો પહોંચાડવાવાળો",
  },
  {
    id: 93,
    arabic: "النُّورُ",
    transliteration: "An-Nūr",
    transliterationGu: "અન્-નૂરુ",
    english: "The Light",
    gujarati: "નૂર આપવાવાળો",
  },
  {
    id: 94,
    arabic: "الْهَادِي",
    transliteration: "Al-Hādī",
    transliterationGu: "અલ્-હાદી",
    english: "The Guide",
    gujarati: "માર્ગદર્શન આપવાવાળો",
  },
  {
    id: 95,
    arabic: "الْبَدِيعُ",
    transliteration: "Al-Badī'",
    transliterationGu: "અલ્-બદીઉ",
    english: "The Incomparable Creator",
    gujarati: "દરેક વસ્તુને ઉમદા રીતે પેદા કરનાર",
  },
  {
    id: 96,
    arabic: "الْبَاقِي",
    transliteration: "Al-Bāqī",
    transliterationGu: "અલ્-બાકી",
    english: "The Everlasting",
    gujarati: "હંમેશા (બાકી) રહેનાર",
  },
  {
    id: 97,
    arabic: "الْوَارِثُ",
    transliteration: "Al-Wārith",
    transliterationGu: "અલ્-વારિષ",
    english: "The Inheritor",
    gujarati: "હકીકી વારિસ",
  },
  {
    id: 98,
    arabic: "الرَّشِيدُ",
    transliteration: "Ar-Rashīd",
    transliterationGu: "અર્-રશીદ",
    english: "The Guide to the Right Path",
    gujarati: "સીધો રસ્તો બતાવનાર",
  },
  {
    id: 99,
    arabic: "الصَّبُورُ",
    transliteration: "Aṣ-Ṣabūr",
    transliterationGu: "અસ્-સબૂર",
    english: "The Most Patient",
    gujarati: "ગુનેગારો પર નરમી કરવાવાળો, સબર કરવાવાળો",
  },
];

const FAVORITES_KEY = "@asmaul_husna_favorites";
const LANGUAGE_PREF_KEY = "@asmaul_husna_language";

// View mode for favorites category
type ViewMode = "all" | "favorites";

export default function AsmaulHusnaScreen() {
  const router = useRouter();
  const { colors, isDark, spacing, fontSize } = useTheme();
  const { t, language } = useLanguage();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showGujarati, setShowGujarati] = useState(true);

  // Load favorites and language preference
  useEffect(() => {
    loadFavorites();
    loadLanguagePreference();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    if (viewMode === "all") return;

    const onBackPress = () => {
      setViewMode("all");
      return true; // prevent default behavior
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  }, [viewMode]);

  const loadLanguagePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_PREF_KEY);
      if (saved !== null) {
        setShowGujarati(saved === "true");
      }
      // If no saved preference, keep default (true for Gujarati)
    } catch (error) {
      asmaulHusnaLogger.error("Error loading language preference:", error);
    }
  };

  const saveLanguagePreference = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_PREF_KEY, value.toString());
    } catch (error) {
      asmaulHusnaLogger.error("Error saving language preference:", error);
    }
  };

  const toggleLanguage = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowGujarati((prev) => {
      const newValue = !prev;
      saveLanguagePreference(newValue);
      return newValue;
    });
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      asmaulHusnaLogger.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      asmaulHusnaLogger.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = useCallback((id: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // Go back handler for favorites view
  const goBack = useCallback(() => {
    if (viewMode === "favorites") {
      setViewMode("all");
    } else {
      router.back();
    }
  }, [viewMode, router]);

  // Open favorites category
  const openFavorites = useCallback(() => {
    setViewMode("favorites");
  }, []);

  const filteredNames = useMemo(() => {
    let names = ASMAUL_HUSNA;

    if (viewMode === "favorites") {
      names = names.filter((name) => favorites.includes(name.id));
    }

    return names;
  }, [favorites, viewMode]);

  const handleShare = async (name: (typeof ASMAUL_HUSNA)[0]) => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await Share.share({
        message: `${name.id}. ${name.arabic}\n${name.transliteration}\n${language === "gu" ? name.gujarati : name.english}\n\n- Asmaul Husna (99 Names of Allah)`,
      });
    } catch (error) {
      asmaulHusnaLogger.error("Error sharing:", error);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof ASMAUL_HUSNA)[0]; index: number }) => {
      const isFavorite = favorites.includes(item.id);
      // Items with long text that need special layout
      const isLongTextItem = item.id === 0 || item.id === 85;

      return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.card }]}>
          <View style={styles.nameCard}>
            {isLongTextItem ? (
              <>
                {/* Special layout for long text items: Arabic first, then transliteration */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={[styles.numberBadge, { backgroundColor: "#14a3a8" }]}
                  >
                    <Text style={styles.numberText}>{item.id}</Text>
                  </View>
                  <Text
                    style={[
                      styles.arabicText,
                      {
                        color: "#0d7377",
                        fontSize: item.arabic.length > 15 ? 22 : 32,
                        flex: 1,
                        textAlign: "right",
                      },
                    ]}
                  >
                    {item.arabic}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transliteration,
                    { color: colors.text, marginBottom: 8 },
                  ]}
                >
                  {showGujarati ? item.transliterationGu : item.transliteration}
                </Text>
              </>
            ) : (
              /* Top Row: Number + Transliteration (Left) | Arabic (Right) */
              <View style={styles.topRow}>
                <View style={styles.leftTop}>
                  <View
                    style={[styles.numberBadge, { backgroundColor: "#14a3a8" }]}
                  >
                    <Text style={styles.numberText}>{item.id}</Text>
                  </View>
                  <Text
                    style={[styles.transliteration, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {showGujarati
                      ? item.transliterationGu
                      : item.transliteration}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.arabicText,
                    {
                      color: "#0d7377",
                      fontSize: item.arabic.length > 15 ? 22 : 32,
                    },
                  ]}
                >
                  {item.arabic}
                </Text>
              </View>
            )}

            {/* Divider */}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Bottom Row: Meaning (Left) | Actions (Right) */}
            <View style={styles.bottomRow}>
              <Text
                style={[styles.meaningText, { color: colors.textSecondary }]}
                numberOfLines={isLongTextItem ? 0 : 2}
              >
                {showGujarati ? item.gujarati : item.english}
              </Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id)}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                  accessibilityLabel={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <MaterialCommunityIcons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavorite ? "#ff6b6b" : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare(item)}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                  accessibilityLabel="Share"
                >
                  <Ionicons
                    name="share-outline"
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [colors, isDark, favorites, showGujarati],
  );

  // Use useMemo to prevent style recreation on every render
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        headerActions: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
        },
        headerButton: {
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.15)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        },
        heroSection: {
          marginHorizontal: spacing.sm,
          marginBottom: spacing.md,
          borderRadius: 20,
          overflow: "hidden",
        },
        heroGradient: {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.md,
        },
        heroTitle: {
          fontSize: 24,
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: 4,
          textShadowColor: "rgba(0,0,0,0.2)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
        },
        heroSubtitle: {
          fontSize: fontSize.sm,
          color: "rgba(255,255,255,0.85)",
          textAlign: "left",
        },
        listContent: {
          padding: spacing.sm,
          paddingBottom: 100,
        },
        cardWrapper: {
          marginBottom: spacing.sm,
          borderRadius: 16,
          overflow: "hidden",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        nameCard: {
          borderRadius: 16,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        },
        topRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        leftTop: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        },
        numberBadge: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
          marginRight: spacing.sm,
        },
        numberText: {
          color: "#fff",
          fontWeight: "800",
          fontSize: 16,
        },
        transliteration: {
          fontSize: 18,
          fontWeight: "700",
          flex: 1,
        },
        arabicText: {
          fontSize: 32,
          fontWeight: "700",
          textAlign: "right",
          fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
        },
        divider: {
          height: 1,
          marginVertical: spacing.sm,
        },
        bottomRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        meaningText: {
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "500",
          flex: 1,
          paddingRight: spacing.sm,
        },
        actionsContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
        actionButton: {
          padding: 8,
          marginLeft: spacing.xs,
          borderRadius: 20,
        },
        // Favorites banner styles
        favoritesBanner: {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 14,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginBottom: spacing.md,
          backgroundColor: "#ef444415",
          borderWidth: 1,
          borderColor: "#ef444430",
        },
        favoritesBannerIcon: {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: "#ef444420",
          justifyContent: "center",
          alignItems: "center",
        },
        favoritesBannerText: {
          flex: 1,
          marginLeft: 10,
        },
        favoritesBannerTitle: {
          fontSize: 16,
          fontWeight: "700",
          color: "#ef4444",
        },
        favoritesBannerCount: {
          fontSize: 12,
          color: colors.textSecondary,
          fontWeight: "500",
        },
        emptyContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing.xxl,
        },
        emptyText: {
          fontSize: fontSize.md,
          color: colors.textSecondary,
          marginTop: spacing.md,
          textAlign: "center",
        },
      }),
    [colors, isDark, spacing, fontSize],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <ScreenHeader
        title={
          viewMode === "favorites"
            ? language === "gu"
              ? "પસંદીદા"
              : "Favourites"
            : t("asmaulHusna")
        }
        subtitle={
          viewMode === "favorites"
            ? language === "gu"
              ? `${favorites.length} નામો`
              : `${favorites.length} names`
            : language === "gu"
              ? "અલ્લાહના 99 નામો"
              : "99 Names of Allah"
        }
        showBackButton={viewMode === "favorites"}
        onBackPress={goBack}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleLanguage}
            >
              <MaterialIcons name="translate" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.headerButton}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Names List */}
      <FlatList
        data={filteredNames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Hero Section with Gradient */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={["#0d7377", "#14a3a8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>
                    أَسْمَاءُ اللهِ الحُسْنَى
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    {language === "gu"
                      ? "અલ્લાહના 99 સુંદર નામો"
                      : "The 99 Beautiful Names of Allah"}
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Favourites Banner - only show in 'all' view when there are favorites */}
            {viewMode === "all" && favorites.length > 0 && (
              <TouchableOpacity
                style={styles.favoritesBanner}
                onPress={openFavorites}
                activeOpacity={0.7}
              >
                <View style={styles.favoritesBannerIcon}>
                  <MaterialIcons name="favorite" size={20} color="#ef4444" />
                </View>
                <View style={styles.favoritesBannerText}>
                  <Text style={styles.favoritesBannerTitle}>
                    {language === "gu" ? "પસંદીદા" : "Favourites"}
                  </Text>
                  <Text style={styles.favoritesBannerCount}>
                    {favorites.length} {language === "gu" ? "નામો" : "names"}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#ef4444" />
              </TouchableOpacity>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              {language === "gu" ? "કોઈ મનપસંદ નથી" : "No favorites yet"}
            </Text>
          </View>
        }
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== "ios"}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
