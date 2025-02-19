const Footer = () => {
    return (
      <footer className="bg-black text-white text-sm py-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">ABOUT</h3>
            <ul className="space-y-1">
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Shopify Stories</li>
              <li>Press</li>
              <li>Corporate Information</li>
            </ul>
          </div>
  
          {/* Group Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-2">GROUP COMPANIES</h3>
            <ul className="space-y-1">
              <li>Myntra</li>
              <li>Cleartrip</li>
              <li>Shopsy</li>
            </ul>
          </div>
  
          {/* Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">HELP</h3>
            <ul className="space-y-1">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Cancellation & Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
  
          {/* Consumer Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-2">CONSUMER POLICY</h3>
            <ul className="space-y-1">
              <li>Cancellation & Returns</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
              <li>Sitemap</li>
              <li>Grievance Redressal</li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-20 mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2007-2025 Shopify.com</p>
          <div className="flex space-x-4 text-gray-400">
            <span>Become a Seller</span>
            <span>Advertise</span>
            <span>Gift Cards</span>
            <span>Help Center</span>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  