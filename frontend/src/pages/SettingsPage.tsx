import { useParams } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';
import GeneralSection from '@/pages/settings/GeneralSection';
import AppearanceSection from '@/pages/settings/AppearanceSection';
import NotificationsSection from '@/pages/settings/NotificationsSection';

const SECTIONS = {
  general: { title: 'General', Component: GeneralSection },
  appearance: { title: 'Appearance', Component: AppearanceSection },
  notifications: { title: 'Notifications', Component: NotificationsSection },
} as const;

type SectionKey = keyof typeof SECTIONS;

function isSectionKey(value: string | undefined): value is SectionKey {
  return !!value && value in SECTIONS;
}

export default function SettingsPage() {
  const { section } = useParams<{ section?: string }>();
  const sectionKey: SectionKey = isSectionKey(section) ? section : 'general';
  const { title, Component } = SECTIONS[sectionKey];

  return (
    <PageContainer
      title="Settings"
      breadcrumbs={[{ title: 'Settings', path: '/settings/general' }, { title }]}
    >
      <Component />
    </PageContainer>
  );
}
