import { useNavigate } from 'react-router-dom';

import { Users } from 'lucide-react';

import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import { toastError } from '../../../utils/toast';
import { clientService } from '../../../services/client.service';
import type { ClientListItem } from '../types/client.types';
import ClientTable from '../components/ClientTable';
import { useEffect, useState } from 'react';

const ClientsPage = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error(error);
      toastError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users size={28} className="text-blue-600" />
          Clients
        </h1>
        <p className="text-slate-500">
          Manage all your clients and their event deliveries
        </p>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {loading ? (
        <Loader text="Loading clients..." />
      ) : (
        <ClientTable
          clients={filtered}
          onView={handleView}
        />
      )}
    </div>
  );
};

export default ClientsPage;
