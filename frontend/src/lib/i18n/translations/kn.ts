import type { en } from './en';

export const kn: typeof en = {
  common: {
    cancel: 'ರದ್ದುಮಾಡಿ',
    close: 'ಮುಚ್ಚಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    view: 'ವೀಕ್ಷಿಸಿ',
    saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    moreActions: 'ಹೆಚ್ಚಿನ ಕ್ರಿಯೆಗಳು',
  },
  customers: {
    pageTitle: 'ಗ್ರಾಹಕರು',
    pageDescription: 'ಗ್ರಾಹಕರ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ, ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.',
    sectionTitle: 'ಎಲ್ಲಾ ಗ್ರಾಹಕರು',
    searchPlaceholder: 'ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಕಂಪನಿಯಿಂದ ಹುಡುಕಿ',
    filter: 'ಫಿಲ್ಟರ್',
    export: 'ರಫ್ತು ಮಾಡಿ',
    addCustomer: 'ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ',
    kpi: {
      total: 'ಒಟ್ಟು ಗ್ರಾಹಕರು',
      active: 'ಸಕ್ರಿಯ',
      leads: 'ಲೀಡ್‌ಗಳು',
      inactive: 'ನಿಷ್ಕ್ರಿಯ',
    },
    table: {
      name: 'ಹೆಸರು',
      email: 'ಇಮೇಲ್',
      company: 'ಕಂಪನಿ',
      status: 'ಸ್ಥಿತಿ',
      created: 'ರಚಿಸಲಾಗಿದೆ',
      actions: 'ಕ್ರಿಯೆಗಳು',
    },
    status: {
      active: 'ಸಕ್ರಿಯ',
      inactive: 'ನಿಷ್ಕ್ರಿಯ',
      lead: 'ಲೀಡ್',
    },
    form: {
      addTitle: 'ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ',
      editTitle: 'ಗ್ರಾಹಕರನ್ನು ಸಂಪಾದಿಸಿ',
      addSubtitle: 'ಹೊಸ ಗ್ರಾಹಕ ದಾಖಲೆಯನ್ನು ರಚಿಸಿ.',
      editSubtitle: 'ಈ ಗ್ರಾಹಕರ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ.',
      name: 'ಹೆಸರು',
      email: 'ಇಮೇಲ್',
      phone: 'ಫೋನ್',
      company: 'ಕಂಪನಿ',
      status: 'ಸ್ಥಿತಿ',
      nameRequired: 'ಹೆಸರು ಅಗತ್ಯವಿದೆ',
      emailRequired: 'ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ',
      emailInvalid: 'ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
      companyRequired: 'ಕಂಪನಿ ಅಗತ್ಯವಿದೆ',
    },
    details: {
      title: 'ಗ್ರಾಹಕರ ವಿವರಗಳು',
      email: 'ಇಮೇಲ್',
      phone: 'ಫೋನ್',
      company: 'ಕಂಪನಿ',
      customerId: 'ಗ್ರಾಹಕ ಐಡಿ',
      created: 'ರಚಿಸಲಾಗಿದೆ',
    },
    deleteDialog: {
      title: 'ಗ್ರಾಹಕರನ್ನು ಅಳಿಸಿ',
      confirmPrefix: 'ನೀವು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ',
      confirmSuffix: '? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    },
    emptyState: {
      noMatchTitle: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಗ್ರಾಹಕರು ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ',
      noMatchDescription: 'ಬೇರೆ ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಕಂಪನಿಯನ್ನು ಪ್ರಯತ್ನಿಸಿ.',
      noCustomersTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಗ್ರಾಹಕರಿಲ್ಲ',
      noCustomersDescription:
        'ನಿಮ್ಮ ಪಟ್ಟಿಯನ್ನು ನಿರ್ಮಿಸಲು ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ.',
    },
    rowActions: {
      moreActionsFor: '{{name}} ಗಾಗಿ ಹೆಚ್ಚಿನ ಕ್ರಿಯೆಗಳು',
    },
  },
};
