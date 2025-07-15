import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ConversationThread, { Message } from './components/ConversationThread';
import Navbar from './components/Navbar';
import { supabase } from './lib/supabase';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  uri?: string;
}

interface AnalysisResult {
  id: string;
  question: string;
  answer: string;
  created_at?: string;
  document_type?: string;
  language?: string;
  tokens_used?: number;
}

// Add type for translations object
interface TranslationStrings {
  [key: string]: string;
}

const translations: { [lang: string]: TranslationStrings } = {
  en: {
    language: 'Language',
    heroTitle: 'Your AI Document Assistant',
    heroSubtitle: 'Upload documents or take photos to get instant AI-powered insights and answers.',
    upload: 'Upload Document',
    uploadPDF: 'Upload PDF',
    uploadImage: 'Upload Image',
    analyze: 'Start Analyzing',

    documentPool: 'Document Pool',
    results: 'Analysis Results',
    followup: 'Ask Follow-up Questions',
    followupPlaceholder: 'Ask a follow-up question...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Document Analysis AI',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cancel: 'Cancel Subscription',
    legal: 'Legal Disclaimer',
    analyzing: 'Analyzing...',
    selectType: 'Select type',

    selectLanguage: 'Select language',
    errorEmailPassword: 'Please enter both email and password',
    errorUpload: 'Please upload at least one document',
    errorPickDoc: 'Failed to pick document',
    errorPickImg: 'Failed to pick image',
    errorFollowup: 'Please enter a question',
    ask: 'Ask',
    'button.upload': 'Upload Document',
    'button.takePhoto': 'Take a Picture',
    'messages.placeholder': 'Your analysis will appear here.',
    'messages.noMessages': 'No messages yet.',
    analysisLimitWarning: 'You have used all your available analyses. Please upgrade your plan to continue.',
    noAnalysesLeft: 'No analyses left',
    topUpAccount: 'Top up your account',
    noAnalysesMessage: 'You have no analyses left.',
    refillLink: 'Tap here to refill your account.',
    disclaimer: 'This analysis is for informational purposes only and does not constitute legal advice. For legal matters, please consult a qualified attorney.',

    photoHelperText: 'Photos will be automatically added to your document list',
    showPreviousAnalyses: 'Show previous analyses',
    hidePreviousAnalyses: 'Hide previous analyses',
  },
  es: {
    language: 'Idioma',
    heroTitle: 'Tu asistente de documentos con IA',
    heroSubtitle: 'Sube documentos o toma fotos para obtener respuestas e información instantánea con IA.',
    upload: 'Subir documento',
    uploadPDF: 'Subir PDF',
    uploadImage: 'Subir imagen',
    analyze: 'Comenzar análisis',

    documentPool: 'Documentos',
    results: 'Resultados del análisis',
    followup: 'Preguntar seguimiento',
    followupPlaceholder: 'Haz una pregunta de seguimiento...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Análisis de documentos con IA',
    email: 'Correo electrónico',
    password: 'Contraseña',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    privacy: 'Política de privacidad',
    terms: 'Términos de servicio',
    cancel: 'Cancelar suscripción',
    legal: 'Aviso legal',
    analyzing: 'Analizando...',
    selectType: 'Seleccionar tipo',

    selectLanguage: 'Seleccionar idioma',
    errorEmailPassword: 'Por favor, introduce correo y contraseña',
    errorUpload: 'Por favor, sube al menos un documento',
    errorPickDoc: 'Error al seleccionar documento',
    errorPickImg: 'Error al seleccionar imagen',
    errorFollowup: 'Por favor, introduce una pregunta',
    ask: 'Preguntar',
    'button.upload': 'Subir documento',
    'button.takePhoto': 'Tomar una foto',
    'messages.placeholder': 'Tu análisis aparecerá aquí.',
    'messages.noMessages': 'Aún no hay mensajes.',
    analysisLimitWarning: 'Has utilizado todas tus análisis disponibles. Por favor, actualiza tu plan para continuar.',
    noAnalysesLeft: 'No quedan análisis',
    topUpAccount: 'Recarga tu cuenta',
    noAnalysesMessage: 'No tienes análisis restantes.',
    refillLink: 'Toca aquí para recargar tu cuenta.',
    disclaimer: 'Este análisis tiene únicamente fines informativos y no constituye asesoramiento legal. Para cuestiones legales, consulta con un abogado calificado.',

    photoHelperText: 'Las fotos se añadirán automáticamente a tu lista de documentos',
    showPreviousAnalyses: 'Mostrar análisis anteriores',
    hidePreviousAnalyses: 'Ocultar análisis anteriores',
  },
  de: {
    language: 'Sprache',
    heroTitle: 'Ihr KI-Dokumentenassistent',
    heroSubtitle: 'Laden Sie Dokumente hoch oder machen Sie Fotos, um sofort KI-gestützte Einblicke und Antworten zu erhalten.',
    upload: 'Dokument hochladen',
    uploadPDF: 'PDF hochladen',
    uploadImage: 'Bild hochladen',
    analyze: 'Analyse starten',

    documentPool: 'Dokumentenpool',
    results: 'Analyseergebnisse',
    followup: 'Folgefragen stellen',
    followupPlaceholder: 'Stellen Sie eine Folgefrage...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Dokumentenanalyse KI',
    email: 'E-Mail',
    password: 'Passwort',
    login: 'Anmelden',
    logout: 'Abmelden',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
    cancel: 'Abo kündigen',
    legal: 'Rechtlicher Hinweis',
    analyzing: 'Analysiere...',
    selectType: 'Typ auswählen',

    selectLanguage: 'Sprache auswählen',
    errorEmailPassword: 'Bitte E-Mail und Passwort eingeben',
    errorUpload: 'Bitte mindestens ein Dokument hochladen',
    errorPickDoc: 'Dokument konnte nicht ausgewählt werden',
    errorPickImg: 'Bild konnte nicht ausgewählt werden',
    errorFollowup: 'Bitte geben Sie eine Frage ein',
    ask: 'Fragen',
    'button.upload': 'Dokument hochladen',
    'button.takePhoto': 'Foto aufnehmen',
    'messages.placeholder': 'Ihre Analyse erscheint hier.',
    'messages.noMessages': 'Noch keine Nachrichten.',
    analysisLimitWarning: 'Sie haben alle Ihre verfügbaren Analysen verwendet. Bitte aktualisieren Sie Ihr Abonnement, um fortzufahren.',
    noAnalysesLeft: 'Keine Analysen übrig',
    topUpAccount: 'Konto aufladen',
    noAnalysesMessage: 'Sie haben keine Analysen mehr.',
    refillLink: 'Tippen Sie hier, um Ihr Konto aufzufüllen.',
    disclaimer: 'Diese Analyse dient ausschließlich zu Informationszwecken und stellt keine Rechtsberatung dar. Wenden Sie sich für rechtliche Fragen an einen qualifizierten Anwalt.',

    photoHelperText: 'Fotos werden automatisch zu Ihrer Dokumentenliste hinzugefügt',
    showPreviousAnalyses: 'Frühere Analysen anzeigen',
    hidePreviousAnalyses: 'Frühere Analysen ausblenden',
  },
  pl: {
    language: 'Język',
    heroTitle: 'Twój asystent dokumentów AI',
    heroSubtitle: 'Prześlij dokumenty lub zrób zdjęcia, aby uzyskać natychmiastowe odpowiedzi i wgląd AI.',
    upload: 'Prześlij dokument',
    uploadPDF: 'Prześlij PDF',
    uploadImage: 'Prześlij obraz',
    analyze: 'Rozpocznij analizę',

    documentPool: 'Pula dokumentów',
    results: 'Wyniki analizy',
    followup: 'Zadaj pytanie uzupełniające',
    followupPlaceholder: 'Zadaj pytanie uzupełniające...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Analiza dokumentów AI',
    email: 'E-mail',
    password: 'Hasło',
    login: 'Zaloguj się',
    logout: 'Wyloguj się',
    privacy: 'Polityka prywatności',
    terms: 'Regulamin',
    cancel: 'Anuluj subskrypcję',
    legal: 'Informacja prawna',
    analyzing: 'Analizowanie...',
    selectType: 'Wybierz typ',

    selectLanguage: 'Wybierz język',
    errorEmailPassword: 'Wprowadź e-mail i hasło',
    errorUpload: 'Prześlij co najmniej jeden dokument',
    errorPickDoc: 'Nie udało się wybrać dokumentu',
    errorPickImg: 'Nie udało się wybrać obrazu',
    errorFollowup: 'Wprowadź pytanie',
    ask: 'Zadaj',
    'button.upload': 'Prześlij dokument',
    'button.takePhoto': 'Zrób zdjęcie',
    'messages.placeholder': 'Twoja analiza pojawi się tutaj.',
    'messages.noMessages': 'Brak wiadomości.',
    analysisLimitWarning: 'Wykorzystałeś wszystkie dostępne analizy. Proszę uaktualnij swój plan, aby kontynuować.',
    noAnalysesLeft: 'Brak pozostałych analiz',
    topUpAccount: 'Doładuj konto',
    noAnalysesMessage: 'Nie masz pozostałych analiz.',
    refillLink: 'Dotknij tutaj, aby doładować konto.',
    disclaimer: 'Niniejsza analiza ma wyłącznie charakter informacyjny i nie stanowi porady prawnej. W przypadku kwestii prawnych skonsultuj się z wykwalifikowanym prawnikiem.',

    photoHelperText: 'Zdjęcia zostaną automatycznie dodane do Twojej listy dokumentów',
    showPreviousAnalyses: 'Pokaż poprzednie analizy',
    hidePreviousAnalyses: 'Ukryj poprzednie analizy',
  },
  fr: {
    language: 'Langue',
    heroTitle: 'Votre assistant de documents IA',
    heroSubtitle: 'Téléchargez des documents ou prenez des photos pour obtenir des réponses et des informations instantanées grâce à l\'IA.',
    upload: 'Télécharger un document',
    uploadPDF: 'Télécharger un PDF',
    uploadImage: 'Télécharger une image',
    analyze: 'Commencer l\'analyse',
    documentPool: 'Pool de documents',
    results: 'Résultats de l\'analyse',
    followup: 'Poser une question de suivi',
    followupPlaceholder: 'Posez une question de suivi...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Analyse de documents IA',
    email: 'E-mail',
    password: 'Mot de passe',
    login: 'Connexion',
    logout: 'Déconnexion',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    cancel: 'Annuler l\'abonnement',
    legal: 'Avertissement légal',
    analyzing: 'Analyse...',
    selectType: 'Sélectionner le type',
    selectLanguage: 'Sélectionner la langue',
    errorEmailPassword: 'Veuillez saisir l\'e-mail et le mot de passe',
    errorUpload: 'Veuillez télécharger au moins un document',
    errorPickDoc: 'Échec de la sélection du document',
    errorPickImg: 'Échec de la sélection de l\'image',
    errorFollowup: 'Veuillez saisir une question',
    ask: 'Demander',
    'button.upload': 'Télécharger un document',
    'button.takePhoto': 'Prendre une photo',
    'messages.placeholder': 'Votre analyse apparaîtra ici.',
    'messages.noMessages': 'Aucun message pour le moment.',
    analysisLimitWarning: 'Vous avez utilisé toutes vos analyses disponibles. Veuillez mettre à niveau votre plan pour continuer.',
    noAnalysesLeft: 'Aucune analyse restante',
    topUpAccount: 'Recharger votre compte',
    noAnalysesMessage: 'Vous n\'avez plus d\'analyses.',
    refillLink: 'Appuyez ici pour recharger votre compte.',
    disclaimer: 'Cette analyse est fournie à titre informatif uniquement et ne constitue pas un avis juridique. Pour toute question juridique, veuillez consulter un avocat qualifié.',
    photoHelperText: 'Les photos seront automatiquement ajoutées à votre liste de documents',
    showPreviousAnalyses: 'Afficher les analyses précédentes',
    hidePreviousAnalyses: 'Masquer les analyses précédentes',
  },
  pt: {
    language: 'Idioma',
    heroTitle: 'Seu assistente de documentos com IA',
    heroSubtitle: 'Envie documentos ou tire fotos para obter respostas e insights instantâneos com IA.',
    upload: 'Enviar documento',
    uploadPDF: 'Enviar PDF',
    uploadImage: 'Enviar imagem',
    analyze: 'Iniciar análise',
    documentPool: 'Pool de documentos',
    results: 'Resultados da análise',
    followup: 'Perguntas de acompanhamento',
    followupPlaceholder: 'Faça uma pergunta de acompanhamento...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Análise de documentos IA',
    email: 'E-mail',
    password: 'Senha',
    login: 'Entrar',
    logout: 'Sair',
    privacy: 'Política de privacidade',
    terms: 'Termos de serviço',
    cancel: 'Cancelar assinatura',
    legal: 'Aviso legal',
    analyzing: 'Analisando...',
    selectType: 'Selecionar tipo',
    selectLanguage: 'Selecionar idioma',
    errorEmailPassword: 'Por favor, insira e-mail e senha',
    errorUpload: 'Por favor, envie pelo menos um documento',
    errorPickDoc: 'Falha ao selecionar documento',
    errorPickImg: 'Falha ao selecionar imagem',
    errorFollowup: 'Por favor, insira uma pergunta',
    ask: 'Perguntar',
    'button.upload': 'Enviar documento',
    'button.takePhoto': 'Tirar uma foto',
    'messages.placeholder': 'Sua análise aparecerá aqui.',
    'messages.noMessages': 'Nenhuma mensagem ainda.',
    analysisLimitWarning: 'Você utilizou todas as análises disponíveis. Por favor, atualize seu plano para continuar.',
    noAnalysesLeft: 'Nenhuma análise restante',
    topUpAccount: 'Recarregar sua conta',
    noAnalysesMessage: 'Você não tem análises restantes.',
    refillLink: 'Toque aqui para recarregar sua conta.',
    disclaimer: 'Esta análise tem apenas fins informativos e não constitui aconselhamento jurídico. Para questões legais, consulte um advogado qualificado.',
    photoHelperText: 'Fotos serão automaticamente adicionadas à sua lista de documentos',
    showPreviousAnalyses: 'Mostrar análises anteriores',
    hidePreviousAnalyses: 'Ocultar análises anteriores',
  },
  it: {
    language: 'Lingua',
    heroTitle: 'Il tuo assistente documentale AI',
    heroSubtitle: 'Carica documenti o scatta foto per ottenere risposte e approfondimenti immediati con l\'IA.',
    upload: 'Carica documento',
    uploadPDF: 'Carica PDF',
    uploadImage: 'Carica immagine',
    analyze: 'Avvia analisi',
    documentPool: 'Pool di documenti',
    results: 'Risultati dell\'analisi',
    followup: 'Domande di follow-up',
    followupPlaceholder: 'Fai una domanda di follow-up...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'Analisi documentale IA',
    email: 'E-mail',
    password: 'Password',
    login: 'Accedi',
    logout: 'Disconnetti',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di servizio',
    cancel: 'Annulla abbonamento',
    legal: 'Avvertenza legale',
    analyzing: 'Analisi in corso...',
    selectType: 'Seleziona tipo',
    selectLanguage: 'Seleziona lingua',
    errorEmailPassword: 'Inserisci e-mail e password',
    errorUpload: 'Carica almeno un documento',
    errorPickDoc: 'Impossibile selezionare il documento',
    errorPickImg: 'Impossibile selezionare l\'immagine',
    errorFollowup: 'Inserisci una domanda',
    ask: 'Chiedi',
    'button.upload': 'Carica documento',
    'button.takePhoto': 'Scatta una foto',
    'messages.placeholder': 'La tua analisi apparirà qui.',
    'messages.noMessages': 'Nessun messaggio ancora.',
    analysisLimitWarning: 'Hai utilizzato tutte le analisi disponibili. Per favore, aggiorna il tuo piano per continuare.',
    noAnalysesLeft: 'Nessuna analisi rimasta',
    topUpAccount: 'Ricarica il tuo account',
    noAnalysesMessage: 'Non hai più analisi rimaste.',
    refillLink: 'Tocca qui per ricaricare il tuo account.',
    disclaimer: 'Questa analisi ha solo scopo informativo e non costituisce consulenza legale. Per questioni legali, rivolgiti a un avvocato qualificato.',
    photoHelperText: 'Le foto verranno automaticamente aggiunte alla tua lista di documenti',
    showPreviousAnalyses: 'Mostra analisi precedenti',
    hidePreviousAnalyses: 'Nascondi analisi precedenti',
  },
  cs: {
    language: 'Jazyk',
    heroTitle: 'Váš AI asistent pro dokumenty',
    heroSubtitle: 'Nahrajte dokumenty nebo pořiďte fotografie pro okamžité AI odpovědi a poznatky.',
    upload: 'Nahrát dokument',
    uploadPDF: 'Nahrát PDF',
    uploadImage: 'Nahrát obrázek',
    analyze: 'Spustit analýzu',
    documentPool: 'Pool dokumentů',
    results: 'Výsledky analýzy',
    followup: 'Položit doplňující otázky',
    followupPlaceholder: 'Položte doplňující otázku...',
    loginTitle: 'DocLexa',
    loginSubtitle: 'AI analýza dokumentů',
    email: 'E-mail',
    password: 'Heslo',
    login: 'Přihlásit se',
    logout: 'Odhlásit se',
    privacy: 'Zásady ochrany osobních údajů',
    terms: 'Podmínky služby',
    cancel: 'Zrušit předplatné',
    legal: 'Právní upozornění',
    analyzing: 'Analyzuji...',
    selectType: 'Vybrat typ',
    selectLanguage: 'Vybrat jazyk',
    errorEmailPassword: 'Prosím zadejte e-mail a heslo',
    errorUpload: 'Prosím nahrajte alespoň jeden dokument',
    errorPickDoc: 'Nepodařilo se vybrat dokument',
    errorPickImg: 'Nepodařilo se vybrat obrázek',
    errorFollowup: 'Prosím zadejte otázku',
    ask: 'Položit',
    'button.upload': 'Nahrát dokument',
    'button.takePhoto': 'Pořídit fotografii',
    'messages.placeholder': 'Vaše analýza se zde zobrazí.',
    'messages.noMessages': 'Zatím žádné zprávy.',
    analysisLimitWarning: 'Vyčerpali jste všechny dostupné analýzy. Prosím upgradujte svůj plán pro pokračování.',
    noAnalysesLeft: 'Žádné analýzy nezbývají',
    topUpAccount: 'Dobít účet',
    noAnalysesMessage: 'Nemáte žádné zbývající analýzy.',
    refillLink: 'Klepněte zde pro dobití účtu.',
    disclaimer: 'Tato analýza slouží pouze pro informativní účely a nepředstavuje právní poradenství. V právních záležitostech se prosím obraťte na kvalifikovaného právníka.',
    photoHelperText: 'Fotky se automaticky přidají do vaší seznamu dokumentů',
    showPreviousAnalyses: 'Zobrazit předchozí analýzy',
    hidePreviousAnalyses: 'Skrýt předchozí analýzy',
  },
};

const languageCodes = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'pl', label: 'Polish' },
  { code: 'fr', label: 'French' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'cs', label: 'Czech' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]); // {role: 'user'|'assistant', content: string}
  const [userPlan, setUserPlan] = useState<string>('');
  const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
  const [usedAnalyses, setUsedAnalyses] = useState<number>(0);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [previousAnalyses, setPreviousAnalyses] = useState<AnalysisResult[]>([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);
  const [showPreviousAnalyses, setShowPreviousAnalyses] = useState(false); // Toggle previous analyses view
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  // Check session on app startup
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
      }
      
      if (session) {
        setIsLoggedIn(true);
        setEmail(session.user.email || '');
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
          setEmail(session.user.email || '');
          // Fetch user plan after login
          fetchUserPlan(session.user.id);
          // Fetch previous analyses after login
          fetchPreviousAnalyses();
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setEmail('');
          setPassword('');
          setDocuments([]);
          setResults([]);
          setConversation([]);
          // Clear plan data
          setUserPlan('');
          setTotalAnalyses(0);
          setUsedAnalyses(0);
          // Clear previous analyses
          setPreviousAnalyses([]);
          setShowPreviousAnalyses(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user plan from Supabase
  const fetchUserPlan = async (userId: string) => {
    setIsLoadingPlan(true);
    try {
      console.log('Fetching user plan for userId:', userId);
      
      // TEMPORARILY DISABLED: Database columns don't exist yet
      // TODO: Re-enable when profiles table has the correct columns
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('total_analyses, used_analyses')
      //   .eq('id', userId)
      //   .single();

      // Set default values for now
      console.log('Setting default plan values (database columns not ready)');
      setUserPlan('Free');
      setTotalAnalyses(5);
      setUsedAnalyses(0);
      
    } catch (error) {
      console.error('Exception in fetchUserPlan:', error);
      // Set default values on error
      setUserPlan('Free');
      setTotalAnalyses(5);
      setUsedAnalyses(0);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Fetch previous analyses from Supabase
  const fetchPreviousAnalyses = async () => {
    setIsLoadingAnalyses(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Fetching previous analyses for user:', user.id);
      
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching previous analyses:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (data) {
        console.log('Successfully fetched', data.length, 'previous analyses');
        const formattedAnalyses = data.map(item => ({
          id: item.id,
          question: item.document_type || 'Document Analysis',
          answer: item.result_text,
          created_at: item.created_at,
          document_type: item.document_type,
          language: item.language,
          tokens_used: item.tokens_used,
        }));
        setPreviousAnalyses(formattedAnalyses);
      } else {
        console.log('No previous analyses found');
        setPreviousAnalyses([]);
      }
    } catch (error) {
      console.error('Exception in fetchPreviousAnalyses:', error);
    } finally {
      setIsLoadingAnalyses(false);
    }
  };

  // Save analysis to Supabase
  const saveAnalysisToSupabase = async (analysis: {
    documentType: string;
    language: string;
    resultText: string;
    imageUrl?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Saving analysis to Supabase for user:', user.id);
      
      const { error } = await supabase
        .from('document_analyses')
        .insert({
          user_id: user.id,
          document_type: analysis.documentType,
          language: analysis.language,
          result_text: analysis.resultText,
          source_image: analysis.imageUrl || null,
        });

      if (error) {
        console.error('Error saving analysis to Supabase:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return false;
      } else {
        console.log('Analysis saved to Supabase successfully');
        // Refresh previous analyses
        fetchPreviousAnalyses();
        return true;
      }
    } catch (error) {
      console.error('Exception in saveAnalysisToSupabase:', error);
      return false;
    }
  };

  // Save and start new analysis
  const handleSaveAndStartNew = async () => {
    if (results.length === 0) {
      Alert.alert('Error', 'No analysis to save');
      return;
    }

    const latestResult = results[0]; // Get the most recent result
    const sourceImage = documents.find(doc => doc.type === 'image')?.uri;

    try {
      const success = await saveAnalysisToSupabase({
        documentType: 'Auto-detected',
        language: selectedLanguage,
        resultText: latestResult.answer,
        imageUrl: sourceImage,
      });

      if (success) {
        // Clear current analysis and documents
        setResults([]);
        setDocuments([]);
        setConversation([]);
        
        // Show success toast
        setToastMessage('✅ Analysis saved. You can now upload a new document.');
        setShowToast(true);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        Alert.alert('Error', 'Failed to save analysis. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleSaveAndStartNew:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving.');
    }
  };

  // Translation helper
  const t = (key: string) => {
    return translations[selectedLanguage as keyof typeof translations][key] || translations['en'][key] || key;
  };

  // Function to open analysis details modal
  const openAnalysisModal = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
    setShowAnalysisModal(true);
  };

  // Function to close analysis modal
  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setSelectedAnalysis(null);
  };

  // Function to send analysis via email
  const sendAnalysisViaEmail = async () => {
    if (!selectedAnalysis) return;

    try {
      const subject = encodeURIComponent('DocLexa Analysis Results');
      const body = encodeURIComponent(`Analysis Results\n\nQuestion: ${selectedAnalysis.question}\n\nAnswer: ${selectedAnalysis.answer}\n\nDocument Type: ${selectedAnalysis.document_type || 'Auto-detected'}\nLanguage: ${selectedAnalysis.language || 'Unknown'}\n\nGenerated by DocLexa`);
      
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Error opening email client:', error);
      Alert.alert('Error', 'Could not open email client');
    }
  };

  // Function to print analysis
  const printAnalysis = async () => {
    if (!selectedAnalysis) return;

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DocLexa Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #333; }
            .content { margin-top: 10px; line-height: 1.6; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DocLexa Analysis Results</h1>
          </div>
          <div class="section">
            <div class="label">Question:</div>
            <div class="content">${selectedAnalysis.question}</div>
          </div>
          <div class="section">
            <div class="label">Answer:</div>
            <div class="content">${selectedAnalysis.answer}</div>
          </div>
          <div class="section">
            <div class="label">Document Type:</div>
            <div class="content">${selectedAnalysis.document_type || 'Auto-detected'}</div>
          </div>
          <div class="section">
            <div class="label">Language:</div>
            <div class="content">${selectedAnalysis.language || 'Unknown'}</div>
          </div>
          <div class="footer">
            Generated by DocLexa on ${new Date().toLocaleDateString()}
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Print Analysis Results'
        });
      } else {
        Alert.alert('Sharing not available', 'Print functionality is not available on this device');
      }
    } catch (error) {
      console.error('Error printing analysis:', error);
      Alert.alert('Error', 'Could not print analysis');
    }
  };



  // Function to open pricing URL
  const openPricingUrl = async () => {
    try {
      await Linking.openURL('https://doclexa.com/pricing');
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Could not open the pricing page');
    }
  };

  // Flag emoji and language code mapping
  const languages = [
    'English',
    'Spanish',
    'German',
    'Polish',
    'French',
    'Portuguese',
    'Italian',
  ];


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', t('errorEmailPassword'));
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Error', error.message);
      }
    } catch (error) {
      Alert.alert('Login Error', 'An unexpected error occurred');
    }
  };

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpPassword) {
      Alert.alert('Error', t('errorEmailPassword'));
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
      } else if (data.user) {
        // Profile will be created automatically by the Supabase trigger
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Clear sign-up form
              setSignUpEmail('');
              setSignUpPassword('');
              setIsCreatingAccount(false);
            }
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Sign Up Error', 'An unexpected error occurred');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        Alert.alert('Logout Error', error.message);
      }
    } catch (error) {
      Alert.alert('Logout Error', 'An unexpected error occurred');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: result.assets[0].name,
          type: 'pdf',
        };
        setDocuments([...documents, newDoc]);
      }
    } catch (error) {
      Alert.alert('Error', t('errorPickDoc'));
    }
  };

  const pickImage = async () => {
    try {
      console.log('Opening image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable cropping to avoid confusion
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Image picker asset:', asset);
        
        const newDoc: Document = {
          id: Date.now().toString(),
          name: `Image_${Date.now()}.jpg`,
          type: 'image',
          uri: asset.uri,
        };
        
        console.log('Adding new document from image picker:', newDoc);
        setDocuments(prev => {
          const updated = [...prev, newDoc];
          console.log('Updated documents from image picker:', updated);
          return updated;
        });
      } else {
        console.log('Image picker was canceled or no assets returned');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', t('errorPickImg'));
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const startAnalysis = async () => {
    if (documents.length === 0) {
      Alert.alert('Error', t('errorUpload'));
      return;
    }

    // TEMP: bypass limit for testing
    // Check if user has remaining analyses
    // if (usedAnalyses >= totalAnalyses) {
    //   Alert.alert('Analysis Limit Reached', t('analysisLimitWarning'));
    //   return;
    // }

    setIsAnalyzing(true);
    
    // Add user message for uploaded document(s)
    setConversation(prev => [
      ...prev,
      { role: 'user', content: documents.length === 1 ? documents[0].name : t('button.upload') },
    ]);

    // Simulate AI analysis with automatic document type inference
    setTimeout(() => {
      // AI automatically infers document type and provides appropriate analysis
      const analysisPrompt = `Intelligent analysis of ${documents.length} document(s)`;
      const analysisResponse = `AI Analysis completed for ${documents.length} document(s) in ${selectedLanguage.toUpperCase()}. 

The AI has automatically identified the document type and provided a tailored explanation:

📄 **Document Type Detected**: The AI has analyzed the content and determined the most appropriate classification for your document.

🔍 **Content Analysis**: The AI has examined the document structure, language patterns, and key elements to provide relevant insights.

📝 **Simplified Explanation**: Complex information has been broken down into clear, understandable terms that are easy to follow.

💡 **Key Points**: Important details and actionable information have been highlighted for your convenience.

This intelligent analysis adapts to any type of document - from contracts and legal letters to medical reports, business offers, or any other document format.`;
      
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        question: analysisPrompt,
        answer: analysisResponse,
      };
      setResults([newResult, ...results]);
      setIsAnalyzing(false);
      
      // Increment used analyses count
      setUsedAnalyses(prev => prev + 1);
      
      // Add assistant message
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: newResult.answer },
      ]);

      // Save to Supabase with auto-detected document type
      const sourceImage = documents.find(doc => doc.type === 'image')?.uri;
      saveAnalysisToSupabase({
        documentType: 'Auto-detected', // AI will determine the actual type
        language: selectedLanguage,
        resultText: analysisResponse,
        imageUrl: sourceImage,
      });
    }, 2000);
  };

  const askFollowUp = () => {
    if (!followUpQuestion.trim()) {
      Alert.alert('Error', t('errorFollowup'));
      return;
    }

    // TEMP: bypass limit for testing
    // Check if user has remaining analyses
    // if (usedAnalyses >= totalAnalyses) {
    //   Alert.alert('Analysis Limit Reached', t('analysisLimitWarning'));
    //   return;
    // }

    // Add user message
    setConversation(prev => [
      ...prev,
      { role: 'user', content: followUpQuestion },
    ]);

    const newResult: AnalysisResult = {
      id: Date.now().toString(),
      question: followUpQuestion,
      answer: `Response to: "${followUpQuestion}" - This is a simulated AI response. In a real app, this would contain the actual AI reply to your follow-up question.`,
    };
    setResults([newResult, ...results]);
    setFollowUpQuestion('');
    
    // Increment used analyses count
    setUsedAnalyses(prev => prev + 1);
    
    // Add assistant message
    setConversation(prev => [
      ...prev,
      { role: 'assistant', content: newResult.answer },
    ]);

    // Save to Supabase
    saveAnalysisToSupabase({
      documentType: 'Follow-up Question',
      language: selectedLanguage,
      resultText: newResult.answer,
    });
  };

  const takePhoto = async () => {
    try {
      console.log('Opening camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable cropping to avoid confusion
        aspect: [4, 3],
        quality: 1,
      });
      
      console.log('Camera result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Camera asset:', asset);
        
        const newDoc: Document = {
          id: Date.now().toString(),
          name: `Photo_${Date.now()}.jpg`,
          type: 'image',
          uri: asset.uri,
        };
        
        console.log('Adding new document:', newDoc);
        setDocuments(prev => {
          const updated = [...prev, newDoc];
          console.log('Updated documents:', updated);
          return updated;
        });
      } else {
        console.log('Camera was canceled or no assets returned');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', t('errorPickImg'));
    }
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
              <View style={styles.loginContainer}>
                <Text style={styles.title}>{t('loginTitle')}</Text>
                <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
                
                {!isCreatingAccount ? (
                  // Login Form
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder={t('email')}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    
                    <TextInput
                      style={styles.input}
                      placeholder={t('password')}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                      <Text style={styles.buttonText}>{t('login')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.linkButton} 
                      onPress={() => setIsCreatingAccount(true)}
                    >
                      <Text style={styles.linkText}>Don't have an account? Create one</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // Sign Up Form
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder={t('email')}
                      value={signUpEmail}
                      onChangeText={setSignUpEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    
                    <TextInput
                      style={styles.input}
                      placeholder={t('password')}
                      value={signUpPassword}
                      onChangeText={setSignUpPassword}
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
                    />
                    
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                      <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.linkButton} 
                      onPress={() => setIsCreatingAccount(false)}
                    >
                      <Text style={styles.linkText}>Back to Login</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
                 <Navbar
           selectedLanguage={selectedLanguage}
           languageCodes={languageCodes}
           showLanguageModal={showLanguageModal}
           setShowLanguageModal={setShowLanguageModal}
           setSelectedLanguage={setSelectedLanguage}
           handleLogout={handleLogout}
           t={t}
                  />

      <ScrollView style={styles.content}>
        {/* Plan Information */}
        {isLoggedIn && (
          <View style={styles.planSection}>
            {isLoadingPlan ? (
              <View style={styles.planLoading}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.planLoadingText}>Loading plan...</Text>
              </View>
            ) : (
              <View style={styles.planInfo}>
                <Text style={styles.planDetails}>
                  Remaining Analyses: {Math.max(0, totalAnalyses - usedAnalyses)}
                </Text>
                {/* TEMP: bypass limit for testing */}
                {/* {totalAnalyses - usedAnalyses <= 0 && (
                  <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>{t('noAnalysesMessage')}</Text>
                    <TouchableOpacity onPress={openPricingUrl}>
                      <Text style={styles.refillLink}>{t('refillLink')}</Text>
                    </TouchableOpacity>
                  </View>
                )} */}
              </View>
            )}
          </View>
        )}

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeHeadline}>{t('heroTitle')}</Text>
          <Text style={styles.welcomeSubtext}>
            {t('heroSubtitle')}
          </Text>
        </View>



        {/* Document Upload Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('documentPool')}</Text>
          <View style={styles.uploadButtons}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Text style={styles.uploadButtonIcon}>📄</Text>
              <Text style={styles.uploadButtonText}>{t('button.upload')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadButton, styles.uploadButtonCamera]} onPress={takePhoto}>
              <Text style={styles.uploadButtonIcon}>📷</Text>
              <Text style={styles.uploadButtonText}>{t('button.takePhoto')}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Helper text for photo taking */}
          <Text style={styles.helperText}>
            {t('photoHelperText')}
          </Text>

          {/* Document List */}
          {documents.map(doc => (
            <View key={doc.id} style={styles.documentItem}>
              {doc.type === 'image' && doc.uri ? (
                <Image source={{ uri: doc.uri }} style={styles.documentImage} />
              ) : (
                <Text style={styles.documentName}>{doc.name}</Text>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeDocument(doc.id)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, isAnalyzing && styles.buttonDisabled]}
            onPress={startAnalysis}
            disabled={isAnalyzing}
          >
            <Text style={styles.buttonText}>
              {isAnalyzing ? t('analyzing') : t('analyze')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('results')}</Text>
          {results.length > 0 ? (
            <>
              {results.map(result => (
                <View key={result.id} style={styles.resultItem}>
                  <Text style={styles.questionText}>{result.question}</Text>
                  <Text style={styles.answerText}>{result.answer}</Text>
                </View>
              ))}
              <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
              
              {/* Save & Start New Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAndStartNew}
              >
                <Text style={styles.saveButtonText}>Save & Start New</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.placeholderText}>{t('messages.placeholder')}</Text>
          )}
        </View>

        {/* Previous Analyses */}
        {previousAnalyses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Previous Analyses</Text>
            {isLoadingAnalyses ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading previous analyses...</Text>
              </View>
            ) : (
              <>
                {/* Show latest analysis by default */}
                {previousAnalyses.length > 0 && (
                  <TouchableOpacity 
                    style={styles.resultItem}
                    onPress={() => openAnalysisModal(previousAnalyses[0])}
                  >
                    <Text style={styles.questionText}>{previousAnalyses[0].question}</Text>
                    <Text style={styles.answerText}>{previousAnalyses[0].answer}</Text>
                    {previousAnalyses[0].created_at && (
                      <Text style={styles.resultDate}>
                        {new Date(previousAnalyses[0].created_at).toLocaleDateString()}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {/* Toggle button for showing/hiding previous analyses */}
                {previousAnalyses.length > 1 && (
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowPreviousAnalyses(!showPreviousAnalyses)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {showPreviousAnalyses ? t('hidePreviousAnalyses') : t('showPreviousAnalyses')}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {/* Show remaining analyses when expanded */}
                {showPreviousAnalyses && previousAnalyses.length > 1 && (
                  <View style={styles.expandedAnalyses}>
                    {previousAnalyses.slice(1).map(result => (
                      <TouchableOpacity 
                        key={result.id} 
                        style={styles.resultItem}
                        onPress={() => openAnalysisModal(result)}
                      >
                        <Text style={styles.questionText}>{result.question}</Text>
                        <Text style={styles.answerText}>{result.answer}</Text>
                        {result.created_at && (
                          <Text style={styles.resultDate}>
                            {new Date(result.created_at).toLocaleDateString()}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Conversation Thread */}
        <ConversationThread messages={conversation} t={t} />

        {/* Follow-up Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('followup')}</Text>
          <View style={styles.followUpContainer}>
            <TextInput
              style={styles.followUpInput}
              placeholder={t('followupPlaceholder')}
              value={followUpQuestion}
              onChangeText={setFollowUpQuestion}
              multiline
            />
            <TouchableOpacity style={styles.followUpButton} onPress={askFollowUp}>
              <Text style={styles.followUpButtonText}>{t('ask')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Analysis Details Modal */}
      <Modal
        visible={showAnalysisModal}
        transparent
        animationType="slide"
        onRequestClose={closeAnalysisModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeAnalysisModal}>
          <View style={styles.analysisModalContent}>
            {/* Modal Content */}
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {selectedAnalysis && (
                <>
                  {/* Analysis Details */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Analysis Details</Text>
                    
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Question:</Text>
                      <Text style={styles.modalDetailText}>{selectedAnalysis.question}</Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Answer:</Text>
                      <Text style={styles.modalDetailText}>{selectedAnalysis.answer}</Text>
                    </View>

                    {selectedAnalysis.document_type && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Document Type:</Text>
                        <Text style={styles.modalDetailText}>{selectedAnalysis.document_type}</Text>
                      </View>
                    )}

                    {selectedAnalysis.language && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Language:</Text>
                        <Text style={styles.modalDetailText}>{selectedAnalysis.language}</Text>
                      </View>
                    )}

                    {selectedAnalysis.created_at && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Date:</Text>
                        <Text style={styles.modalDetailText}>
                          {new Date(selectedAnalysis.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>

            {/* Action Buttons - Fixed at bottom */}
            {selectedAnalysis && (
              <View style={styles.modalActionButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.emailButton]}
                  onPress={sendAnalysisViaEmail}
                >
                  <Text style={styles.modalActionButtonText}>📧 Send via Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.printButton]}
                  onPress={printAnalysis}
                >
                  <Text style={styles.modalActionButtonText}>🖨️ Print</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>DocLexa</Text>
        <Text style={styles.footerDisclaimer}>{t('disclaimer')}</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>{t('privacy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>{t('terms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>{t('legal')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  navbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 6,
  },
  logoImage: {
    width: 90,
    height: 90,
    maxWidth: '100%',
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  languageDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  languageDropdownIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  languageDropdownText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    flexShrink: 1,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  languageOptionSelected: {
    backgroundColor: '#007AFF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  languageOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeSection: {
    marginBottom: 25,
    paddingVertical: 20,
  },
  welcomeHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  welcomeSubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
    flexDirection: 'row', // Added for icon alignment
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5, // Added for icon spacing
  },
  uploadButtonIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  uploadButtonCamera: {
    backgroundColor: '#007AFF',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  documentName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  documentImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resultDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  followUpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  followUpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    minHeight: 40,
  },
  followUpButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followUpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 24, // Added extra bottom padding for system gesture bar
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
    lineHeight: 14,
    paddingHorizontal: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  footerLink: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  footerLinkText: {
    fontSize: 12,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  conversationContainer: {
    flex: 1,
    minHeight: 180,
    maxHeight: 260,
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
  },
  conversationScroll: {
    flex: 1,
  },
  conversationContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  conversationPlaceholder: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  messageText: {
    fontSize: 15,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f5f2',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  planSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  planInfo: {
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  planDetails: {
    fontSize: 14,
    color: '#666',
  },
  warningContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 5,
  },
  topUpLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  refillLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  expandedAnalyses: {
    marginTop: 10,
  },
  analysisModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '95%',
    maxWidth: 400,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalScrollView: {
    maxHeight: '70%',
  },
  modalSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalDetailRow: {
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  modalDetailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalActionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  emailButton: {
    backgroundColor: '#007AFF',
  },
  printButton: {
    backgroundColor: '#4CAF50',
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalCloseButtonText: {
    fontSize: 24,
    color: '#666',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    paddingVertical: 20,
  },
});