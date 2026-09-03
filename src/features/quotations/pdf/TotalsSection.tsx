interface TotalsSectionProps {
  subtotal: number;
  discount: number;
  advance: number;
  total: number;
  balance: number;
}

const TotalsSection = ({
  subtotal,
  advance,
  total,
  balance,
}: TotalsSectionProps) => {

  return (
    <section className="totals-section">


      {/* Terms */}
      <div className="terms-section">

        <h3>
          TERMS & CONDITIONS
        </h3>


        <ul>

          <li>
            50% advance required to confirm the booking.
          </li>

          <li>
            Balance payment must be cleared before the event.
          </li>

          <li>
            No cancellation or refund after confirmation.
          </li>

          <li>
            Extra coverage hours will be charged separately.
          </li>

          <li>
            Travelling and accommodation charges are extra if applicable.
          </li>

        </ul>

      </div>



      {/* Amounts */}

      <div className="amount-section">


        <div className="amount-row">
          <span>Subtotal</span>
          <strong>
            ₹ {subtotal.toLocaleString('en-IN')}
          </strong>
        </div>


        <div className="amount-row">
          <span>Advance</span>
          <strong>
            ₹ {advance.toLocaleString('en-IN')}
          </strong>
        </div>


        <div className="amount-row balance-row">
          <span>
            Balance
          </span>

          <strong>
            ₹ {balance.toLocaleString('en-IN')}
          </strong>
        </div>



        <div className="grand-total">

          <div>

            <span>
              TOTAL (₹)
            </span>


            <strong>
              {total.toLocaleString('en-IN')}
            </strong>

          </div>

        </div>


      </div>


    </section>

  );
};


export default TotalsSection;