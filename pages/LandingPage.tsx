
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[#00E65A] rounded-lg flex items-center justify-center">
             <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold">SpendSense</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-black">Why SpendSense</a>
          <a href="#" className="hover:text-black">How It Works</a>
          <a href="#" className="hover:text-black">Features</a>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/login')} className="text-gray-600 font-medium hover:text-black">Login</button>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#00E65A] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#00C84D] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
          Take control of your finances, <br /> master your money.
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Stop impulse buying with psychology-backed tools. <br />
          Build wealth through mindful spending and delayed gratification.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#00E65A] text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:bg-[#00C84D] transition-all"
        >
          Get started for free
        </button>
      </section>

      {/* Features Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gray-50 rounded-3xl mb-24">
        <div className="text-center mb-16">
          <span className="text-[#00E65A] font-bold tracking-widest text-sm uppercase">Why SpendSense</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">Break the cycle of impulse buying</h2>
          <p className="text-gray-500 mt-4">Most budgeting apps track damage after it's done. We help you pause before you pay.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Psychology-backed', desc: 'Uses proven cognitive behavioral techniques to reduce shopping urges.', icon: '🧠' },
            { title: 'Emotional Awareness', desc: 'Understand the feelings triggering your spending habits instantly.', icon: '❤️' },
            { title: 'Wealth Building', desc: 'Redirect impulse money into savings goals that actually matter.', icon: '📈' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-16">Tools for self-control</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Lock Product', desc: 'Freeze funds for specific items until a cooldown period passes.', icon: '🔒' },
            { title: 'Smart Delay Timer', desc: 'Mandatory 24h to 30-day waiting periods before purchase.', icon: '⏱️' },
            { title: 'Break Penalty', desc: 'Small donation to charity if you break a lock early. Accountability works.', icon: '⚖️' },
            { title: 'Spending Awareness', desc: 'Real-time alerts asking "Do you really need this?" at checkout.', icon: '👁️' }
          ].map((tool, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#00E65A] transition-all group">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#00E65A10] group-hover:text-[#00E65A]">
                 <span className="text-2xl">{tool.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto text-center py-32 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-10">Ready to stop impulse buying?</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#00E65A] text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:bg-[#00C84D] transition-all"
        >
          Get started for free
        </button>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00E65A] rounded flex items-center justify-center">
             <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-bold text-lg">SpendSense</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 SpendSense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
