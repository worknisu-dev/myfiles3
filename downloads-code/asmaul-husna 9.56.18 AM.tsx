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
const ASMAUL_HUSNA = [
  {
    id: 1,
    arabic: "الرَّحْمٰنُ",
    transliteration: "Ar-Rahman",
    transliterationGu: "અર-રહમાનુ",
    english: "The Most Gracious",
    gujarati: "ઘણો મહેરબાન",
  },
  {
    id: 2,
    arabic: "الرَّحِيْمُ",
    transliteration: "Ar-Raheem",
    transliterationGu: "અર-રહીમુ",
    english: "The Most Merciful",
    gujarati: "ખૂબ જ દયાળુ",
  },
  {
    id: 3,
    arabic: "الْمَلِكُ",
    transliteration: "Al-Malik",
    transliterationGu: "અલ્-મલિકુ",
    english: "The King, The Sovereign",
    gujarati: "બાદશાહ",
  },
  {
    id: 4,
    arabic: "الْقُدُّوسُ",
    transliteration: "Al-Quddus",
    transliterationGu: "અલ્-કુદ્દુસ",
    english: "The Holy, The Pure",
    gujarati: "પાક (તમામ ખામીઓથી પાક)",
  },
  {
    id: 5,
    arabic: "السَّلَامُ",
    transliteration: "As-Salam",
    transliterationGu: "અસ્-સલામુ",
    english: "The Source of Peace",
    gujarati: "સલામત રાખનારો",
  },
  {
    id: 6,
    arabic: "الْمُؤْمِنُ",
    transliteration: "Al-Mu'min",
    transliterationGu: "અલ્-મુઅ્‌મિનુ",
    english: "The Giver of Security",
    gujarati: "શાંતિ આપનાર",
  },
  {
    id: 7,
    arabic: "الْمُهَيْمِنُ",
    transliteration: "Al-Muhaymin",
    transliterationGu: "અલ્-મુહય-મિનુ",
    english: "The Guardian, The Protector",
    gujarati: "રખેવાળી કરનારો",
  },
  {
    id: 8,
    arabic: "الْعَزِيزُ",
    transliteration: "Al-Aziz",
    transliterationGu: "અલ્-અઝીઝુ",
    english: "The Almighty",
    gujarati: "પ્રભાવશાળી (જબરદસ્ત)",
  },
  {
    id: 9,
    arabic: "الْجَبَّارُ",
    transliteration: "Al-Jabbar",
    transliterationGu: "અલ્-જબ્બારુ",
    english: "The Compeller",
    gujarati: "મજબૂત પકડ રાખનાર",
  },
  {
    id: 10,
    arabic: "الْمُتَكَبِّرُ",
    transliteration: "Al-Mutakabbir",
    transliterationGu: "અલ્-મુ-તકબ્-બિરુ",
    english: "The Supreme, The Majestic",
    gujarati: "મહાનતાવાળો",
  },
  {
    id: 11,
    arabic: "الْخَالِقُ",
    transliteration: "Al-Khaliq",
    transliterationGu: "અલ્-ખાલિકુ",
    english: "The Creator",
    gujarati: "પૈદા કરવાવાળો",
  },
  {
    id: 12,
    arabic: "الْمُصَوِّرُ",
    transliteration: "Al-Musawwir",
    transliterationGu: "અલ્-મુસવ્-વિરુ",
    english: "The Fashioner",
    gujarati: "સૂરત બનાવનાર",
  },
  {
    id: 13,
    arabic: "الْبَارِئُ",
    transliteration: "Al-Bariu",
    transliterationGu: "અલ્-બારિઉ",
    english: "The Maker, The Evolver",
    gujarati: "સમગ્ર વિશ્વને બનાવનાર",
  },
  {
    id: 14,
    arabic: "الْأَوَّلُ",
    transliteration: "Al-Awwal",
    transliterationGu: "અલ્-અવ્‌વલુ",
    english: "The First",
    gujarati: "સૌથી પ્રથમ",
  },
  {
    id: 15,
    arabic: "الْآخِرُ",
    transliteration: "Al-Akhir",
    transliterationGu: "અલ્-આખિરુ",
    english: "The Last",
    gujarati: "સૌથી અંતિમ",
  },
  {
    id: 16,
    arabic: "الظَّاهِرُ",
    transliteration: "Az-Zahir",
    transliterationGu: "અઝ્-ઝાહિરુ",
    english: "The Manifest",
    gujarati: "તમામ ચીજો પર પ્રભુત્વ ધરાવનારો",
  },
  {
    id: 17,
    arabic: "الْબَاطِنُ",
    transliteration: "Al-Batin",
    transliterationGu: "અલ્-બાતિનુ",
    english: "The Hidden",
    gujarati: "છૂપી વાતોને જાણવાવાળો",
  },
  {
    id: 18,
    arabic: "السَّمِيعُ",
    transliteration: "As-Sami",
    transliterationGu: "અસ્-સમીઉ",
    english: "The All-Hearing",
    gujarati: "સાંભળવાવાળો (સાંભળનાર)",
  },
  {
    id: 19,
    arabic: "الْبَصِيرُ",
    transliteration: "Al-Basir",
    transliterationGu: "અલ્-બસીરુ",
    english: "The All-Seeing",
    gujarati: "જોવાવાળો (નજર રાખનાર)",
  },
  {
    id: 20,
    arabic: "الْمَوْلَى",
    transliteration: "Al-Mawla",
    transliterationGu: "અલ્-મવ-લા",
    english: "The Protector, The Ally",
    gujarati: "વલી (દરેક રીતે ખયાલ રાખવાવાળો)",
  },
  {
    id: 21,
    arabic: "النَّصِيرُ",
    transliteration: "An-Nasir",
    transliterationGu: "અન્-નસીરુ",
    english: "The Helper",
    gujarati: "મદદગાર",
  },
  {
    id: 22,
    arabic: "الْعَفُوُّ",
    transliteration: "Al-Afuww",
    transliterationGu: "અલ્-અફુવ્‌વુ",
    english: "The Pardoner",
    gujarati: "માફ કરનારો",
  },
  {
    id: 23,
    arabic: "الْقَدِيرُ",
    transliteration: "Al-Qadir",
    transliterationGu: "અલ્-કદીરુ",
    english: "The All-Powerful",
    gujarati: "તાકાત ધરાવનારો",
  },
  {
    id: 24,
    arabic: "اللَّطِيفُ",
    transliteration: "Al-Latif",
    transliterationGu: "અલ્-લતીફુ",
    english: "The Subtle, The Kind",
    gujarati: "બંદાઓની સાથે ભલાઈ કરનારો, બારીકીથી બારીક મામલાની ખબર રાખનારો",
  },
  {
    id: 25,
    arabic: "الْخَبِيرُ",
    transliteration: "Al-Khabir",
    transliterationGu: "અલ્-ખબીરુ",
    english: "The All-Aware",
    gujarati: "દરેક વસ્તુથી ખબરદાર",
  },
  {
    id: 26,
    arabic: "الْوِتْرُ",
    transliteration: "Al-Witr",
    transliterationGu: "અલ્-વિત્‌રુ",
    english: "The Unique",
    gujarati: "એક",
  },
  {
    id: 27,
    arabic: "الْجَمِيلُ",
    transliteration: "Al-Jamil",
    transliterationGu: "અલ્-જમીલુ",
    english: "The Beautiful",
    gujarati: "ખૂબસૂરત",
  },
  {
    id: 28,
    arabic: "الْحَيِيُّ",
    transliteration: "Al-Hayiyy",
    transliterationGu: "અલ્-હય્યિ-ઉ",
    english: "The Ever-Living",
    gujarati: "હયા (શરમ) કરનારો",
  },
  {
    id: 29,
    arabic: "السِّتِّيرُ",
    transliteration: "As-Sittir",
    transliterationGu: "અસ-સિત્-રુ",
    english: "The Concealer of faults",
    gujarati: "ઢાંકનારો",
  },
  {
    id: 30,
    arabic: "الْكَبِيرُ",
    transliteration: "Al-Kabir",
    transliterationGu: "અલ્-કબીરુ",
    english: "The Most Great",
    gujarati: "સૌથી મહાન",
  },
  {
    id: 31,
    arabic: "الْمُتَعَالِ",
    transliteration: "Al-Muta'ali",
    transliterationGu: "અલ્-મુ-ત-આ-લુ",
    english: "The Most High",
    gujarati: "સૌથી ઊચ્ચ",
  },
  {
    id: 32,
    arabic: "الْوَاحِدُ",
    transliteration: "Al-Wahid",
    transliterationGu: "અલ્-વાહિદુ",
    english: "The One",
    gujarati: "એકલો",
  },
  {
    id: 33,
    arabic: "الْقَهَّارُ",
    transliteration: "Al-Qahhar",
    transliterationGu: "અલ્-કહ્હારુ",
    english: "The Subduer",
    gujarati: "જબરદસ્ત તાકાતવર",
  },
  {
    id: 34,
    arabic: "الْحَقُّ",
    transliteration: "Al-Haqq",
    transliterationGu: "અલ્-હક્કુ",
    english: "The Truth",
    gujarati: "સત્ય (સાચો)",
  },
  {
    id: 35,
    arabic: "الْمُبِينُ",
    transliteration: "Al-Mubin",
    transliterationGu: "અલ્-મુબીનુ",
    english: "The Clear",
    gujarati: "પ્રગટ કરનારો",
  },
  {
    id: 36,
    arabic: "الْقَوِيُّ",
    transliteration: "Al-Qawiyy",
    transliterationGu: "અલ્-કવીય્યુ",
    english: "The Most Strong",
    gujarati: "હિમ્મતવાન",
  },
  {
    id: 37,
    arabic: "الْمَتِينُ",
    transliteration: "Al-Matin",
    transliterationGu: "અલ્-મતીનુ",
    english: "The Firm",
    gujarati: "સક્ષમ",
  },
  {
    id: 38,
    arabic: "الْحَيُّ",
    transliteration: "Al-Hayy",
    transliterationGu: "અલ્-હય્‌યુ",
    english: "The Ever-Living",
    gujarati: "હંમેશા જીવંત રહેનાર",
  },
  {
    id: 39,
    arabic: "الْقَيُّوْمُ",
    transliteration: "Al-Qayyum",
    transliterationGu: "અલ્-કય્‌યુમ",
    english: "The Sustainer of All",
    gujarati: "હંમેશા કાયમ અને બાકી રહેનાર",
  },
  {
    id: 40,
    arabic: "الْعَلِيُّ",
    transliteration: "Al-Aliyy",
    transliterationGu: "અલ્-અલીય્યુ",
    english: "The Most High",
    gujarati: "ઉચ્ચ, બુલંદ",
  },
  {
    id: 41,
    arabic: "الْعَظِيمُ",
    transliteration: "Al-Azim",
    transliterationGu: "અલ્-અઝીમુ",
    english: "The Magnificent",
    gujarati: "ઇજ્જત (બુઝુર્ગી)વાળો",
  },
  {
    id: 42,
    arabic: "الشَّكُورُ",
    transliteration: "Ash-Shakur",
    transliterationGu: "અશ્-શકુરુ",
    english: "The Appreciative",
    gujarati: "કદર કરવાવાળો",
  },
  {
    id: 43,
    arabic: "الْحَلِيمُ",
    transliteration: "Al-Halim",
    transliterationGu: "અલ્-હલીમુ",
    english: "The Forbearing",
    gujarati: "વિનમ્ર",
  },
  {
    id: 44,
    arabic: "الْوَاسِعُ",
    transliteration: "Al-Wasi",
    transliterationGu: "અલ્-વાસિઉ",
    english: "The Vast",
    gujarati: "વિશાળ",
  },
  {
    id: 45,
    arabic: "الْعَلِيمُ",
    transliteration: "Al-Alim",
    transliterationGu: "અલ્-અલીમુ",
    english: "The All-Knowing",
    gujarati: "તમામ જાહેર તેમજ છુપી વસ્તુઓનું જ્ઞાન ધરાવનાર",
  },
  {
    id: 46,
    arabic: "التَّوَّابُ",
    transliteration: "At-Tawwab",
    transliterationGu: "અત્-તવ્વાબુ",
    english: "The Acceptor of Repentance",
    gujarati: "તૌબા કબૂલ કરનાર",
  },
  {
    id: 47,
    arabic: "الْحَكِيمُ",
    transliteration: "Al-Hakim",
    transliterationGu: "અલ્-હકીમુ",
    english: "The All-Wise",
    gujarati: "હિકમતવાળો (શાણપણવાળો)",
  },
  {
    id: 48,
    arabic: "الْغَنِيُّ",
    transliteration: "Al-Ghaniyy",
    transliterationGu: "અલ્-ગનીય્યુ",
    english: "The Self-Sufficient",
    gujarati: "બેનિયાઝ (બેપર્વાહ)",
  },
  {
    id: 49,
    arabic: "الْكَرِيمُ",
    transliteration: "Al-Karim",
    transliterationGu: "અલ્-કરીમુ",
    english: "The Generous",
    gujarati: "કૃપાળુ",
  },
  {
    id: 50,
    arabic: "الْأَحَدُ",
    transliteration: "Al-Ahad",
    transliterationGu: "અલ્-અ-હ-દુ",
    english: "The One",
    gujarati: "એક",
  },
  {
    id: 51,
    arabic: "الصَّمَدُ",
    transliteration: "As-Samad",
    transliterationGu: "અસ-સ-મ-દુ",
    english: "The Eternal, Self-Sufficient",
    gujarati: "બેનિયાઝ (બેપર્વાહ)",
  },
  {
    id: 52,
    arabic: "الْقَرِيبُ",
    transliteration: "Al-Qarib",
    transliterationGu: "અલ્-કરીબુ",
    english: "The Near",
    gujarati: "નજીક રહેનારો",
  },
  {
    id: 53,
    arabic: "الْمُجِيبُ",
    transliteration: "Al-Mujib",
    transliterationGu: "અલ્-મુજીબુ",
    english: "The Answerer",
    gujarati: "કબૂલ કરનાર",
  },
  {
    id: 54,
    arabic: "الْغَفُورُ",
    transliteration: "Al-Ghafur",
    transliterationGu: "અલ્-ગફુરુ",
    english: "The All-Forgiving",
    gujarati: "ક્ષમા આપનારો",
  },
  {
    id: 55,
    arabic: "الْوَدُودُ",
    transliteration: "Al-Wadud",
    transliterationGu: "અલ્-વદુદુ",
    english: "The Loving",
    gujarati: "મુહબ્બત કરનાર",
  },
  {
    id: 56,
    arabic: "الْوَلِيُّ",
    transliteration: "Al-Waliyy",
    transliterationGu: "અલ્-વલિય્યુ",
    english: "The Protecting Friend",
    gujarati: "દોસ્ત, રક્ષક",
  },
  {
    id: 57,
    arabic: "الْحَمِيدُ",
    transliteration: "Al-Hamid",
    transliterationGu: "અલ્-હમીદુ",
    english: "The Praiseworthy",
    gujarati: "પ્રશંસાને પાત્ર",
  },
  {
    id: 58,
    arabic: "الْحَفِيظُ",
    transliteration: "Al-Hafiz",
    transliterationGu: "અલ્-હફીજુ",
    english: "The Preserver",
    gujarati: "રક્ષણ કરનાર",
  },
  {
    id: 59,
    arabic: "الْمَجِيدُ",
    transliteration: "Al-Majid",
    transliterationGu: "અલ્-મજીદુ",
    english: "The Glorious",
    gujarati: "ઉચ્ચ ગુણવત્તા ધરાવનાર",
  },
  {
    id: 60,
    arabic: "الْفَتَّاحُ",
    transliteration: "Al-Fattah",
    transliterationGu: "અલ્-ફત્તાહુ",
    english: "The Opener",
    gujarati: "ચુકાદો આપનાર",
  },
  {
    id: 61,
    arabic: "الشَّهِيدُ",
    transliteration: "Ash-Shahid",
    transliterationGu: "અશ-શાહીદુ",
    english: "The Witness",
    gujarati: "સાક્ષી",
  },
  {
    id: 62,
    arabic: "الْمُقَدِّمُ",
    transliteration: "Al-Muqaddim",
    transliterationGu: "અલ્-મુકદ્દિમુ",
    english: "The One Who Brings Forward",
    gujarati: "અગ્રિમતા આપનાર",
  },
  {
    id: 63,
    arabic: "الْمُؤَخِّرُ",
    transliteration: "Al-Mu'akhkhir",
    transliterationGu: "અલ્-મુઅખ્‌ખિ-ર",
    english: "The One Who Delays",
    gujarati: "પાછળ રાખનાર",
  },
  {
    id: 64,
    arabic: "الْمَلِكُ",
    transliteration: "Al-Malik",
    transliterationGu: "અલ્-મલિકુ",
    english: "The King",
    gujarati: "બાદશાહ",
  },
  {
    id: 65,
    arabic: "الْمُقْتَدِرُ",
    transliteration: "Al-Muqtadir",
    transliterationGu: "અલ્-મુક્-તદીરુ",
    english: "The Powerful",
    gujarati: "કુદરતવાળો (શક્તિ ધરાવનાર)",
  },
  {
    id: 66,
    arabic: "الْمُسَعِّرُ",
    transliteration: "Al-Musa'ir",
    transliterationGu: "અલ્-મુસઅ-ઈરુ",
    english: "The Controller",
    gujarati: "મૂલ્યાંકન કરનાર",
  },
  {
    id: 67,
    arabic: "الْقَابِضُ",
    transliteration: "Al-Qabid",
    transliterationGu: "અલ્-કાબિઝુ",
    english: "The Withholder",
    gujarati: "તંગી કરનાર",
  },
  {
    id: 68,
    arabic: "الْبَاسِطُ",
    transliteration: "Al-Basit",
    transliterationGu: "અલ્-બાસિતુ",
    english: "The Expander",
    gujarati: "પ્રસાર કરનાર",
  },
  {
    id: 69,
    arabic: "الْقَاهِرُ",
    transliteration: "Al-Qahir",
    transliterationGu: "અલ્-કાહિરુ",
    english: "The Subduer",
    gujarati: "પ્રભુત્વવાળો (ગાલિબ)",
  },
  {
    id: 70,
    arabic: "الدَّيَّانُ",
    transliteration: "Ad-Dayyan",
    transliterationGu: "અદ્-દય્યાનુ",
    english: "The Judge",
    gujarati: "બદલો આપનાર",
  },
  {
    id: 71,
    arabic: "الشَّاكِرُ",
    transliteration: "Ash-Shakir",
    transliterationGu: "અશ-શાકીરુ",
    english: "The Appreciative",
    gujarati: "કદરદાન",
  },
  {
    id: 72,
    arabic: "الْمَنَّانُ",
    transliteration: "Al-Mannan",
    transliterationGu: "અલ્-મન્નાનુ",
    english: "The Benefactor",
    gujarati: "ઉપકાર કરનાર",
  },
  {
    id: 73,
    arabic: "الْقَادِرُ",
    transliteration: "Al-Qadir",
    transliterationGu: "અલ્-કાદિર",
    english: "The All-Powerful",
    gujarati: "સર્વ શક્તિમાન",
  },
  {
    id: 74,
    arabic: "الْخَلَّاقُ",
    transliteration: "Al-Khallaq",
    transliterationGu: "અલ્-ખલ્લાકુ",
    english: "The Creator",
    gujarati: "ઉત્પન્ન કરનાર",
  },
  {
    id: 75,
    arabic: "الْمَالِكُ",
    transliteration: "Al-Malik",
    transliterationGu: "અલ્-માલિકુ",
    english: "The Owner",
    gujarati: "સત્તાધીશ",
  },
  {
    id: 76,
    arabic: "الرَّزَّاقُ",
    transliteration: "Ar-Razzaq",
    transliterationGu: "અર્-રઝ્ઝાકુ",
    english: "The Provider",
    gujarati: "રોજી આપનાર",
  },
  {
    id: 77,
    arabic: "الرَّقِيبُ",
    transliteration: "Ar-Raqib",
    transliterationGu: "અર્-રકીબુ",
    english: "The Watchful",
    gujarati: "રખેવાળી કરનાર",
  },
  {
    id: 78,
    arabic: "الْوَكِيلُ",
    transliteration: "Al-Wakil",
    transliterationGu: "અલ્-વકીલુ",
    english: "The Trustee",
    gujarati: "કાર્ય સંપન્ન (કારસાજ)",
  },

  {
    id: 79,
    arabic: "الْمُحْسِنُ",
    transliteration: "Al-Muhsin",
    transliterationGu: "અલ્-મુહસિનુ",
    english: "The Beneficent",
    gujarati: "સદવર્તન કરનાર",
  },
  {
    id: 80,
    arabic: "الْحَسِيبُ",
    transliteration: "Al-Hasib",
    transliterationGu: "અલ્-હસીબુ",
    english: "The Reckoner",
    gujarati: "હિસાબ લેવાવાળો",
  },
  {
    id: 81,
    arabic: "الشَّافِي",
    transliteration: "Ash-Shafi",
    transliterationGu: "અશ્-શાફી",
    english: "The Healer",
    gujarati: "તંદુરસ્તી આપનાર",
  },
  {
    id: 82,
    arabic: "الرَّفِيقُ",
    transliteration: "Ar-Rafiq",
    transliterationGu: "અર-રફીકુ",
    english: "The Gentle",
    gujarati: "નમ્ર સ્વભાવવાળો",
  },
  {
    id: 83,
    arabic: "الْمُعْطِي",
    transliteration: "Al-Mu'ti",
    transliterationGu: "અલ્-મુઅ્-તી",
    english: "The Giver",
    gujarati: "અર્પણ કરનાર",
  },
  {
    id: 84,
    arabic: "الْمُقِيتُ",
    transliteration: "Al-Muqit",
    transliterationGu: "અલ્-મુકીતુ",
    english: "The Nourisher",
    gujarati: "સર્વ શક્તિમાન",
  },
  {
    id: 85,
    arabic: "السَّيِّدُ",
    transliteration: "As-Sayyid",
    transliterationGu: "અસ-સય્યિદુ",
    english: "The Master",
    gujarati: "સરદાર",
  },
  {
    id: 86,
    arabic: "الطَّيِّبُ",
    transliteration: "At-Tayyib",
    transliterationGu: "અલ્-તય્યિબુ",
    english: "The Pure",
    gujarati: "પાક",
  },
  {
    id: 87,
    arabic: "الْحَكَمُ",
    transliteration: "Al-Hakam",
    transliterationGu: "અલ્-હકમુ",
    english: "The Judge",
    gujarati: "ફેસલો કરનાર",
  },
  {
    id: 88,
    arabic: "الْأَكْرَمُ",
    transliteration: "Al-Akram",
    transliterationGu: "અલ્-અક્-રમુ",
    english: "The Most Generous",
    gujarati: "દયાળુ",
  },
  {
    id: 89,
    arabic: "الْبَرُّ",
    transliteration: "Al-Barr",
    transliterationGu: "અલ્-બર્-રુ",
    english: "The Source of Goodness",
    gujarati: "ઉપકાર કરનાર",
  },
  {
    id: 90,
    arabic: "الْغَفَّارُ",
    transliteration: "Al-Ghaffar",
    transliterationGu: "અલ્-ગફ્ફારુ",
    english: "The Oft-Forgiving",
    gujarati: "ખુબ માફ કરવાવાળો",
  },
  {
    id: 91,
    arabic: "الرَّؤُوفُ",
    transliteration: "Ar-Ra'uf",
    transliterationGu: "અર્-રઊફુ",
    english: "The Compassionate",
    gujarati: "દયાળુ",
  },
  {
    id: 92,
    arabic: "الْوَهَّابُ",
    transliteration: "Al-Wahhab",
    transliterationGu: "અલ્-વહ્હાબુ",
    english: "The Bestower",
    gujarati: "ખુબ અર્પણ કરનાર",
  },
  {
    id: 93,
    arabic: "الْجَوَادُ",
    transliteration: "Al-Jawwad",
    transliterationGu: "અલ્-જુવ-વાદુ",
    english: "The Generous",
    gujarati: "દાનવીર",
  },
  {
    id: 94,
    arabic: "السُّبُّوحُ",
    transliteration: "As-Subbuhu",
    transliterationGu: "અસ-સુબ્-બુહુ",
    english: "The Perfect, The Glorious",
    gujarati: "પાક (પવિત્ર)",
  },
  {
    id: 95,
    arabic: "الْوَارِثُ",
    transliteration: "Al-Warith",
    transliterationGu: "અલ્-વારિસુ",
    english: "The Inheritor",
    gujarati: "વારિસ",
  },
  {
    id: 96,
    arabic: "الرَّبُّ",
    transliteration: "Ar-Rabb",
    transliterationGu: "અર્-રબ્બુ",
    english: "The Lord",
    gujarati: "પાલન પોષણ કરનાર",
  },
  {
    id: 97,
    arabic: "الْأَعْلَى",
    transliteration: "Al-A'la",
    transliterationGu: "અલ્-અઅલા",
    english: "The Most High",
    gujarati: "સૌથી ઉચ્ચ (બુલંદ)",
  },
  {
    id: 98,
    arabic: "الْإِلٰهُ",
    transliteration: "Al-Ilah",
    transliterationGu: "અલ્-ઇલાહુ",
    english: "The One worthy of worship",
    gujarati: "સાચો માબુદ (ઇબાદતને લાયક)",
  },
];

const FAVORITES_KEY = "@asmaul_husna_favorites";
const LANGUAGE_PREF_KEY = "@asmaul_husna_language";

export default function AsmaulHusnaScreen() {
  const router = useRouter();
  const { colors, isDark, spacing, fontSize } = useTheme();
  const { t, language } = useLanguage();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showGujarati, setShowGujarati] = useState(true);

  // Load favorites and language preference
  useEffect(() => {
    loadFavorites();
    loadLanguagePreference();
  }, []);

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

  const filteredNames = useMemo(() => {
    let names = ASMAUL_HUSNA;

    if (showFavoritesOnly) {
      names = names.filter((name) => favorites.includes(name.id));
    }

    return names;
  }, [favorites, showFavoritesOnly]);

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

      return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.card }]}>
          <View style={styles.nameCard}>
            {/* Top Row: Number + Transliteration (Left) | Arabic (Right) */}
            <View style={styles.topRow}>
              <View style={styles.leftTop}>
                <View
                  style={[
                    styles.numberBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.numberText}>{item.id}</Text>
                </View>
                <Text
                  style={[styles.transliteration, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {showGujarati ? item.transliterationGu : item.transliteration}
                </Text>
              </View>
              <Text style={[styles.arabicText, { color: colors.primary }]}>
                {item.arabic}
              </Text>
            </View>

            {/* Divider */}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Bottom Row: Meaning (Left) | Actions (Right) */}
            <View style={styles.bottomRow}>
              <Text
                style={[styles.meaningText, { color: colors.textSecondary }]}
                numberOfLines={2}
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
        title={t("asmaulHusna")}
        subtitle={language === "gu" ? "અલ્લાહના 99 નામો" : "99 Names of Allah"}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleLanguage}
            >
              <MaterialIcons name="translate" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowFavoritesOnly(!showFavoritesOnly);
              }}
              style={styles.headerButton}
              accessibilityLabel={
                showFavoritesOnly ? "Show all names" : "Show favorites only"
              }
            >
              <MaterialCommunityIcons
                name={showFavoritesOnly ? "heart" : "heart-outline"}
                size={20}
                color={showFavoritesOnly ? "#ef4444" : "#ffffff"}
              />
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
                colors={["#1e7e34", "#28a745"]}
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
