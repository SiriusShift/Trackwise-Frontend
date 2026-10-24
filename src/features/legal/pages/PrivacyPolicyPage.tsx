import { usePageMeta } from "@/shared/hooks/usePageMeta";
import { Link } from "react-router-dom";
import LegalLayout, { LegalSection } from "../components/LegalLayout";
import { LEGAL_CONTACT_EMAIL } from "../constants";

const mailto = <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We only collect what you give us and what we need to run the service:</p>
        <ul>
          <li>
            <strong>Account details:</strong> your first and last name, username, email
            address, and password. Passwords are hashed before they are stored, so we
            never see them in plain text. You can also add a phone number and a profile
            photo.
          </li>
          <li>
            <strong>Google sign-in:</strong> if you sign up with Google, we receive your
            name, email address, and Google account ID. We never receive your Google
            password.
          </li>
          <li>
            <strong>Financial records you enter:</strong> accounts, credit cards,
            expenses, income, transfers, installments, recurring schedules, categories,
            budgets, savings goals, notes, and any receipt images you attach.
          </li>
          <li>
            <strong>Preferences:</strong> your currency, timezone, time format, theme,
            and notification settings.
          </li>
          <li>
            <strong>Technical data:</strong> session cookies that keep you signed in, and
            standard server logs such as IP address, browser type, and request times.
          </li>
        </ul>
        <p>
          Trackwise does not connect to your bank or e-wallet and never asks for those
          credentials.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <ul>
        <li>To create your account and sign you in.</li>
        <li>To store, calculate, and show your transactions, balances, and statements.</li>
        <li>
          To send emails you need, such as verification codes, password resets, and
          reminders for scheduled payments you set up.
        </li>
        <li>To keep the service secure, prevent abuse, and fix problems.</li>
      </ul>
    ),
  },
  {
    id: "what-we-dont-do",
    title: "What we don't do",
    body: (
      <ul>
        <li>We don't sell or rent your personal or financial information.</li>
        <li>We don't show ads or share your data with advertisers.</li>
        <li>We don't use your financial records to build marketing profiles.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We share data only with service providers that help us run Trackwise, and only
          what they need to do that job:
        </p>
        <ul>
          <li>Hosting and database providers that run the app and store your data.</li>
          <li>Amazon Web Services (S3), which stores profile photos and receipt images.</li>
          <li>Email delivery providers, which send verification and reminder emails.</li>
          <li>Google, when you choose to sign in with Google.</li>
        </ul>
        <p>
          We may also disclose information if the law requires it, or to protect the
          rights, safety, or security of our users or the service.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We use secure, HTTP-only cookies to keep you signed in and to protect your
        session. They are required for the app to work. We don't use advertising or
        third-party tracking cookies.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        Data is sent over encrypted HTTPS connections. Passwords are hashed, sessions use
        secure cookies, and sensitive actions like password resets are rate limited. No
        system is perfectly secure, so please use a strong, unique password and keep it to
        yourself.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep your data while your account is open. If you ask us to delete your
        account, we delete your account and financial records, except for anything we
        must keep by law. Copies in backups are removed as the backups expire.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    body: (
      <>
        <ul>
          <li>
            <strong>Access and update:</strong> view and edit your profile, preferences,
            and records in the app at any time.
          </li>
          <li>
            <strong>Export:</strong> download statements as PDF, or export transactions
            as Excel or CSV.
          </li>
          <li>
            <strong>Notifications:</strong> turn reminder emails on or off in your
            notification settings.
          </li>
          <li>
            <strong>Deletion:</strong> email us at {mailto} from your account's email
            address to have your account and data deleted.
          </li>
        </ul>
        <p>
          Depending on where you live, you may have more rights, such as the right to
          object to or restrict some processing. Contact us and we will respond within the
          time the law allows.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Trackwise is not meant for children under 13, and we don't knowingly collect
        their information. If you think a child has created an account, contact us and we
        will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. When we make a material change, we
        will update the date at the top of this page and, where appropriate, let you know
        by email or in the app.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about this policy or your data? Email {mailto}. See also our{" "}
        <Link to="/terms">Terms of Service</Link>.
      </p>
    ),
  },
];

const PrivacyPolicyPage = () => {
  usePageMeta({
    title: "Privacy Policy | Trackwise",
    description:
      "How Trackwise collects, uses, and protects your account and financial information.",
  });

  return (
    <LegalLayout
      title="Privacy Policy"
      intro={
        <p>
          This policy explains what information Trackwise collects, how we use it, and the
          choices you have. By using Trackwise you agree to the practices described here.
        </p>
      }
      sections={sections}
    />
  );
};

export default PrivacyPolicyPage;
