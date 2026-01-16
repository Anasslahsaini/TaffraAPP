
import { Translations, AppData } from './types';

export const TEXT: Translations = {
  app_name: { en: "Life Booster", fr: "Life Booster" },
  app_subtitle: { 
    en: "Private Growth System", 
    fr: "Système de Croissance Privé"
  },
  
  // Onboarding
  onboarding_1_title: { 
    en: "Private Space", 
    fr: "Espace Privé"
  },
  onboarding_1_desc: { 
    en: "No judgment. Just you and your progress.", 
    fr: "Pas de jugement. Juste vous et vos progrès."
  },
  onboarding_2_title: { 
    en: "Radical Truth", 
    fr: "Vérité Radicale"
  },
  onboarding_2_desc: { 
    en: "Log what you really do. Learn from reality.", 
    fr: "Notez ce que vous faites vraiment. Apprenez de la réalité."
  },
  onboarding_3_title: { 
    en: "100% Secure", 
    fr: "100% Sécurisé"
  },
  onboarding_3_desc: { 
    en: "Data stays on your phone.", 
    fr: "Les données restent sur votre téléphone."
  },
  btn_continue: { en: "Next", fr: "Suivant" },
  btn_get_started: { en: "Initialize System", fr: "Initialiser" },
  btn_skip: { en: "Skip", fr: "Passer" },
  btn_save: { en: "Save", fr: "Sauver" },

  // Dashboard Common
  hi: { en: "Hi", fr: "Salut" },
  dashboard_subtitle: { en: "Here’s where you stand today", fr: "Voici votre situation aujourd'hui" },
  daily_goal: { en: "Daily Mission", fr: "Mission du Jour" },
  your_progress: { en: "Today’s Execution", fr: "Exécution du Jour" },
  total_spent: { en: "Outflow", fr: "Sorties" },
  mistakes_logged: { en: "Lessons", fr: "Leçons" },
  
  // Dashboard Sections
  btn_start_day: { en: "Manage Tasks", fr: "Gérer Tâches" },
  quick_overview: { en: "Status Report", fr: "Rapport d'État" },
  pending: { en: "left", fr: "restants" },
  logged: { en: "logged", fr: "notées" },
  
  // Quick Menu
  quick_menu_title: { en: "Quick Entry", fr: "Entrée Rapide" },
  quick_task: { en: "Task", fr: "Tâche" },
  quick_wallet: { en: "Transaction", fr: "Transaction" },
  quick_challenge: { en: "Goal", fr: "Objectif" },
  quick_mistake: { en: "Lesson", fr: "Leçon" },

  // Sections Titles
  section_tasks: { en: "Tasks", fr: "Tâches" },
  section_challenges: { en: "Long-Term Goals", fr: "Objectifs à Long Terme" },
  section_challenges_sub: { en: "The big goals you don’t want to forget.", fr: "Les grands objectifs à ne pas oublier." },
  section_money: { en: "Cash Flow", fr: "Trésorerie" },
  section_wallet: { en: "Wallet", fr: "Portefeuille" },
  section_mistakes: { en: "What I Learned Today", fr: "Ce que j'ai appris" },
  section_mistakes_sub: { en: "What went wrong — and what you learned.", fr: "Ce qui n'a pas été — et ce que vous avez appris." },
  section_loans: { en: "Debts & Loans", fr: "Dettes & Prêts" },
  section_trash: { en: "Archive", fr: "Archives" },

  // Time Manager
  tasks_title: { en: "Execution", fr: "Exécution" },
  tasks_placeholder: { en: "Enter task...", fr: "Saisir tâche..." },
  tasks_empty: { en: "System ready. Add tasks.", fr: "Système prêt. Ajoutez des tâches." },
  task_completed_label: { en: "Task completed", fr: "Tâches terminées" },
  task_export: { en: "Export statistics", fr: "Exporter stats" },
  
  // Priorities
  prio_urgent: { en: "Urgent", fr: "Urgent" },
  prio_high: { en: "High", fr: "Élevé" },
  prio_medium: { en: "Medium", fr: "Moyen" },
  prio_low: { en: "Low", fr: "Bas" },
  prio_cat_desc: { en: "In this category", fr: "Dans cette catégorie" },

  // Challenges / Long Term Goals
  challenges_title: { en: "Long Term Goals", fr: "Objectifs Long Terme" },
  challenges_placeholder: { en: "What is your big goal?", fr: "Quel est votre grand objectif ?" },

  // Money & Wallet
  money_spent: { en: "Expense", fr: "Dépense" },
  money_income: { en: "Income", fr: "Revenu" },
  money_balance: { en: "Overall Balance", fr: "Solde Global" },
  money_manage_tap: { en: "Tap to manage your money", fr: "Appuyez pour gérer" },
  money_placeholder: { en: "0.00", fr: "0.00" },
  money_desc_placeholder: { en: "Label (e.g. Coffee)", fr: "Libellé (ex: Café)" },
  person_name: { en: "Contact Name", fr: "Nom du Contact" },
  due_date: { en: "Due Date", fr: "Échéance" },
  start_date: { en: "Start Date", fr: "Date Début" },
  note_placeholder: { en: "Optional notes...", fr: "Notes optionnelles..." },
  amount: { en: "Amount", fr: "Montant" },
  
  // Transaction Types
  tx_type_income: { en: "Income", fr: "Entrée" },
  tx_type_expense: { en: "Expense", fr: "Sortie" },
  tx_type_lent: { en: "You Lent", fr: "Tu as Prêté" },
  tx_type_borrowed: { en: "You Owe", fr: "Tu Dois" },
  tx_add_btn: { en: "Save Record", fr: "Enregistrer" },
  tx_history: { en: "History", fr: "Historique" },
  tx_empty: { en: "No activity recorded.", fr: "Aucune activité." },
  
  // Filters & Actions
  filter_all: { en: "All", fr: "Tout" },
  filter_title: { en: "Filter", fr: "Filtrer" },
  loan_paid: { en: "Settled", fr: "Réglé" },
  loan_mark_paid: { en: "Mark as Settled", fr: "Marquer Réglé" },
  loan_unpaid: { en: "Active", fr: "Actif" },

  // Mistakes / Lessons
  mistakes_title: { en: "What I Learned Today", fr: "Ce que j'ai appris" },
  mistakes_placeholder: { en: "What went wrong? What did you learn?", fr: "Qu'est-ce qui n'a pas été ? Qu'avez-vous appris ?" },
  
  // Loans
  loans_net: { en: "Net Position", fr: "Position Nette" },
  loans_add: { en: "New Debt/Loan", fr: "Nouveau Prêt/Dette" },
  loans_lent: { en: "Total Owed to Me", fr: "On me doit" },
  loans_borrowed: { en: "Total I Owe", fr: "Je dois" },

  // Summary & Report
  summary_title: { en: "Daily Debrief", fr: "Débriefing" },
  summary_empty: { en: "No activity yet — your day starts here 💪", fr: "Aucune activité — votre journée commence ici 💪" },
  summary_footer: { 
    en: "Analysis complete.", 
    fr: "Analyse terminée."
  },
  report_title: { en: "Analytics", fr: "Analytique" },
  task_overview: { en: "Performance", fr: "Performance" },
  completed_tasks: { en: "Done", fr: "Fait" },
  ongoing_tasks: { en: "Missed", fr: "Manqué" },
  weekly_activity: { en: "7-Day Trend", fr: "Tendance 7j" },
  productivity_trend: { en: "Velocity", fr: "Vélocité" },
  avg_project: { en: "Avg/Day", fr: "Moy/Jour" },
  last_7_days: { en: "Last 7 Days", fr: "7 Derniers Jours" },
  summary_mood: { en: "How did you feel?", fr: "Comment vous sentiez-vous ?" },
  
  // Settings
  edit_profile: { en: "Edit profile", fr: "Modifier profil" },
  settings_title: { en: "System Config", fr: "Configuration" },
  settings_language: { en: "Interface Language", fr: "Langue Interface" },
  settings_currency: { en: "Base Currency", fr: "Devise Principale" },
  settings_reset: { en: "Factory Reset", fr: "Réinitialisation Usine" },
  settings_name: { en: "Display Name", fr: "Nom d'affichage" },
  settings_id: { en: "ID", fr: "ID" },
  reset_confirm_msg: {
    en: "CRITICAL: This action cannot be undone. It will wipe all data. Confirm?",
    fr: "CRITIQUE : Cette action est irréversible. Elle effacera toutes les données. Confirmer ?"
  },

  // Trash
  trash_title: { en: "Archive", fr: "Archives" },
  trash_empty: { en: "Archive empty", fr: "Archives vides" },
  trash_restore: { en: "Recover", fr: "Récupérer" },
  trash_delete: { en: "Shred", fr: "Détruire" },
  trash_warning: { en: "This action cannot be undone.", fr: "Cette action est irréversible." },
  
  // Calendar
  calendar_title: { en: "Timeline", fr: "Chronologie" },
  calendar_footer: { en: "Every record counts.", fr: "Chaque enregistrement compte." },
  calendar_empty: { 
    en: "No data.", 
    fr: "Aucune donnée."
  },
  stats_streak: { en: "Current Streak", fr: "Série Actuelle" },
  stats_respected: { en: "Productive", fr: "Productif" },
  stats_missed: { en: "Lazy", fr: "Paresseux" },

  // Notifications
  notifications_title: { en: "Logs & Alerts", fr: "Journaux" },
  notifications_empty: { en: "No logs", fr: "Aucun journal" },
  notifications_mark_read: { en: "Clear all", fr: "Tout effacer" },
  
  // General
  back: { en: "Back", fr: "Retour" },
  next: { en: "Next", fr: "Suivant" },
};

export const INITIAL_DATA: AppData = {
  hasOnboarded: false,
  joinDate: new Date().toISOString(), 
  name: "User", 
  userId: "TNAV9832",
  gender: 'male',
  currency: 'AED',
  tasks: [],
  challenges: [],
  expenses: [],
  incomes: [],
  loans: [],
  mistakes: [],
  moods: [],
  trash: [], 
  notifications: [], 
  lastActiveDate: new Date().toISOString(),
};

export const CURRENCIES = [
  { code: 'MAD', name: 'Moroccan Dirham' },
  { code: 'AED', name: 'United Arab Emirates Dirham' },
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', name: 'Qatari Rial' },
  { code: 'DZD', name: 'Algerian Dinar' },
  { code: 'TND', name: 'Tunisian Dinar' },
  { code: 'EGP', name: 'Egyptian Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
];
