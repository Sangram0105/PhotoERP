import Button from '../../../components/ui/Button';

interface QuotationActionsProps {
  mode: 'create' | 'edit' | 'view';

  onSaveQuotation?: () => void;
  onUpdateQuotation?: () => void;

  onGeneratePdf?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;

  loading?: boolean;
}

const QuotationActions = ({
  mode,

  onSaveQuotation,
  onUpdateQuotation,

  onGeneratePdf,
  onCancel,
  onEdit,

  loading = false,
}: QuotationActionsProps) => {
  return (
    <div className="flex flex-wrap justify-end gap-4">
      {/* CREATE MODE */}
      {mode === 'create' && (
        <Button
          onClick={onSaveQuotation}
          loading={loading}
        >
          Save Quotation
        </Button>
      )}

      {/* EDIT MODE */}
      {mode === 'edit' && (
        <Button
          onClick={onUpdateQuotation}
          loading={loading}
        >
          Update Quotation
        </Button>
      )}

      {/* VIEW MODE */}
      {mode === 'view' && (
        <Button
          onClick={onEdit}
        >
          Edit Quotation
        </Button>
      )}

      {/* COMMON BUTTONS */}
      <Button
        variant="outline"
        onClick={onGeneratePdf}
      >
        Generate PDF
      </Button>

      <Button
        variant="danger"
        onClick={onCancel}
      >
        {mode === 'view' ? 'Back' : 'Cancel'}
      </Button>
    </div>
  );
};

export default QuotationActions;
