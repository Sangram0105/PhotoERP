import {
  FilePlus,
  Receipt,
  Settings,
  UserPlus,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Button leftIcon={<FilePlus size={18} />}>
          New Quotation
        </Button>

        <Button
          variant="secondary"
          leftIcon={<UserPlus size={18} />}
        >
          Add Client
        </Button>

        <Button
          variant="outline"
          leftIcon={<Receipt size={18} />}
        >
          Receipt
        </Button>

        <Button
          variant="outline"
          leftIcon={<Settings size={18} />}
        >
          Settings
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;