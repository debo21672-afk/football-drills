import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700 mb-2">
                Welcome to Football Skills Tracker ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 mb-2">We collect and process the following data:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li><strong>Account Information:</strong> Email address, display name, password (encrypted)</li>
                <li><strong>Training Data:</strong> Exercise scores, session history, progress tracking, streaks</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, device information</li>
                <li><strong>Authentication Data:</strong> Login timestamps, verification status</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-2">We use your data to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Provide and maintain our service</li>
                <li>Track your training progress and statistics</li>
                <li>Send verification emails and service notifications</li>
                <li>Improve and personalize your experience</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Data Storage and Security</h2>
              <p className="text-gray-700 mb-2">
                Your data is stored securely using industry-standard encryption:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Database hosted on Supabase with encryption at rest</li>
                <li>Passwords hashed using bcrypt</li>
                <li>HTTPS encryption for all data in transit</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication required</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Your Rights (GDPR)</h2>
              <p className="text-gray-700 mb-2">Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Data Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="text-gray-700 mt-2">
                You can exercise these rights through your Profile page or by contacting us.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
              <p className="text-gray-700 mb-2">
                We do NOT sell your personal data. We only share data with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li><strong>Service Providers:</strong> Supabase (database), Google (OAuth authentication)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-2">
                We use essential cookies for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Remembering your preferences</li>
              </ul>
              <p className="text-gray-700 mt-2">
                We use privacy-friendly analytics to understand how you use our service and improve it.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
              <p className="text-gray-700 mb-2">
                We retain your data for as long as your account is active. When you delete your account, all personal data is permanently removed within 30 days.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-2">
                Our service is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe we have collected such data, please contact us immediately.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-2">
                We may update this privacy policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have any questions about this Privacy Policy or want to exercise your rights, please contact us at:
              </p>
              <p className="text-gray-700 ml-4">
                <strong>Email:</strong> debo21672@gmail.com
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This privacy policy complies with GDPR (EU), CCPA (California), and other major data protection regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
