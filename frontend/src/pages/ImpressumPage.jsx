import { Helmet } from 'react-helmet-async';
import { Building2, Mail, Phone, MapPin, FileText, Scale } from 'lucide-react';

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
            Legal Information (Angaben gemäß § 5 TMG)
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-8">
          {/* Company Info */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              Angaben gemäß § 5 TMG
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <div>
                <h3 className="font-semibold text-white text-lg">Abd Al mahsen Alkawas</h3>
                <p className="text-zinc-400">Einzelunternehmer</p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p>Fürstenriederstr. 33</p>
                  <p>80686 München</p>
                  <p>Deutschland</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-emerald-400" />
              Kontakt
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="tel:+491781304137" className="text-zinc-300 hover:text-white">
                  +49 178 130 4137
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:Alkawashoms@gmail.com" className="text-zinc-300 hover:text-white">
                  Alkawashoms@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Tax Info */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400" />
              Umsatzsteuer-ID
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p>
                <strong className="text-white">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</strong>
              </p>
              <p className="text-xl font-mono">DE454326544</p>
              
              <p className="mt-4">
                <strong className="text-white">Handelsregister:</strong>
              </p>
              <p className="text-xl font-mono">14410642728</p>
            </div>
          </section>

          {/* Responsible for Content */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            
            <div className="text-zinc-300">
              <p className="font-semibold text-white">Abd Al mahsen Alkawas</p>
              <p>Fürstenriederstr. 33</p>
              <p>80686 München</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* EU Dispute Resolution */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              EU-Streitschlichtung
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
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
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            
            <div className="text-zinc-400">
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Haftung für Inhalte
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Urheberrecht
            </h2>
            
            <div className="text-zinc-400 space-y-4">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;
