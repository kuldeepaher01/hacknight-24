import React from 'react';
// import cropImage from '../assets/about_image1.png';  // Update with your image path

const AboutUs = () => {
  return (
    <section className="bg-lightYellow py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold mb-4">What is Investops?</h2>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            <p className="mb-4">
              Investops is the digital foundation being set up by the government to make it easier to bring various stakeholders together to improve agriculture in India and enable better outcomes and results for the farmers by using data and digital services. It is an effort to bring together high-quality data and to make this data easily available to the stakeholders that need it so that they can create new services using the data. Evolved from the thinking of the InDEA 2.0 Architecture by MeitY, Investops is being built by the Ministry of Agriculture & Farmers Welfare in an open manner, with a federated structure – keeping States at the center of the design, ensuring participatory and inclusive design to ensure the sector evolves collectively to help shape the next decade of agriculture in India.
            </p>
            <p>
              Investops aims to make it easier for farmers to get easier access to cheaper credit, higher-quality farm inputs, localized and specific advice, and more informed and convenient access to markets. Investops also aims to make it easier for governments to plan and implement various farmer and agriculture-focused benefit schemes.
            </p>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end">
            {/* <img src={cropImage} alt="Crops" className="mb-4 rounded shadow-lg"/> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
