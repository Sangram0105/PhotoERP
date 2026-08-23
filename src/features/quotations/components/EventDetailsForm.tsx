import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

import data from '../Data/quotation.data';
import { EventDetails } from '../types/quotation.types';

interface EventDetailsFormProps {
  event: EventDetails;

  onChange: (
    field: keyof EventDetails,
    value: string,
  ) => void;

  readOnly?: boolean;
}

const EventDetailsForm = ({
  event,
  onChange,
  readOnly = false,
}: EventDetailsFormProps) => {
  return (
    <Card title="Event Details">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Event Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Event Type
          </label>

          <select
            value={event.eventType}
            disabled={readOnly}
            onChange={(e) =>
              onChange('eventType', e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">
              Select Event Type
            </option>

            {data.eventTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Event Date */}
        <Input
          label="Event Date"
          type="date"
          readOnly={readOnly}
          value={event.eventDate}
          onChange={(e) =>
            onChange('eventDate', e.target.value)
          }
        />

        {/* Event Time */}
        <Input
          label="Event Time"
          type="time"
          readOnly={readOnly}
          value={event.eventTime}
          onChange={(e) =>
            onChange('eventTime', e.target.value)
          }
        />

        {/* City */}
        <Input
          label="City"
          placeholder="Enter city"
          readOnly={readOnly}
          value={event.city}
          onChange={(e) =>
            onChange('city', e.target.value)
          }
        />
      </div>

      <div className="mt-5">
        <Input
          label="Venue"
          placeholder="Enter venue"
          readOnly={readOnly}
          value={event.venue}
          onChange={(e) =>
            onChange('venue', e.target.value)
          }
        />
      </div>

      <div className="mt-5">
        <Textarea
          label="Event Notes"
          rows={4}
          placeholder="Additional event information..."
          readOnly={readOnly}
          value={event.eventNotes}
          onChange={(e) =>
            onChange('eventNotes', e.target.value)
          }
        />
      </div>
    </Card>
  );
};

export default EventDetailsForm;