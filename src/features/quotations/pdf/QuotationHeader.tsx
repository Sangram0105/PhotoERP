import { Camera } from 'lucide-react';

interface Props {
  floralBanner: string;
  logo:string
}

const QuotationHeader = ({ floralBanner,logo }: Props) => {
  return (
    <header className="quotation-header">

      <div className="header-glow" />

      <div className="decor-circle circle-one" />
      <div className="decor-circle circle-two" />


      <div className="logo-container">

         <Camera
    size={38}
    className="camera-icon"
  />

  <img
    src={logo}
    alt="Memories Forever Photography"
    className="logo-image"
  />

      </div>


      <div className="quotation-title">

        <p className="photo-title">
          PHOTOGRAPHY
        </p>

        <h1>
          QUOTATION
        </h1>


        <p className="tagline">
          We don't just take photos,
          <br />
          we create memories.
        </p>

      </div>


      <div className="floral-image">

        <div className="image-card">

          <img
            src={floralBanner}
            alt="Floral Banner"
          />

        </div>

      </div>


    </header>
  );
};

export default QuotationHeader;