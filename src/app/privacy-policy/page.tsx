
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1 className="font-headline">Privacy Policy</h1>
          <p className="lead">
            Your privacy is important to us. It is TripsandStay's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            Log data: When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
          </p>
          <p>
            Personal Information: We may ask for personal information, such as your: Name, Email, Date of birth, Phone/mobile number, Home/Mailing address.
          </p>

          <h2>2. Legal Bases for Processing</h2>
          <p>
            We will process your personal information lawfully, fairly and in a transparent manner. We collect and process information about you only where we have legal bases for doing so.
          </p>

          <h2>3. Security of Your Personal Information</h2>
          <p>
            When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>

          <h2>4. How Long We Keep Your Personal Information</h2>
          <p>
            We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy.
          </p>

          <h2>5. Children’s Privacy</h2>
          <p>
            This website does not knowingly target children under the age of 13, and we do not knowingly collect personal information from children under 13.
          </p>
          
          <h2>6. Your Rights and Controlling Your Personal Information</h2>
          <p>
            You always retain the right to withhold personal information from us, with the understanding that your experience of our website may be affected. We will not discriminate against you for exercising any of your rights over your personal information.
          </p>
          
           <h2>7. Contact Us</h2>
          <p>
            For any questions or concerns regarding your privacy, you may contact us using the details on our <a href="/contact-us">Contact Us</a> page.
          </p>

          <p><small>This policy is effective as of 1 August 2024.</small></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
