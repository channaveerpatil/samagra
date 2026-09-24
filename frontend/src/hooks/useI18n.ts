import * as React from 'react';
import I18nContext from '@/context/I18nContext';

export default function useI18n() {
  const context = React.useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
