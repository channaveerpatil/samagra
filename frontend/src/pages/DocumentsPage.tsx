import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useDocuments from '@/features/documents/hooks/useDocuments';
import useDownloadDocument from '@/features/documents/hooks/useDownloadDocument';
import DocumentTable from '@/features/documents/components/DocumentTable';
import DocumentUploadDialog from '@/features/documents/components/DocumentUploadDialog';
import DeleteDocumentDialog from '@/features/documents/components/DeleteDocumentDialog';
import type { DocumentFile } from '@/features/documents/types';

export default function DocumentsPage() {
  const { documents, isLoading, searchTerm, setSearchTerm, deleteDocument, isDeletingId, refresh } =
    useDocuments();
  const downloadMutation = useDownloadDocument();

  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [deletingDocument, setDeletingDocument] = React.useState<DocumentFile | null>(null);

  const handleDownload = (document: DocumentFile) => {
    downloadMutation.mutate(document.id);
  };

  return (
    <PageContainer
      title="Documents"
      description="Upload, view, download and manage your documents."
      breadcrumbs={[{ title: 'Documents' }]}
    >
      <SectionCard title="All documents">
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
          >
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by file name"
              size="small"
              sx={{ maxWidth: 360, flex: 1, minWidth: 220 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<FilterListIcon />}>
                Filter
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refresh()}>
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => setIsUploadOpen(true)}
              >
                Upload Documents
              </Button>
            </Stack>
          </Stack>

          <DocumentTable
            documents={documents}
            isLoading={isLoading}
            hasSearchTerm={!!searchTerm.trim()}
            onUpload={() => setIsUploadOpen(true)}
            onDownload={handleDownload}
            onDelete={setDeletingDocument}
            isDownloadingId={downloadMutation.isPending ? downloadMutation.variables : undefined}
            isDeletingId={isDeletingId}
          />
        </Stack>
      </SectionCard>

      <DocumentUploadDialog open={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      <DeleteDocumentDialog
        document={deletingDocument}
        onClose={() => setDeletingDocument(null)}
        onConfirm={deleteDocument}
      />
    </PageContainer>
  );
}
