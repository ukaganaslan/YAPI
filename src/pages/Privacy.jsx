import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. Data Controller',
    content: 'HealthAI Co-Creation Platform ("HealthAI", "we", "us") is the data controller responsible for your personal data collected through this platform. This Privacy Policy explains how we collect, use, and protect your information in accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws.',
  },
  {
    title: '2. Data We Collect',
    content: null,
    list: [
      'Account information: full name, institutional email address (.edu), role (Engineer or Healthcare Professional), institution, city, country.',
      'Profile information: biography, expertise tags (provided voluntarily).',
      'Project posts: title, description, domain, stage, collaboration details, location.',
      'Meeting requests: messages, proposed time slots, NDA acceptance records.',
      'Usage data: login timestamps, IP addresses (anonymized to first 3 octets), audit events.',
    ],
  },
  {
    title: '3. Legal Basis for Processing',
    content: null,
    list: [
      'Contract performance: processing necessary to provide the platform services you requested.',
      'Legitimate interests: audit logging for platform security and integrity.',
      'Legal obligation: retaining audit logs for compliance purposes (24-month retention).',
      'Consent: optional profile information such as biography and expertise tags.',
    ],
  },
  {
    title: '4. How We Use Your Data',
    content: null,
    list: [
      'To create and manage your account.',
      'To display your project posts to other institutional users.',
      'To facilitate meeting requests between engineers and healthcare professionals.',
      'To maintain security audit logs and detect fraudulent activity.',
      'To respond to support requests.',
    ],
  },
  {
    title: '5. Data Minimization',
    content: 'We only collect data that is strictly necessary for the platform\'s purpose. City and country fields are used solely for geographic matching and are never shared without your consent. Your contact details (email) are never disclosed to other users until you explicitly accept a collaboration request.',
  },
  {
    title: '6. Data Sharing',
    content: 'We do not sell, rent, or share your personal data with third parties for marketing purposes. Data may be shared only: (a) with infrastructure providers under GDPR-compliant data processing agreements; (b) when required by law or court order; (c) with explicit mutual consent in the context of a collaboration.',
  },
  {
    title: '7. Data Retention',
    content: 'Account data is retained for as long as your account is active. Audit logs are automatically deleted after 24 months via a TTL index. When you delete your account, all associated personal data and posts are permanently removed within 30 days.',
  },
  {
    title: '8. Your Rights (GDPR)',
    content: null,
    list: [
      'Right of access: request a copy of your personal data via Profile → Export My Data.',
      'Right to rectification: update your information at any time via the Profile page.',
      'Right to erasure: permanently delete your account and all associated data via Profile → Delete Account.',
      'Right to data portability: download your data in JSON format via Profile → Export My Data.',
      'Right to restrict processing: contact us to request processing restrictions.',
      'Right to object: object to processing based on legitimate interests by contacting us.',
    ],
  },
  {
    title: '9. Security',
    content: 'We implement appropriate technical and organizational measures to protect your data, including: bcrypt password hashing (cost factor 12), JWT-based session management, rate limiting on authentication endpoints, HTTPS in production, and role-based access controls. Sessions automatically expire after 30 minutes of inactivity.',
  },
  {
    title: '10. Cookies',
    content: 'HealthAI does not use tracking or advertising cookies. Session data is stored in your browser\'s localStorage solely to maintain your authenticated session.',
  },
  {
    title: '11. Contact',
    content: 'For any data protection inquiries, to exercise your rights, or to contact our Data Protection Officer, please reach out via the platform\'s support channel. We will respond to all legitimate requests within 30 days.',
  },
  {
    title: '12. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Material changes will be communicated via the platform. Continued use of HealthAI after changes constitutes acceptance of the updated policy.',
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="mb-10">
          <Link to="/" className="text-blue-600 text-sm font-medium hover:text-blue-700">← Back to Home</Link>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mt-4 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: May 2026 · GDPR & KVKK Compliant</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-blue-800 text-sm leading-relaxed">
            HealthAI is built on a privacy-first principle: your identity and contact details are never shared with other users without your explicit consent. This policy explains exactly how we handle your data.
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
              {section.content && (
                <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
              )}
              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-blue-600 text-sm font-medium hover:text-blue-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
