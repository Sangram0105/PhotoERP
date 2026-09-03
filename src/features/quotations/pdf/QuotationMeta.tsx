interface Props {
  quotationNo: string;
  quotationDate: string;
  validTill: string;
}

const QuotationMeta = ({
  quotationNo,
  quotationDate,
}: Props) => {

  const rows = [
    {
      label: 'Quotation No.',
      value: quotationNo,
    },
    {
      label: 'Date',
      value: quotationDate,
    },
  ];


  return (
    <section className="quotation-meta">

      <div className="meta-list">

        {rows.map((row) => (

          <div
            key={row.label}
            className="meta-row"
          >

            <span className="meta-label">
              {row.label}
            </span>


            <span className="meta-colon">
              :
            </span>


            <span className="meta-value">
              {row.value}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default QuotationMeta;