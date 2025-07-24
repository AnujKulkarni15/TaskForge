import React from 'react';

function App() {
return (
<div className="min-h-screen flex flex-col">
      {/* Existing Navbar and Hero sections would go here */}

      {/* Features Section */}
    <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191612] mb-4">
            We Provide The Most Unique & Modern Features
        </h2>
        <div className="w-20 h-1 bg-[#27ca84] mx-auto"></div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[#191612] mb-3">Increase output & productivity</h3>
            <p className="text-[#6e6862]">
              It helps make work more efficient which becomes output & productivity among team members.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[#191612] mb-3">Accessible anywhere & at any time</h3>
            <p className="text-[#6e6862]">
              It is accessible anywhere and at any time so teams can manage work in real time and make faster decisions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[#191612] mb-3">Empower team members & makes them execute work</h3>
            <p className="text-[#6e6862]">
              It empowers team members and makes them execute work with speed and accountability.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[#191612] mb-3">Real-time collaboration</h3>
            <p className="text-[#6e6862]">
              Team members can collaborate seamlessly with instant updates and notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;