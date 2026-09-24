import { useNavigate } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useAuth from '@/hooks/useAuth';
import RequestApprovalForm from '@/features/approvals/components/RequestApprovalForm';
import useCreateApprovalRequest from '@/features/approvals/hooks/useCreateApprovalRequest';
import type { ApprovalRequestInput } from '@/features/approvals/types';

export default function RequestApprovalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createRequestMutation = useCreateApprovalRequest();

  const handleSubmit = async (input: ApprovalRequestInput) => {
    if (!user) return;
    await createRequestMutation.mutateAsync({
      input,
      requestedBy: { id: user.id, name: user.name },
    });
    navigate('/approvals');
  };

  const handleCancel = () => {
    navigate('/approvals');
  };

  return (
    <PageContainer
      title="Request Approval"
      description="Submit a new request for review by a Super Admin, Admin or Manager."
      breadcrumbs={[{ title: 'Approvals', path: '/approvals' }, { title: 'Request Approval' }]}
    >
      <SectionCard title="New approval request">
        <RequestApprovalForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </SectionCard>
    </PageContainer>
  );
}
