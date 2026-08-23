import Card from '../../../components/ui/Card';

import { QuotationListItem } from '../../quotations/types/quotationList.types';

interface Props {
  quotations: QuotationListItem[];
}

const UpcomingEvents = ({
  quotations,
}: Props) => {
  return (
    <Card title="Upcoming Events">
      <div className="space-y-4">
        {quotations.length === 0 ? (
          <p className="text-sm text-slate-500">
            No upcoming events.
          </p>
        ) : (
          quotations.map((event) => (
            <div
              key={event.id}
              className="border-b pb-3 last:border-0"
            >
              <p className="font-semibold">
                {event.client_name}
              </p>

              <p className="text-sm text-slate-600">
                {event.event_type}
              </p>

              <p className="text-xs text-slate-500">
                {event.event_date}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingEvents;