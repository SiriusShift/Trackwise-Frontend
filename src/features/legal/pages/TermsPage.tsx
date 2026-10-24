import { usePageMeta } from "@/shared/hooks/usePageMeta";
import { Link } from "react-router-dom";
import LegalLayout, { LegalSection } from "../components/LegalLayout";
import { LEGAL_CONTACT_EMAIL } from "../constants";

const mailto = <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: "the-service",
    title: "The service",
    body: (
      <p>
        Trackwise is a personal finance tracker. You record your own accounts, credit
        cards, expenses, income, and transfers, and Trackwise organizes them into
        balances, schedules, reminders, and statements. Trackwise does not connect to
        banks, move money, or hold funds on your behalf.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <p>
        You must be at least 13 years old to use Trackwise. If you are under the age of
        majority where you live, you may only use Trackwise with the permission of a
        parent or guardian.
      </p>
    ),
  },
  {
    id: "your-account",
    title: "Your account",
    body: (
      <ul>
        <li>Give accurate information when you sign up and keep it up to date.</li>
        <li>
          Keep your password secure. You are responsible for activity on your account.
        </li>
        <li>
          Tell us right away at {mailto} if you think someone else has accessed your
          account.
        </li>
        <li>One person per account. Don't share or sell accounts.</li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using Trackwise, you agree not to:</p>
        <ul>
          <li>Break any law or use the service for fraud or money laundering.</li>
          <li>Upload malware, illegal content, or content you have no right to share.</li>
          <li>
            Try to access other users' data, probe or attack our systems, or get around
            security measures or rate limits.
          </li>
          <li>
            Scrape, overload, or disrupt the service, or use it to send spam.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-data",
    title: "Your data",
    body: (
      <p>
        You own the information you put into Trackwise. You give us permission to store,
        process, and display it only so we can provide the service to you. How we handle
        it is described in our <Link to="/privacy">Privacy Policy</Link>. You can export
        your data at any time.
      </p>
    ),
  },
  {
    id: "not-financial-advice",
    title: "Not financial advice",
    body: (
      <p>
        Trackwise is a record-keeping tool. Balances, statements, interest, installment,
        and due date figures are calculated from what you enter and may not match your
        bank or card issuer exactly. Always check important figures against your official
        statements. Nothing in Trackwise is financial, tax, or legal advice.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Availability and changes",
    body: (
      <p>
        We work to keep Trackwise running and your data safe, but we can't promise the
        service will always be available or error free. Reminders and emails may be
        delayed or fail, so don't rely on them alone to make payments on time. We may
        change, add, or remove features over time.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Ending your account",
    body: (
      <p>
        You can stop using Trackwise at any time and ask us to delete your account by
        emailing {mailto}. We may suspend or close accounts that break these terms or put
        the service or other users at risk. Export your data first if you want to keep a
        copy.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimers and liability",
    body: (
      <>
        <p>
          Trackwise is provided "as is" and "as available", without warranties of any
          kind, to the fullest extent the law allows.
        </p>
        <p>
          To the fullest extent the law allows, Trackwise and its operators are not liable
          for indirect, incidental, or consequential losses, including missed payments,
          late fees, interest charges, or lost data, arising from your use of the service.
          Nothing in these terms limits liability that cannot be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. When we make a material change, we
        will update the date at the top of this page and, where appropriate, let you know
        by email or in the app. If you keep using Trackwise after a change, you accept
        the updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: <p>Questions about these terms? Email {mailto}.</p>,
  },
];

const TermsPage = () => {
  usePageMeta({
    title: "Terms of Service | Trackwise",
    description: "The terms that apply when you create an account and use Trackwise.",
  });

  return (
    <LegalLayout
      title="Terms of Service"
      intro={
        <p>
          These terms apply when you create an account or use Trackwise. By signing up,
          you agree to these terms and to our{" "}
          <Link
            to="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          . If you don't agree, please don't use Trackwise.
        </p>
      }
      sections={sections}
    />
  );
};

export default TermsPage;
