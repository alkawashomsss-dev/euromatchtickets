import { Helmet } from 'react-helmet-async';
import { Building2, Mail, MapPin, FileText, Scale } from 'lucide-react';

const ImpressumPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Impressum | EuroMatchTickets</title>
        <meta name="description" content="Impressum und rechtliche Informationen von EuroMatchTickets. Angaben gemäß § 5 TMG." />
      </Helmet>

      {/* Header */}
      <section className="py-16 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Scale className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Impressum</h1>
          <p className="text-xl text-zinc-400">
            Information according to §5 TMG
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-8">
          {/* Company Info */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              Information according to §5 TMG
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <div>
                <h3 className="font-semibold text-white text-lg">Alex Heimbeck</h3>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p>Erzgießereistraße 15</p>
                  <p>80335 München</p>
                  <p>Germany</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-emerald-400" />
              Contact
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:support@euromatchtickets.com" className="text-zinc-300 hover:text-white">
                  support@euromatchtickets.com
                </a>
              </div>
            </div>
          </section>

          {/* Responsible for Content */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Responsible for content according to §55 Abs. 2 RStV
            </h2>
            
            <div className="text-zinc-300">
              <p className="font-semibold text-white">Alex Heimbeck</p>
              <p>Erzgießereistraße 15</p>
              <p>80335 München</p>
              <p>Germany</p>
            </div>
          </section>

          {/* EU Dispute Resolution */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              EU Dispute Resolution
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                The European Commission provides a platform for online dispute resolution (OS):
              </p>
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline block"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <p>
                Our email address can be found above in the Impressum.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Consumer Dispute Resolution
            </h2>
            
            <div className="text-zinc-400">
              <p>
                We are not willing or obliged to participate in dispute resolution proceedings 
                before a consumer arbitration board.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Liability for Content
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                As a service provider, we are responsible for our own content on these pages in 
                accordance with general laws pursuant to Section 7 (1) TMG. According to Sections 
                8 to 10 TMG, however, we as a service provider are not obligated to monitor 
                transmitted or stored third-party information or to investigate circumstances 
                that indicate illegal activity.
              </p>
              <p>
                Obligations to remove or block the use of information under general law remain 
                unaffected. However, liability in this regard is only possible from the time of 
                knowledge of a specific infringement. Upon becoming aware of corresponding 
                infringements, we will remove this content immediately.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Disclaimer
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                Euromatchtickets.com is an independent secondary ticket marketplace and is not 
                affiliated with, endorsed by, or officially connected to any event organizer, 
                sports club, or governing body.
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Copyright
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                The content and works created by the site operators on these pages are subject to 
                copyright law. Duplication, processing, distribution, and any kind of exploitation 
                outside the limits of copyright require the written consent of the respective 
                author or creator.
              </p>
              <p>
                Downloads and copies of this site are only permitted for private, non-commercial use.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;
