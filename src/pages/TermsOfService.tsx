import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-2">
                By accessing or using Football Skills Tracker ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-gray-700 mb-2">
                Football Skills Tracker is a web-based application that helps users track and improve their football skills through exercises, progress monitoring, and performance analytics.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-gray-700 mb-2">To use the Service, you must:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Be at least 13 years of age</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password</li>
                <li>Verify your email address</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="text-gray-700 mt-2">
                You may not share your account credentials or allow others to access your account.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-2">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Submit false or misleading information</li>
                <li>Attempt to manipulate or falsify scores and statistics</li>
                <li>Use automated tools to access the Service (bots, scrapers)</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-2">
                The Service, including all content, features, and functionality, is owned by Football Skills Tracker and protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Your Content:</strong> You retain ownership of the data you create (scores, progress). We may use anonymized, aggregated data for service improvement.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Service Availability</h2>
              <p className="text-gray-700 mb-2">
                We strive to provide reliable service, but we do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Uninterrupted or error-free operation</li>
                <li>Freedom from viruses or harmful components</li>
                <li>Accuracy or reliability of information</li>
              </ul>
              <p className="text-gray-700 mt-2">
                We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Data and Privacy</h2>
              <p className="text-gray-700 mb-2">
                Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to our collection and use of personal data as outlined in the Privacy Policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p className="text-gray-700 mb-2">
                We may terminate or suspend your account immediately, without prior notice, if you:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                <li>Breach these Terms of Service</li>
                <li>Engage in prohibited activities</li>
                <li>Provide false information</li>
              </ul>
              <p className="text-gray-700 mt-2">
                You may terminate your account at any time through the Profile page.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">9. Disclaimers</h2>
              <p className="text-gray-700 mb-2">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Health Disclaimer:</strong> This Service is for training tracking purposes only. Always warm up properly and consult a healthcare professional before starting any exercise program.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOOTBALL SKILLS TRACKER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">11. Indemnification</h2>
              <p className="text-gray-700 mb-2">
                You agree to indemnify and hold harmless Football Skills Tracker from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-2">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
              <p className="text-gray-700 mb-2">
                These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
              <p className="text-gray-700 mb-2">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 ml-4">
                <strong>Email:</strong> debo21672@gmail.com
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                <strong>Beta Service:</strong> This Service is currently in beta. Features may change, and we appreciate your feedback to help us improve.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
