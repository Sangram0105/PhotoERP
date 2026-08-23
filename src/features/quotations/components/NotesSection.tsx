import Card from '../../../components/ui/Card';
import Textarea from '../../../components/ui/Textarea';

interface NotesSectionProps {
  notes: string;
  onChange: (value: string) => void;

  readOnly?: boolean;
}

const NotesSection = ({
  notes,
  onChange,
  readOnly = false,
}: NotesSectionProps) => {
  return (
    <Card title="Terms & Notes">
      <Textarea
        rows={5}
        placeholder="Enter quotation notes, terms & conditions..."
        readOnly={readOnly}
        value={notes}
        onChange={(e) => onChange(e.target.value)}
      />
    </Card>
  );
};

export default NotesSection;