import { createContext, useContext } from 'react'

// Full LV/EN copy. LV is the default kiosk language. Both must always work.
export const STRINGS = {
  lv: {
    langName: 'LV',
    tagline: 'Banka ambicioziem cilvēkiem un viņu uzņēmumiem',
    gameKicker: 'Investīciju spēle',
    attractTitle1: 'Kur tu ieguldītu',
    attractTitle2: '10 000 €?',
    attractSub: 'Sadali naudu pa nozarēm, obligācijām un fondiem un uzzini, kas ar to būtu noticis pēdējos 12 mēnešos.',
    playSplit: 'Sadali 10 000 €',
    playQuiz: 'Tirgus viktorīna',
    quizPanelSub: '5 jautājumi par Baltijas kapitāla tirgu. Cik labi tu to pazīsti?',
    play: 'Spēlēt',
    back: 'Atpakaļ',

    quizKicker: 'Baltijas tirgus viktorīna',
    quizQn: 'Jautājums {n}/{total}',
    quizNext: 'Tālāk',
    quizFinish: 'Rezultāts',
    quizScoreLabel: 'Tavs rezultāts',
    quizAgain: 'Vēlreiz viktorīnu',
    quizTrySplit: 'Sadali 10 000 €',
    quizTitle0: 'Tirgus iesācējs',
    quizTitle1: 'Drošs investors',
    quizTitle2: 'Baltijas tirgus eksperts',
    quizOutro0: 'Labs sākums! Kapitāla tirgus nav sarežģītāks par šo spēli, un Signet komanda labprāt izstāstīs pārējo.',
    quizOutro1: 'Stabils rezultāts! Tev jau ir laba izpratne par to, kā strādā nauda.',
    quizOutro2: 'Izcili! Tu pārzini Baltijas tirgu labāk nekā lielākā daļa.',

    buildTitle: 'Sadali savus 10 000 €',
    buildHint: 'Pieskaries, lai ieguldītu pa 1 000 €',
    buildLeft: 'atlicis',
    clear: 'Notīrīt',
    seeResult: 'Skatīt rezultātu',

    colStocks: 'Akciju nozares',
    colBonds: 'Obligācijas',
    colFunds: 'Fondi',
    infoStocksTitle: 'Kas ir akcijas?',
    infoStocksBody: 'Akcija ir daļa uzņēmumā: ja uzņēmumam iet labi, tās vērtība aug, ja slikti, tā krīt. Šajā spēlē tu ieguldi veselā nozarē ar biržas fondu (ETF), kas nopērk visus nozares lielākos uzņēmumus uzreiz. Akcijām vēsturiski ir augstākais ienesīgums, bet arī lielākās svārstības.',
    infoBondsTitle: 'Kas ir obligācijas?',
    infoBondsBody: 'Obligācija ir aizdevums valstij vai uzņēmumam. Pretī tu saņem fiksētus procentus (kuponu), un termiņa beigās atgūsti ieguldīto summu. Jo augstāks kupons, jo lielāku risku tirgus saskata aizņēmējā: valsts maksā mazāk, uzņēmumi vairāk.',
    infoFundsTitle: 'Kas ir fondi?',
    infoFundsBody: 'Fonds apvieno daudzu ieguldītāju naudu un iegulda to desmitos vai simtos vērtspapīru uzreiz. Vienā pirkumā tu iegūsti gatavu, dažādotu portfeli, kuru pārvalda profesionāļi. SPY seko ASV akciju tirgum, Signet fonds iegulda Baltijas uzņēmumu obligācijās.',
    infoClose: 'Sapratu',

    sectors: {
      tech: 'Tehnoloģijas',
      energy: 'Enerģētika',
      health: 'Veselība',
      fin: 'Finanses',
      consumer: 'Patēriņš',
      media: 'Mediji un izklaide',
    },
    govtName: 'Latvijas valsts obligācijas',
    govtShort: 'Valsts obligācijas',
    govtSub: 'Latvijas valsts',
    perYear: '{pct} gadā',
    fundSpySub: 'ASV S&P 500 indekss',
    fundSignetSub: 'Baltijas obligāciju fonds',

    resultKicker: 'Pēc 12 mēnešiem',
    resultHeadline: 'Tavi 10 000 € tagad ir',
    yourPortfolio: 'Tavs portfelis',
    benchmarkLabel: 'Signet fonds',
    statStart: 'sākuma summa',
    statBest: 'labākais mēnesis',
    statWorst: 'sliktākais mēnesis',
    statCoupon: 'kupons gadā',
    statFreq: 'kuponu maksājumi',
    freqMonthly: 'reizi mēnesī',
    freqSemi: 'reizi pusgadā',
    freqAnnual: 'reizi gadā',

    breakdownTitle: 'Tavs sadalījums',
    compareTitle: 'Ja tu būtu izvēlējies citādi',

    fundPanelTitle: 'Signet Baltic Bond Fund',
    fundPanelBody: 'Pirmais Baltijas uzņēmumu obligāciju fonds: stabils ceļš bez akciju svārstībām. Ieguldījums no 100 €.',
    fundPanelBodyPicked: 'Tu izvēlējies mierīgo ceļu: Baltijas uzņēmumu obligācijas ar stabilu ienesīgumu. Ieguldījums no 100 €.',
    fundPanelStat: '+8,0 % pēdējos 12 mēnešos',
    fundCta: 'Jautā Signet komandai',
    playAgain: 'Spēlēt vēlreiz',

    disclaimer: 'Spēles simulācija ar vēsturiskiem datiem no 08.2025 līdz 08.2026. Vēsturiskais ienesīgums negarantē nākotnes rezultātus, un tas nav ieguldījumu ieteikums.',
  },

  en: {
    langName: 'EN',
    tagline: 'The bank for ambitious people and their businesses',
    gameKicker: 'The investment game',
    attractTitle1: 'Where would you invest',
    attractTitle2: '€10,000?',
    attractSub: 'Split the money across sectors, bonds and funds, and see what would have happened to it over the past 12 months.',
    playSplit: 'Split €10,000',
    playQuiz: 'Market quiz',
    quizPanelSub: '5 questions about the Baltic capital market. How well do you know it?',
    play: 'Play',
    back: 'Back',

    quizKicker: 'Baltic market quiz',
    quizQn: 'Question {n}/{total}',
    quizNext: 'Next',
    quizFinish: 'See my score',
    quizScoreLabel: 'Your score',
    quizAgain: 'Retake the quiz',
    quizTrySplit: 'Split €10,000',
    quizTitle0: 'Market newcomer',
    quizTitle1: 'Confident investor',
    quizTitle2: 'Baltic market expert',
    quizOutro0: 'A good start! Capital markets are no harder than this game, and the Signet team is happy to explain the rest.',
    quizOutro1: 'A solid result! You already have a good sense of how money works.',
    quizOutro2: 'Excellent! You know the Baltic market better than most.',

    buildTitle: 'Split your €10,000',
    buildHint: 'Tap to invest €1,000 at a time',
    buildLeft: 'left to invest',
    clear: 'Clear',
    seeResult: 'See the result',

    colStocks: 'Stock sectors',
    colBonds: 'Bonds',
    colFunds: 'Funds',
    infoStocksTitle: 'What are stocks?',
    infoStocksBody: 'A stock is a share of a company: when the company does well its value rises, when it struggles the value falls. In this game you invest in a whole sector through an exchange-traded fund (ETF) that buys all of the sector’s biggest companies at once. Stocks have historically returned the most, with the biggest swings.',
    infoBondsTitle: 'What are bonds?',
    infoBondsBody: 'A bond is a loan to a government or a company. In return you receive fixed interest (the coupon), and at maturity you get your money back. The higher the coupon, the more risk the market sees in the borrower: governments pay less, companies pay more.',
    infoFundsTitle: 'What are funds?',
    infoFundsBody: 'A fund pools money from many investors and spreads it across dozens or hundreds of securities at once. One purchase buys you a ready-made, diversified portfolio run by professionals. SPY tracks the US stock market; the Signet fund invests in Baltic corporate bonds.',
    infoClose: 'Got it',

    sectors: {
      tech: 'Technology',
      energy: 'Energy',
      health: 'Healthcare',
      fin: 'Financials',
      consumer: 'Consumer',
      media: 'Media & entertainment',
    },
    govtName: 'Latvian government bonds',
    govtShort: 'Government bonds',
    govtSub: 'The Latvian state',
    perYear: '{pct} a year',
    fundSpySub: 'The US S&P 500 index',
    fundSignetSub: 'Baltic bond fund',

    resultKicker: '12 months later',
    resultHeadline: 'Your €10,000 is now',
    yourPortfolio: 'Your portfolio',
    benchmarkLabel: 'Signet fund',
    statStart: 'starting amount',
    statBest: 'best month',
    statWorst: 'worst month',
    statCoupon: 'annual coupon',
    statFreq: 'coupon payments',
    freqMonthly: 'monthly',
    freqSemi: 'twice a year',
    freqAnnual: 'once a year',

    breakdownTitle: 'Your split',
    compareTitle: 'If you had chosen differently',

    fundPanelTitle: 'Signet Baltic Bond Fund',
    fundPanelBody: 'The first Baltic corporate bond fund: a steady path without stock-market swings. Invest from €100.',
    fundPanelBodyPicked: 'You chose the calm path: Baltic corporate bonds with a steady return. Invest from €100.',
    fundPanelStat: '+8.0% over the past 12 months',
    fundCta: 'Ask the Signet team',
    playAgain: 'Play again',

    disclaimer: 'A game simulation using historical data from Aug 2025 to Aug 2026. Past performance does not guarantee future results, and this is not investment advice.',
  },
}

// Quiz question banks. Parallel arrays: the same question/answer order in both
// languages, so switching language mid-quiz keeps the state valid.
export const QUIZ = {
  lv: [
    {
      q: 'Kam pieder Rīgas, Tallinas un Viļņas biržas?',
      options: ['Nasdaq grupai', 'Londonas biržai', 'Eiropas Centrālajai bankai'],
      correct: 0,
      fact: 'Visas trīs Baltijas biržas ir daļa no ASV Nasdaq grupas, tāpēc kopējo tirgu sauc par Nasdaq Baltic.',
    },
    {
      q: 'Cik lielu ienesīgumu šobrīd dod Latvijas valsts 10 gadu obligācijas?',
      options: ['Aptuveni 1 % gadā', 'Aptuveni 3,5 % gadā', 'Aptuveni 8 % gadā'],
      correct: 1,
      fact: '2026. gada vidū Latvijas 10 gadu obligāciju ienesīgums ir ap 3,7 % gadā (ECB dati).',
    },
    {
      q: 'Kas ir obligācijas kupons?',
      options: ['Fiksētie procenti, ko aizņēmējs maksā ieguldītājam', 'Atlaižu kods akciju pirkšanai', 'Biržas komisijas maksa'],
      correct: 0,
      fact: 'Kupons ir obligācijas procentu maksājums. Baltijas uzņēmumu obligācijās tas šobrīd parasti ir 8 līdz 11 % gadā.',
    },
    {
      q: 'Kurš ir pirmais atvērtais fonds, kas iegulda tieši Baltijas uzņēmumu obligācijās?',
      options: ['Signet Baltic Bond Fund', 'Swedbank pensiju fonds', 'SEB Eiropas fonds'],
      correct: 0,
      fact: 'Signet Baltic Bond Fund darbu sāka 2025. gada maijā un pirmajā gadā ienesa ieguldītājiem 7,6 %.',
    },
    {
      q: 'Kura nozare pasaules tirgos pēdējos 12 mēnešos auga visstraujāk?',
      options: ['Tehnoloģijas', 'Enerģētika', 'Mediji un izklaide'],
      correct: 0,
      fact: 'Tehnoloģiju sektors eiro izteiksmē pieauga par aptuveni 48 % (no 2025. gada augusta līdz 2026. gada augustam).',
    },
  ],
  en: [
    {
      q: 'Who owns the Riga, Tallinn and Vilnius stock exchanges?',
      options: ['The Nasdaq group', 'The London Stock Exchange', 'The European Central Bank'],
      correct: 0,
      fact: 'All three Baltic exchanges are part of the US Nasdaq group, which is why the joint market is called Nasdaq Baltic.',
    },
    {
      q: 'How much do Latvian 10-year government bonds currently yield?',
      options: ['About 1% a year', 'About 3.5% a year', 'About 8% a year'],
      correct: 1,
      fact: 'In mid-2026 the Latvian 10-year yield is around 3.7% a year (ECB data).',
    },
    {
      q: 'What is a bond coupon?',
      options: ['The fixed interest the borrower pays the investor', 'A discount code for buying stocks', 'The stock exchange fee'],
      correct: 0,
      fact: 'The coupon is the bond’s interest payment. Baltic corporate bonds currently pay around 8 to 11% a year.',
    },
    {
      q: 'Which is the first open-ended fund investing directly in Baltic corporate bonds?',
      options: ['Signet Baltic Bond Fund', 'A Swedbank pension fund', 'A SEB European fund'],
      correct: 0,
      fact: 'Signet Baltic Bond Fund launched in May 2025 and returned 7.6% to investors in its first year.',
    },
    {
      q: 'Which sector grew the fastest in world markets over the past 12 months?',
      options: ['Technology', 'Energy', 'Media & entertainment'],
      correct: 0,
      fact: 'The technology sector gained about 48% in euro terms (August 2025 to August 2026).',
    },
  ],
}

export function fill(str, vars) {
  if (!vars || typeof str !== 'string') return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`))
}

export const LangContext = createContext({ lang: 'lv', setLang: () => {} })

export function useT() {
  const { lang, setLang } = useContext(LangContext)
  const dict = STRINGS[lang] || STRINGS.lv
  const t = (key, vars) => fill(dict[key], vars)
  return { t, lang, setLang, dict }
}
