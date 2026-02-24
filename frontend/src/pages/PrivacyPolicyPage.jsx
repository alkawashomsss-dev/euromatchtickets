import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, UserCheck, Database, Bell, Trash2, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Privacy Policy | EuroMatchTickets</title>
        <meta name="description" content="Read EuroMatchTickets privacy policy. Learn how we collect, use, and protect your personal data. GDPR compliant." />
        <meta name="keywords" content="privacy policy, data protection, GDPR, euromatchtickets privacy" />
      </Helmet>

      {/* Header */}
      <section className="py-16 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-zinc-400">
            Your privacy matters to us. Here's how we protect your data.
          </p>
          <p className="text-sm text-zinc-500 mt-4">Last updated: February 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Quick Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Lock, title: "Encrypted", desc: "All data encrypted" },
            { icon: Eye, title: "Transparent", desc: "Clear data usage" },
            { icon: UserCheck, title: "GDPR", desc: "Fully compliant" },
            { icon: Trash2, title: "Your Control", desc: "Delete anytime" }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <item.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-400" />
              1. Information We Collect
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Information</h3>
                <ul className="list-disc pl-6 text-zinc-400 space-y-1">
                  <li>Name and email address (from Google Sign-In)</li>
                  <li>Profile picture (optional)</li>
                  <li>Phone number (if provided for seller verification)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Transaction Information</h3>
                <ul className="list-disc pl-6 text-zinc-400 space-y-1">
                  <li>Purchase history and ticket details</li>
                  <li>Payment method (processed securely via Stripe)</li>
                  <li>Billing address for tax purposes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Automatic Information</h3>
                <ul className="list-disc pl-6 text-zinc-400 space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and language preferences</li>
                  <li>Pages visited and time spent on site</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-400" />
              2. How We Use Your Information
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span><strong className="text-white">Process Transactions:</strong> To complete ticket purchases and deliver digital tickets via QR code.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span><strong className="text-white">Account Management:</strong> To create and maintain your EuroMatchTickets account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span><strong className="text-white">Communication:</strong> To send order confirmations, ticket delivery, and important updates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span><strong className="text-white">Security:</strong> To detect and prevent fraud, unauthorized access, and illegal activities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span><strong className="text-white">Improvement:</strong> To analyze usage patterns and improve our services.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-emerald-400" />
              3. Data Security
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "SSL/TLS Encryption", desc: "All data transmitted between you and our servers is encrypted using 256-bit SSL." },
                { title: "Stripe Payment Processing", desc: "We never store your credit card details. All payments are processed securely by Stripe." },
                { title: "Access Controls", desc: "Only authorized personnel can access personal data, and only when necessary." },
                { title: "Regular Audits", desc: "We conduct regular security audits and vulnerability assessments." }
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-cyan-400" />
              4. Your Rights (GDPR)
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Under the General Data Protection Regulation (GDPR), you have the following rights:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <ul className="space-y-3 text-zinc-400">
                <li><strong className="text-white">Right to Access:</strong> Request a copy of your personal data.</li>
                <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate data.</li>
                <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data.</li>
                <li><strong className="text-white">Right to Portability:</strong> Receive your data in a machine-readable format.</li>
                <li><strong className="text-white">Right to Object:</strong> Object to certain types of data processing.</li>
                <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent at any time.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-purple-400" />
              5. Cookies and Tracking
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                <p className="text-zinc-400 text-sm">Required for site functionality, login sessions, and security.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Analytics Cookies</h3>
                <p className="text-zinc-400 text-sm">Help us understand how visitors use our site (Google Analytics).</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Marketing Cookies</h3>
                <p className="text-zinc-400 text-sm">Used to show relevant ads (Facebook Pixel). You can opt out anytime.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-red-400" />
              6. Data Retention
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We retain your personal data only as long as necessary for the purposes described in this policy:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2 mt-4">
              <li><strong className="text-white">Account Data:</strong> Until you delete your account</li>
              <li><strong className="text-white">Transaction Records:</strong> 7 years (legal requirement)</li>
              <li><strong className="text-white">Analytics Data:</strong> 26 months</li>
              <li><strong className="text-white">Support Correspondence:</strong> 3 years</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-400" />
              7. Contact Us
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              For any privacy-related questions or to exercise your rights, contact our Data Protection Officer:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400">
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:Alkawashoms@gmail.com" className="text-purple-400 hover:underline">
                  Alkawashoms@gmail.com
                </a>
              </p>
              <p className="text-zinc-400 mt-2">
                <strong className="text-white">Address:</strong> Fürstenriederstr. 33, 80686 München, Germany
              </p>
              <p className="text-zinc-400 mt-2">
                <strong className="text-white">Phone:</strong> +49 178 130 4137
              </p>
              <p className="text-zinc-400 mt-4 text-sm">
                We will respond to your request within 30 days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
