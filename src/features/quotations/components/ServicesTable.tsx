import { Trash2, Plus } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import data from '../Data/quotation.data';
import { ServiceItem } from '../types/quotation.types';

interface ServicesTableProps {
  services: ServiceItem[];

  addService: () => void;

  removeService: (id: number) => void;

  updateService: (
    id: number,
    field: keyof ServiceItem,
    value: string | number,
  ) => void;

  readOnly?: boolean;

  error?: string;
}

const ServicesTable = ({
  services,
  addService,
  removeService,
  updateService,
  readOnly = false,
  error,
}: ServicesTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Services
        </h2>

        {!readOnly && (
          <Button
            leftIcon={<Plus size={18} />}
            onClick={addService}
          >
            Add Service
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Service
              </th>

              <th className="p-4 text-center">
                Price
              </th>

              <th className="p-4 text-center">
                Total
              </th>

              {!readOnly && (
                <th className="p-4 text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 3 : 4}
                  className="p-8 text-center text-slate-500"
                >
                  No services added.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="border-t"
                >
                  <td className="p-3">
                    <select
                      value={service.serviceName}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateService(
                          service.id,
                          'serviceName',
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        Select Service
                      </option>

                      {data.services.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="w-40 p-3">
                    <Input
                      type="number"
                      min={0}
                      readOnly={readOnly}
                      value={service.price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateService(
                          service.id,
                          'price',
                          val < 0 ? 0 : val,
                        );
                      }}
                    />
                  </td>

                  <td className="text-center font-semibold">
                    ₹
                    {service.price.toLocaleString()}
                  </td>

                  {!readOnly && (
                    <td className="text-center">
                      <button
                        onClick={() =>
                          removeService(service.id)
                        }
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTable;
