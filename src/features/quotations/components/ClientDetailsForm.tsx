import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

import { ClientDetails } from '../types/quotation.types';

interface ClientDetailsFormProps {
  client: ClientDetails;

  onChange: (
    field: keyof ClientDetails,
    value: string,
  ) => void;

  readOnly?: boolean;
}

const ClientDetailsForm = ({
  client,
  onChange,
  readOnly = false,
}: ClientDetailsFormProps) => {
  return (
    <Card title="Client Details">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Client Name"
          placeholder="Enter client name"
          required
          readOnly={readOnly}
          value={client.name}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
        />

        <Input
          label="Mobile Number"
          placeholder="Enter mobile number"
          type="tel"
          required
          readOnly={readOnly}
          value={client.phone}
          onChange={(e) =>
            onChange('phone', e.target.value)
          }
        />

        <Input
          label="Email"
          placeholder="Enter email"
          type="email"
          readOnly={readOnly}
          value={client.email}
          onChange={(e) =>
            onChange('email', e.target.value)
          }
        />

        <div />
      </div>

      <div className="mt-5">
        <Textarea
          label="Address"
          rows={4}
          placeholder="Enter client address"
          readOnly={readOnly}
          value={client.address}
          onChange={(e) =>
            onChange('address', e.target.value)
          }
        />
      </div>
    </Card>
  );
};

export default ClientDetailsForm;