// All invitation content, transcribed from the printed card.

export const blessing = {
  invocation: '॥ जय श्री महाकाल ॥',
  couplet: ['आते है जिस भाव से, भक्तों के घर भगवान।', 'उसी भाव से आप भी दर्शन दे श्रीमान ॥'],
  salutation: 'स्नेही स्वजन,',
  lines: [
    'भगवान श्री जगन्नाथ जी की असीम कृपा से हमारे परिवार में यह शुभ प्रसंग आया है,',
    'शुभ प्रसंग है, हमारे लाड़ले …',
  ],
}

export const groom = {
  title: 'चि.',
  name: 'जितेन्द्र देथलिया',
  first: 'जितेन्द्र',
  en: 'Jitendra',
  relation: 'सुपुत्र : संतोष देथलिया',
  place: '(उज्जैन)',
}

export const bride = {
  title: 'सौ.कां.',
  name: 'अंशिका पटेल',
  first: 'अंशिका',
  en: 'Anshika',
  relation: 'सुपुत्री : विनोद पटेल',
  place: '(अरनिया कलाँ)',
}

export const ganesh = {
  invocation: '॥ श्री गणेशाय नमः ॥',
  shlokas: [
    ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः।', 'निर्विघ्नं कुरुमेदेव, सर्वकार्येषु सर्वदा ॥'],
    ['प्रथम निमंत्रण आपको गौरी पुत्र गणेश', 'रिद्धि सिद्धि सहित पधारो ब्रह्मा, विष्णु, महेश ॥'],
  ],
}

// start/end are local (IST) times used for calendar files
export const events = [
  {
    id: 'ganesh',
    icon: 'ganesh',
    title: 'गणेश पूजन',
    en: 'Ganesh Pujan',
    tithi: 'अगहन कृष्ण पक्ष पंचमी',
    date: 'दि. 29.11.2026, रविवार',
    time: '(दोप. 1:00 बजे)',
    start: '2026-11-29T13:00:00',
    hours: 2,
  },
  {
    id: 'haldi',
    icon: 'haldi',
    title: 'हल्दी एवं मेहंदी',
    en: 'Haldi & Mehendi',
    tithi: 'अगहन कृष्ण पक्ष छटमी/सप्तमी',
    date: 'दि. 30.11.2026, सोमवार',
    time: '(प्रातः 10:00 बजे)',
    start: '2026-11-30T10:00:00',
    hours: 4,
  },
  {
    id: 'mandap',
    icon: 'mandap',
    title: 'मण्डप',
    en: 'Mandap',
    tithi: 'अगहन कृष्ण पक्ष अष्टमी',
    date: 'दि. 01.12.2026, मंगलवार',
    time: '(प्रातः 10:00 बजे)',
    start: '2026-12-01T10:00:00',
    hours: 3,
  },
  {
    id: 'bana',
    icon: 'horse',
    title: 'वर निकासी (बाना)',
    en: 'Var Nikasi',
    tithi: 'अगहन कृष्ण पक्ष अष्टमी',
    date: 'दि. 01.12.2026, मंगलवार',
    time: '(शाम 07:00 बजे)',
    place: 'स्थान – विवेकानंद कॉलोनी से',
    start: '2026-12-01T19:00:00',
    hours: 3,
  },
  {
    id: 'lagna',
    icon: 'agni',
    title: 'शुभलग्न',
    en: 'Shubh Lagna',
    tithi: 'अगहन कृष्ण पक्ष नवमी',
    date: 'दि. 02.12.2026, बुधवार',
    time: '(गोधुली बेला)',
    start: '2026-12-02T17:30:00',
    hours: 4,
    highlight: true,
  },
]

export const reception = {
  title: 'आशीर्वाद समारोह',
  subtitle: 'एवं स्वरुचिभोज',
  en: 'Blessing Ceremony & Dinner',
  date: 'दि. 03 दिसम्बर 2026, गुरुवार',
  time: 'समय : सायं 7:00 बजे से आपके आगमन तक',
  venueLabel: ': कार्यक्रम स्थान :',
  venue: '“शिवांजलि गार्डन”',
  address: 'नीलगंगा, हनुमान जी मंदिर के सामने, उज्जैन',
  mapQuery: 'Shivanjali Garden, Neelganga, Ujjain, Madhya Pradesh',
  start: '2026-12-03T19:00:00',
  hours: 4,
}

export const baratNote =
  'बारात श्रीमान विनोद जी पटेल (ग्राम अरनिया कलाँ, जिला–शाजापुर) वालों के यहाँ दि. 02 दिसम्बर 2026, बुधवार को दोप. 1:00 बजे उज्जैन से रवाना होगी और शिवम् मैरिज गार्डन पचोर रोड़, अरनिया कलाँ शाम 4:00 बजे पहुचेंगी।'

export const baratMapQuery = 'Shivam Marriage Garden, Pachore Road, Araniya Kalan, Shajapur'

export const welcome = {
  lines: [
    'शुभ अवसर पर हम सत्कार की थाली में चंदन सा आदर,',
    'कुमकुम सी आस्था, पुष्प सा प्रेम, अक्षत सा समर्पण लिये',
  ],
  family: 'देथलिया',
  closing: 'परिवार आपके स्वागत हेतु प्रतिक्षारत है।',
}

export const balManuhar = {
  title: 'बालमनुहार',
  lines: ['खुशियो की रात होगी जश्न जरा हट के होगा,', 'हमारे भाई की शादी में अंदाज जरा हट के होगा।'],
  kids: ['लड्डू', 'मोनू', 'नैतिक', 'चिकू', 'शोबी'],
}

// Shubh Lagna — Godhuli bela, 2 Dec 2026 (IST)
export const weddingMoment = new Date('2026-12-02T17:30:00+05:30')
