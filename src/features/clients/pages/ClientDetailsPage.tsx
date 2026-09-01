import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';
import Loader from '../../../components/ui/Loader';
import {
  toastSuccess,
  toastError,
  toastLoading,
  toastDismiss,
} from '../../../utils/toast';
import { clientService } from '../../../services/client.service';
import type { ClientDetails } from '../types/client.types';
import { useEffect, useState } from 'react';

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (id) loadDetails(Number(id));
  }, [id]);

  const loadDetails = async (clientId: number) => {
    try {
      setLoading(true);
      const details = await clientService.getClientDetails(clientId);
      setData(details);
    } catch (error) {
      console.error(error);
      toastError('Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    serviceId: number,
    currentStatus: string,
  ) => {
    const newStatus =
      currentStatus === 'Completed' ? 'Pending' : 'Completed';

    const toastId = toastLoading('Updating status...');

    try {
      setUpdatingId(serviceId);
      await clientService.updateServiceStatus(serviceId, newStatus);
      await loadDetails(Number(id));
      toastDismiss(toastId);
      toastSuccess('Status updated successfully');
    } catch (err) {
      console.error(err);
      toastDismiss(toastId);
      toastError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading client details..." />;
  }

  if (!data) {
    return (
      <Card>
        <p className="text-slate-500">Client not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft size={16} />
          Back to Clients
        </Button>
      </Card>
    );
  }

  const { client, events, overall_status } = data;

  return (
    <div className="space-y-6">
      {/* Header / Back */}
      <Button
        variant="outline"
        onClick={() => navigate('/clients')}
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Button>

      {/* Client Info */}
      <Card>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {client.name}
              </h1>
              <div className="mt-1 space-y-1 text-sm text-slate-500">
                {client.phone && <p>{client.phone}</p>}
                {client.email && <p>{client.email}</p>}
                {client.address && <p>{client.address}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 md:items-end">
            <span className="text-sm text-slate-500">
              Overall Delivery
            </span>
            <StatusBadge status={overall_status} />
          </div>
        </div>
      </Card>

      {/* Events */}
      {events.length === 0 ? (
        <Card>
          <p className="text-slate-500">
            No events found for this client.
          </p>
        </Card>
      ) : (
        events.map((event) => (
          <Card key={event.quotation_id}>
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {event.quotation_number}
                  </h2>
                  <StatusBadge status={event.overall_status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {event.event_type &&
                    `${event.event_type} • `}
                  {event.event_date || 'No date'}
                  {event.event_time && ` • ${event.event_time}`}
                </p>
                {(event.venue || event.city) && (
                  <p className="text-xs text-slate-400">
                    {[event.venue, event.city]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Delivery
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {event.services.map((service) => {
                    const isUpdating = updatingId === service.id;
                    const isCompleted =
                      service.status === 'Completed';

                    return (
                      <tr
                        key={service.id}
                        className="border-t hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {service.service_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {service.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          ₹{service.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          ₹{service.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={service.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant={isCompleted ? 'secondary' : 'primary'}
                            loading={isUpdating}
                            onClick={() =>
                              handleToggleStatus(
                                service.id,
                                service.status,
                              )
                            }
                          >
                            {isCompleted ? (
                              <Clock size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClientDetailsPage;
