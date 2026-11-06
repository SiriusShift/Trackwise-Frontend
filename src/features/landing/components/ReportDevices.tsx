// The three downloadable reports shown on three devices: account statement on a laptop,
// credit card statement on a tablet, money flow on a phone.
import CreditStatement from "@/assets/images/credit-report.webp";
import MoneyFlow from "@/assets/images/moneyflow-report.webp";
import StatementReport from "@/assets/images/statement-report.webp";
import { Laptop, Phone, Tablet } from "./DeviceFrames";
import Parallax from "./Parallax";

// Fills each device screen; anything taller than the screen is cropped from the bottom
const screenImage = "h-full w-full object-cover object-top";

const ReportDevices = () => (
  // Bottom padding leaves room for the tablet and phone hanging below the laptop
  <div className="relative pb-[12%]">
    <div className="w-[80%]">
      <Laptop>
        {/* The capture is wider than 16:10, so cover trims the viewer's grey side margins and keeps the page centered */}
        <img
          src={StatementReport}
          alt="Account statement PDF open on a laptop"
          loading="lazy"
          className={screenImage}
        />
      </Laptop>
    </div>

    <Parallax distance={50} className="absolute bottom-0 right-0 w-[32%]">
      <Tablet>
        <img
          src={CreditStatement}
          alt="Credit card statement PDF open on a tablet"
          loading="lazy"
          className={screenImage}
        />
      </Tablet>
    </Parallax>

    <Parallax distance={90} className="absolute bottom-[-2%] left-[6%] w-[16%]">
      <Phone>
        <img
          src={MoneyFlow}
          alt="Money flow report PDF open on a phone"
          loading="lazy"
          className={screenImage}
        />
      </Phone>
    </Parallax>
  </div>
);

export default ReportDevices;
