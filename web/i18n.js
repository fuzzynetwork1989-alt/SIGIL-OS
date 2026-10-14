// Internationalization (i18n) support for SIGIL OS

const translations = {
    en: {
        welcome: 'Welcome to SIGIL OS',
        subtitle: 'The Post-AI Operating System',
        getStarted: 'Get Started',
        chat: 'Chat',
        avatar: 'Avatar',
        settings: 'Settings',
        dreamWeaving: 'Dream Weaving',
        sigilExplorer: 'Sigil Explorer',
        sendMessage: 'Send',
        typeMessage: 'Type a message...',
        thinking: 'Thinking...',
        voiceInput: 'Voice Input',
        analytics: 'Analytics',
        logout: 'Sign Out',
        dreamCycles: 'Dream Cycles',
        insights: 'Insights',
        evolutionScore: 'Evolution Score',
        rollbackPoints: 'Rollback Points',
    },
    es: {
        welcome: 'Bienvenido a SIGIL OS',
        subtitle: 'El Sistema Operativo Post-IA',
        getStarted: 'Comenzar',
        chat: 'Chat',
        avatar: 'Avatar',
        settings: 'Configuración',
        dreamWeaving: 'Tejido de Sueños',
        sigilExplorer: 'Explorador de Sigilos',
        sendMessage: 'Enviar',
        typeMessage: 'Escribe un mensaje...',
        thinking: 'Pensando...',
        voiceInput: 'Entrada de Voz',
        analytics: 'Analíticas',
        logout: 'Cerrar Sesión',
        dreamCycles: 'Ciclos de Sueño',
        insights: 'Ideas',
        evolutionScore: 'Puntuación de Evolución',
        rollbackPoints: 'Puntos de Reversión',
    },
    fr: {
        welcome: 'Bienvenue dans SIGIL OS',
        subtitle: 'Le Système d\'Exploitation Post-IA',
        getStarted: 'Commencer',
        chat: 'Chat',
        avatar: 'Avatar',
        settings: 'Paramètres',
        dreamWeaving: 'Tissage de Rêve',
        sigilExplorer: 'Explorateur de Sigil',
        sendMessage: 'Envoyer',
        typeMessage: 'Tapez un message...',
        thinking: 'Réflexion...',
        voiceInput: 'Entrée Vocale',
        analytics: 'Analytiques',
        logout: 'Déconnexion',
        dreamCycles: 'Cycles de Rêve',
        insights: 'Idées',
        evolutionScore: 'Score d\'Évolution',
        rollbackPoints: 'Points de Retour',
    },
    de: {
        welcome: 'Willkommen bei SIGIL OS',
        subtitle: 'Das Post-KI-Betriebssystem',
        getStarted: 'Loslegen',
        chat: 'Chat',
        avatar: 'Avatar',
        settings: 'Einstellungen',
        dreamWeaving: 'Traumweben',
        sigilExplorer: 'Sigil-Explorer',
        sendMessage: 'Senden',
        typeMessage: 'Nachricht eingeben...',
        thinking: 'Denken...',
        voiceInput: 'Spracheingabe',
        analytics: 'Analysen',
        logout: 'Abmelden',
        dreamCycles: 'Traumzyklen',
        insights: 'Erkenntnisse',
        evolutionScore: 'Evolutionspunktzahl',
        rollbackPoints: 'Rollback-Punkte',
    },
    ja: {
        welcome: 'SIGIL OSへようこそ',
        subtitle: 'ポストAIオペレーティングシステム',
        getStarted: '開始',
        chat: 'チャット',
        avatar: 'アバター',
        settings: '設定',
        dreamWeaving: 'ドリーム・ウィービング',
        sigilExplorer: 'シギル・エクスプローラー',
        sendMessage: '送信',
        typeMessage: 'メッセージを入力...',
        thinking: '考え中...',
        voiceInput: '音声入力',
        analytics: '分析',
        logout: 'ログアウト',
        dreamCycles: 'ドリームサイクル',
        insights: '洞察',
        evolutionScore: '進化スコア',
        rollbackPoints: 'ロールバックポイント',
    },
    zh: {
        welcome: '欢迎使用 SIGIL OS',
        subtitle: '后人工智能操作系统',
        getStarted: '开始',
        chat: '聊天',
        avatar: '头像',
        settings: '设置',
        dreamWeaving: '梦境编织',
        sigilExplorer: '符文浏览器',
        sendMessage: '发送',
        typeMessage: '输入消息...',
        thinking: '思考中...',
        voiceInput: '语音输入',
        analytics: '分析',
        logout: '退出登录',
        dreamCycles: '梦境周期',
        insights: '洞察',
        evolutionScore: '进化分数',
        rollbackPoints: '回滚点',
    },
};

let currentLanguage = 'en';

// Detect user's language
function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    if (translations[langCode]) {
        return langCode;
    }
    
    return 'en'; // Default to English
}

// Get translation for a key
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Set language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('sigil-os-language', lang);
        updatePageTranslations();
    }
}

// Update all translatable elements on the page
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
}

// Initialize i18n
function initI18n() {
    const savedLang = localStorage.getItem('sigil-os-language');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else {
        currentLanguage = detectLanguage();
    }
    
    updatePageTranslations();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, setLanguage, initI18n, detectLanguage };
}
