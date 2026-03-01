import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, Database, Globe, Mail, Cookie, Server, UserCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Datenschutzerklärung / Privacy Policy | EuroMatchTickets</title>
        <meta name="description" content="Datenschutzerklärung von EuroMatchTickets. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO/GDPR." />
      </Helmet>

      {/* Header */}
      <section className="py-12 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Datenschutzerklärung</h1>
          <p className="text-xl text-zinc-400">Privacy Policy / Data Protection</p>
          <p className="text-zinc-500 text-sm mt-2">Stand / Last updated: Februar 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* GDPR Compliance Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🇪🇺</span>
          </div>
          <div>
            <h3 className="font-bold text-emerald-400 mb-1">DSGVO / GDPR Konform</h3>
            <p className="text-zinc-400 text-sm">
              Diese Datenschutzerklärung entspricht den Anforderungen der Datenschutz-Grundverordnung (DSGVO/GDPR) 
              und des Bundesdatenschutzgesetzes (BDSG).
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* 1. Verantwortlicher */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-purple-400" />
              1. Verantwortlicher / Data Controller
            </h2>
            <div className="text-zinc-400 leading-relaxed">
              <p className="mb-4">
                Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p><strong className="text-white">Alex Heimbeck</strong></p>
                <p>Erzgießereistraße 15</p>
                <p>80335 München</p>
                <p>Deutschland / Germany</p>
                <p className="mt-2">
                  E-Mail: <a href="mailto:support@euromatchtickets.com" className="text-purple-400 hover:underline">support@euromatchtickets.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Erhebung und Speicherung */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-400" />
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">2.1 Beim Besuch der Website:</strong><br />
                Beim Aufrufen unserer Website werden automatisch folgende Daten erfasst (Server-Logfiles):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP-Adresse des anfragenden Rechners (anonymisiert)</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und Betriebssystem</li>
              </ul>
              <p className="text-sm text-zinc-500">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherheit und Optimierung der Website)
              </p>
              
              <p className="mt-6">
                <strong className="text-white">2.2 Bei Registrierung und Ticketkauf:</strong><br />
                Folgende Daten werden bei der Nutzung unserer Dienste erhoben:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name und Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Zahlungsinformationen (werden von Stripe verarbeitet)</li>
                <li>Kaufhistorie und Transaktionsdaten</li>
              </ul>
              <p className="text-sm text-zinc-500">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </div>
          </section>

          {/* 3. Cookies */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-purple-400" />
              3. Cookies und Tracking
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf Ihrem Endgerät 
                gespeichert werden. Wir unterscheiden zwischen:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">Notwendige Cookies</h4>
                  <p className="text-sm">Erforderlich für den Betrieb der Website (Session, Warenkorb, Login)</p>
                  <p className="text-xs text-zinc-500 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Analyse-Cookies</h4>
                  <p className="text-sm">Google Analytics zur Verbesserung unserer Website (nur mit Einwilligung)</p>
                  <p className="text-xs text-zinc-500 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-400 mb-2">Marketing-Cookies</h4>
                  <p className="text-sm">Facebook Pixel für personalisierte Werbung (nur mit Einwilligung)</p>
                  <p className="text-xs text-zinc-500 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-400 mb-2">Präferenz-Cookies</h4>
                  <p className="text-sm">Speichern Ihre Einstellungen (Sprache, Region)</p>
                  <p className="text-xs text-zinc-500 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO</p>
                </div>
              </div>

              <p className="mt-4">
                <strong className="text-white">Cookie-Einstellungen:</strong> Sie können Ihre Cookie-Präferenzen 
                jederzeit über unseren Cookie-Banner ändern oder Cookies in Ihren Browsereinstellungen deaktivieren.
              </p>
            </div>
          </section>

          {/* 4. Google Analytics */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-400" />
              4. Google Analytics
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited 
                ("Google"), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              <p>
                <strong className="text-white">IP-Anonymisierung:</strong> Wir haben die IP-Anonymisierung aktiviert 
                (anonymizeIp). Ihre IP-Adresse wird vor der Übermittlung an Google gekürzt.
              </p>
              <p>
                <strong className="text-white">Nur mit Einwilligung:</strong> Google Analytics wird erst nach Ihrer 
                ausdrücklichen Einwilligung über unseren Cookie-Banner aktiviert.
              </p>
              <p>
                <strong className="text-white">Widerspruch:</strong> Sie können die Erfassung durch Google Analytics 
                verhindern, indem Sie:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ihre Cookie-Einwilligung widerrufen</li>
                <li>Das Browser-Add-on zur Deaktivierung von Google Analytics installieren: 
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-purple-400 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                    https://tools.google.com/dlpage/gaoptout
                  </a>
                </li>
              </ul>
              <p className="text-sm text-zinc-500">
                Weitere Informationen: <a href="https://policies.google.com/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Datenschutzerklärung</a>
              </p>
            </div>
          </section>

          {/* 5. Facebook Pixel */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-400" />
              5. Facebook Pixel
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Diese Website nutzt das "Facebook Pixel" der Meta Platforms Ireland Ltd., 4 Grand Canal Square, 
                Grand Canal Harbour, Dublin 2, Irland.
              </p>
              <p>
                <strong className="text-white">Zweck:</strong> Messung der Wirksamkeit unserer Werbeanzeigen und 
                Erstellung von Zielgruppen für personalisierte Werbung.
              </p>
              <p>
                <strong className="text-white">Nur mit Einwilligung:</strong> Das Facebook Pixel wird erst nach 
                Ihrer ausdrücklichen Einwilligung aktiviert.
              </p>
              <p>
                <strong className="text-white">Widerspruch:</strong> Sie können der Nutzung widersprechen unter:
                <a href="https://www.facebook.com/settings?tab=ads" className="text-purple-400 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  Facebook-Werbeeinstellungen
                </a>
              </p>
            </div>
          </section>

          {/* 6. Stripe Payment */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-400" />
              6. Zahlungsabwicklung (Stripe)
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Für die Zahlungsabwicklung nutzen wir den Dienst Stripe, Inc., 510 Townsend Street, 
                San Francisco, CA 94103, USA.
              </p>
              <p>
                Bei einer Zahlung werden Ihre Zahlungsdaten direkt an Stripe übermittelt. EuroMatchTickets 
                hat keinen Zugriff auf Ihre vollständigen Kreditkartendaten.
              </p>
              <p>
                <strong className="text-white">Datenübermittlung in die USA:</strong> Stripe ist unter dem 
                EU-US Data Privacy Framework zertifiziert.
              </p>
              <p className="text-sm text-zinc-500">
                Stripe Datenschutzerklärung: <a href="https://stripe.com/de/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://stripe.com/de/privacy</a>
              </p>
            </div>
          </section>

          {/* 7. Ihre Rechte */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              7. Ihre Rechte (DSGVO Art. 15-21)
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Auskunftsrecht (Art. 15)</h4>
                  <p className="text-xs">Recht auf Auskunft über Ihre gespeicherten Daten</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Berichtigung (Art. 16)</h4>
                  <p className="text-xs">Recht auf Korrektur unrichtiger Daten</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Löschung (Art. 17)</h4>
                  <p className="text-xs">Recht auf Löschung ("Recht auf Vergessenwerden")</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Einschränkung (Art. 18)</h4>
                  <p className="text-xs">Recht auf Einschränkung der Verarbeitung</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Datenübertragbarkeit (Art. 20)</h4>
                  <p className="text-xs">Recht auf Erhalt Ihrer Daten in portablem Format</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white text-sm">Widerspruch (Art. 21)</h4>
                  <p className="text-xs">Recht auf Widerspruch gegen bestimmte Verarbeitungen</p>
                </div>
              </div>

              <p className="mt-4">
                <strong className="text-white">Beschwerderecht:</strong> Sie haben das Recht, sich bei einer 
                Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist:
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-sm">
                <p>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</p>
                <p>Promenade 18, 91522 Ansbach</p>
                <p>poststelle@lda.bayern.de</p>
              </div>
            </div>
          </section>

          {/* 8. Datensicherheit */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Server className="w-6 h-6 text-purple-400" />
              8. Datensicherheit
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten zu schützen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">SSL/TLS-Verschlüsselung:</strong> Alle Datenübertragungen erfolgen verschlüsselt (HTTPS)</li>
                <li><strong className="text-white">PCI DSS:</strong> Zahlungsabwicklung entspricht dem Payment Card Industry Data Security Standard</li>
                <li><strong className="text-white">Zugangskontrolle:</strong> Beschränkter Zugriff auf personenbezogene Daten</li>
                <li><strong className="text-white">Regelmäßige Überprüfung:</strong> Kontinuierliche Überprüfung unserer Sicherheitsmaßnahmen</li>
              </ul>
            </div>
          </section>

          {/* 9. Speicherdauer */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">9. Speicherdauer</h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung des 
                Verarbeitungszwecks erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Vertragsdaten:</strong> Bis zum Ende der gesetzlichen Aufbewahrungsfrist (10 Jahre nach §257 HGB)</li>
                <li><strong className="text-white">Server-Logs:</strong> 30 Tage</li>
                <li><strong className="text-white">Cookie-Einwilligungen:</strong> 12 Monate</li>
                <li><strong className="text-white">Kontoschließung:</strong> Löschung nach Ablauf der Aufbewahrungsfristen</li>
              </ul>
            </div>
          </section>

          {/* 10. Kontakt */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-400" />
              10. Kontakt für Datenschutzanfragen
            </h2>
            <div className="text-zinc-400 leading-relaxed">
              <p className="mb-4">
                Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns:
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p><strong className="text-white">E-Mail:</strong> <a href="mailto:support@euromatchtickets.com" className="text-purple-400 hover:underline">support@euromatchtickets.com</a></p>
                <p><strong className="text-white">Betreff:</strong> "Datenschutzanfrage"</p>
                <p className="mt-2 text-sm">Wir werden Ihre Anfrage innerhalb von 30 Tagen bearbeiten.</p>
              </div>
            </div>
          </section>

          {/* 11. Änderungen */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">11. Änderungen dieser Datenschutzerklärung</h2>
            <div className="text-zinc-400 leading-relaxed">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen 
                oder bei Änderungen unserer Dienste anzupassen. Die jeweils aktuelle Version finden Sie auf 
                dieser Seite.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
