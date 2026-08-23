import {
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa';


interface FooterProps {
  phone:string;
  email:string;
  website:string;
}


const Footer = ({
  phone,
  email,
  website,
}:FooterProps) => {

  return (

    <footer className="quotation-footer">


      <div className="footer-content">


        {/* Contact */}

        <div className="footer-contact">


          <div className="footer-row">
            <Phone size={15}/>
            <span>{phone}</span>
          </div>


          <div className="footer-row">
            <Mail size={15}/>
            <span>{email}</span>
          </div>


          <div className="footer-row">
            <Globe size={15}/>
            <span>{website}</span>
          </div>


        </div>



        {/* Social */}

        <div className="social-icons">

          <div className="social-circle">
            <FaInstagram size={16}/>
          </div>

          <div className="social-circle">
            <FaFacebookF size={16}/>
          </div>

          <div className="social-circle">
            <FaYoutube size={16}/>
          </div>

        </div>




        {/* Thank You */}

        <div
          className="thank-you"
          style={{
            fontFamily:"'Dancing Script', cursive"
          }}
        >
          Thank You!
        </div>



      </div>


    </footer>

  );
};


export default Footer;