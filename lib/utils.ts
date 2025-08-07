import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// QRP Response Generator
export function getRandomResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  // Code-related responses
  if (lowerInput.includes("code") || lowerInput.includes("programmeren") || lowerInput.includes("script") || lowerInput.includes("javascript") || lowerInput.includes("python") || lowerInput.includes("html") || lowerInput.includes("css")) {
    const codeResponses = [
      "Geweldig! Code schrijven is een van mijn favoriete dingen! 💻\n\nIk kan je helpen met:\n• **JavaScript** - Van basis tot geavanceerde concepten\n• **Python** - Scripts, data analyse, web development\n• **HTML/CSS** - Websites bouwen en stylen\n• **React** - Moderne web applicaties\n• **Node.js** - Backend development\n\nWat voor code wil je maken? Ik help je graag stap voor stap!",
      "Ah, programmeren! Dat is precies waar ik goed in ben! 🚀\n\nVertel me:\n• Welke programmeertaal gebruik je?\n• Wat probeer je te bouwen?\n• Waar loop je tegenaan?\n\nOf het nu gaat om een simpel script of een complexe applicatie, ik help je graag met:\n✓ Code schrijven en debuggen\n✓ Best practices uitleggen\n✓ Problemen oplossen\n✓ Nieuwe concepten leren",
      "Perfect! Laten we samen wat code maken! 🎯\n\nIk ben er om je te helpen met:\n• **Debugging** - Fouten vinden en oplossen\n• **Code review** - Je code verbeteren\n• **Nieuwe features** - Functionaliteit toevoegen\n• **Leren** - Nieuwe talen en frameworks\n\nWat voor code wil je maken? Ik help je graag stap voor stap!",
      "Code schrijven is als puzzels oplossen - ik vind het geweldig! 🧩\n\nIk kan je ondersteunen bij:\n• **Frontend** - HTML, CSS, JavaScript, React\n• **Backend** - Node.js, Python, API's\n• **Databases** - SQL, MongoDB\n• **Tools** - Git, npm, webpack\n\nWat voor code wil je maken? Ik help je graag stap voor stap!",
      "Fantastisch! Programmeren is een van mijn specialiteiten! ⚡\n\nOf je nu:\n• Een website wilt bouwen\n• Een app wilt maken\n• Data wilt analyseren\n• Een probleem wilt oplossen\n\nWat voor code wil je maken? Ik help je graag stap voor stap!",
      "Code schrijven is een van mijn favoriete dingen! 🚀\n\nIk kan je helpen met:\n• Debugging en foutoplossing\n• Code optimalisatie\n• Nieuwe functies bouwen\n• Best practices uitleggen\n• Algoritmes en datastructuren\n\nLaat me weten wat je nodig hebt!",
    ]
    return codeResponses[Math.floor(Math.random() * codeResponses.length)]
  }

  if (lowerInput.includes("huiswerk") || lowerInput.includes("school") || lowerInput.includes("studie")) {
    const homeworkResponses = [
      "Natuurlijk help ik je met je huiswerk! 📚\n\nIk kan je ondersteunen bij:\n• **Wiskunde** - Van basis tot gevorderde onderwerpen\n• **Natuurkunde** - Formules en concepten uitleggen\n• **Geschiedenis** - Feiten en verbanden\n• **Talen** - Grammatica en woordenschat\n• **Essays schrijven** - Structuur en argumentatie\n\nWaar heb je hulp bij nodig?",
      "Super! Huiswerk maken wordt veel leuker met hulp. Ik leg alles stap voor stap uit zodat je het echt begrijpt.\n\nVertel me:\n• Welk vak is het?\n• Wat is de opdracht?\n• Waar loop je vast?\n\nDan gaan we er samen tegenaan! 💪",
      "Ik help je graag met studeren! Als QRP probeer ik moeilijke concepten simpel uit te leggen.\n\nWat voor huiswerk heb je? Ik kan helpen met uitleg, voorbeelden geven, of je door de stappen heen leiden.",
    ]
    return homeworkResponses[Math.floor(Math.random() * homeworkResponses.length)]
  }

  if (
    lowerInput.includes("afbeelding") ||
    lowerInput.includes("foto") ||
    lowerInput.includes("plaatje") ||
    lowerInput.includes("image")
  ) {
    const imageResponses = [
      "Geweldig! Ik help je graag met afbeeldingen! 🎨\n\nIk kan je ondersteunen bij:\n• **Foto's analyseren** - Upload een afbeelding en ik beschrijf wat ik zie\n• **Creatieve ideeën** - Concepten voor designs en artwork\n• **Logo ontwerp** - Suggesties en inspiratie\n• **Kleurpaletten** - Harmonieuze kleurcombinaties\n\nHeb je een afbeelding die je wilt uploaden, of wil je ideeën voor een nieuw design?",
      "Afbeeldingen maken en analyseren is super leuk! 📸\n\nUpload gerust een foto en ik help je met:\n• Beschrijving van de inhoud\n• Suggesties voor verbetering\n• Creatieve bewerkingsideeën\n• Inspiratie voor vergelijkbare designs\n\nWat heb je in gedachten?",
      "Perfect! Ik ben dol op visuele projecten. Of je nu een logo wilt ontwerpen, een foto wilt analyseren, of inspiratie zoekt - ik help je graag!\n\nVertel me meer over je project!",
    ]
    return imageResponses[Math.floor(Math.random() * imageResponses.length)]
  }

  if (
    lowerInput.includes("muziek") ||
    lowerInput.includes("lied") ||
    lowerInput.includes("melodie") ||
    lowerInput.includes("akkoord")
  ) {
    const musicResponses = [
      "Muziek maken is fantastisch! 🎵\n\nIk kan je helpen met:\n• **Akkoordprogressies** - Populaire en interessante combinaties\n• **Melodieën** - Eenvoudige tot complexe melodische lijnen\n• **Songteksten** - Creatieve en betekenisvolle lyrics\n• **Muziektheorie** - Uitleg van concepten en regels\n• **Instrumentkeuze** - Welke instrumenten passen bij je stijl\n\nWat voor muziek wil je maken?",
      "Geweldig! Muziek is een universele taal. 🎶\n\nVertel me:\n• Welk genre spreekt je aan?\n• Speel je al een instrument?\n• Wil je een volledig nummer of alleen een melodie?\n\nIk help je graag met het creatieve proces!",
      "Muziek componeren is een van mijn favoriete creatieve uitdagingen!\n\nIk kan je helpen met alles van eenvoudige melodieën tot complexe arrangementen. Wat heb je in gedachten?",
    ]
    return musicResponses[Math.floor(Math.random() * musicResponses.length)]
  }

  if (lowerInput.includes("hallo") || lowerInput.includes("hoi") || lowerInput.includes("hey")) {
    const greetingResponses = [
      "Hallo daar! 👋\n\nLeuk je te ontmoeten! Ik ben QRP, je vriendelijke AI assistent. Ik sta klaar om je te helpen met van alles en nog wat!\n\nWaarmee kan ik je vandaag van dienst zijn?",
      "Hoi! Welkom bij QRP! 😊\n\nIk ben hier om je te helpen met:\n• Code schrijven en programmeren\n• Huiswerk en studie-ondersteuning\n• Creatieve projecten\n• Algemene vragen\n\nVertel me waar je mee bezig bent!",
      "Hey! Fijn dat je er bent! 🌟\n\nIk ben QRP en ik help je graag met al je vragen en projecten. Van simpele vragen tot complexe uitdagingen - ik doe mijn best om je te ondersteunen!\n\nWaar kan ik je mee helpen?",
    ]
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)]
  }

  if (lowerInput.includes("dank") || lowerInput.includes("bedankt") || lowerInput.includes("thanks")) {
    const thankResponses = [
      "Graag gedaan! 😊\n\nIk help altijd graag! Het is fijn om te weten dat ik je kon ondersteunen.\n\nHeb je nog andere vragen of projecten waar ik je mee kan helpen?",
      "Geen probleem! Dat is waar ik voor ben! 🌟\n\nIk vind het leuk om mensen te helpen en te zien dat het nuttig is. Laat me weten als je nog meer hulp nodig hebt!",
      "Je bent welkom! Het was me een genoegen om je te helpen! 💫\n\nIk sta altijd klaar voor je volgende vraag of uitdaging!",
    ]
    return thankResponses[Math.floor(Math.random() * thankResponses.length)]
  }

  // Default responses
  const defaultResponses = [
    "Dat is een interessante vraag! 🤔\n\nAls QRP help ik je graag verder. Kun je me wat meer details geven zodat ik je beter kan ondersteunen?\n\nIk kan helpen met code, huiswerk, creatieve projecten, en nog veel meer!",
    "Geweldig dat je dat vraagt! 💡\n\nIk sta klaar om je te helpen. Vertel me meer over wat je precies wilt weten of waar je mee bezig bent.\n\nOf het nu gaat om programmeren, studie, of creatieve projecten - ik doe mijn best!",
    "Super vraag! 🚀\n\nLaat me daar even over nadenken... Als QRP probeer ik altijd het beste antwoord te geven.\n\nKun je me wat meer context geven? Dan kan ik je nog beter helpen!",
    "Dat klinkt als een leuke uitdaging! 🎯\n\nIk help je graag verder. Vertel me meer details zodat ik je de beste ondersteuning kan bieden.\n\nWaar kan ik je precies mee helpen?",
    "Interessant! 🌟\n\nIk ben er om je te helpen met al je vragen. Of het nu gaat om:\n• Technische problemen oplossen\n• Creatieve projecten\n• Leren en studeren\n• Of gewoon een gezellig gesprek\n\nVertel me meer!",
    "Fantastisch! 🎉\n\nAls QRP vind ik het geweldig om mensen te helpen leren en groeien. \n\nWat heb je precies nodig? Ik sta voor je klaar!",
    "Dat is precies het soort vraag waar ik goed in ben! 💪\n\nLaat me je helpen met een praktische oplossing. Vertel me wat meer over je situatie.\n\nSamen krijgen we dit voor elkaar!",
    "Perfect! 🌈\n\nIk help je graag met al je vragen en uitdagingen. Van simpel tot complex - ik doe mijn best om je te ondersteunen.\n\nWaar zullen we mee beginnen?",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// Storage utilities
export const storage = {
  get: (key: string) => {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Storage error:", error)
    }
  },

  remove: (key: string) => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}

// Generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Color utilities for Material 3
export function hexToHsl(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
