import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Mithuru Mawatha</h1>
        
        <div className="prose prose-orange max-w-none text-gray-600 text-lg space-y-6">
          <p>
            In many Sri Lankan towns and cities, physical infrastructure hazards like potholes, broken streetlights, damaged drains, and unsafe road sections often go unreported for months. This happens because there is currently no direct, structured digital channel between citizens and local authorities. 
          </p>
          <p>
            Instead, people complain in informal WhatsApp groups or on social media, where no official body monitors or tracks the issues. As a result, manageable problems deteriorate, causing accidents and vehicle damage.
          </p>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-8 rounded-r-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">The Women's Safety Layer</h3>
            <p className="text-gray-700">
              Separately, there is a critical gap in community safety reporting. Women and vulnerable groups often have no way to flag areas that feel unsafe—due to poor lighting, isolation, or past incidents—so that others can avoid them. 
            </p>
          </div>

          <p>
            <strong>Mithuru Mawatha (Friendly Road)</strong> was built to solve these problems. It provides a unified platform that allows citizens to report both physical road hazards and safety-risk areas. 
          </p>
          <p>
            Through our app, reports are mapped, tracked, and visible to the entire community. Authorities can update the status of repairs, and citizens can upvote hazards to increase their priority. With AI-assisted triage, incoming reports are automatically categorized and assigned an urgency level, streamlining the process for faster resolution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
