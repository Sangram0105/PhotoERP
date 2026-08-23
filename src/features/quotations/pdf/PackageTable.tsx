import {
  Camera,
} from 'lucide-react';


interface ServiceItem {
  id:number;
  serviceName:string;
  quantity:number;
  price:number;
}


interface PackageTableProps {
  services:ServiceItem[];
}


const PackageTable = ({
  services,
}:PackageTableProps) => {

  return (

    <section className="package-section">

      <div className="package-ribbon">
        PACKAGE DETAILS
      </div>


      <table className="package-table">

        <thead>

          <tr>

            <th className="icon-column"></th>

            <th>
              Description
            </th>

            <th>
              Details
            </th>

            <th className="price-column">
              Price (₹)
            </th>

          </tr>

        </thead>


        <tbody>

        {
          services.length === 0 ?

          (
            <tr>
              <td
                colSpan={4}
                className="empty-row"
              >
                No services added.
              </td>
            </tr>
          )

          :

          services.map((service)=>(

            <tr key={service.id}>


              <td>

                <div className="service-icon">

                  <Camera
                    size={18}
                  />

                </div>

              </td>



              <td className="service-name">

                {service.serviceName}

              </td>



              <td className="service-detail">

                Quantity : {service.quantity}

              </td>



              <td className="service-price">

                ₹ {(
                  service.quantity *
                  service.price
                ).toLocaleString('en-IN')}

              </td>


            </tr>

          ))

        }

        </tbody>

      </table>


    </section>

  );
};


export default PackageTable;