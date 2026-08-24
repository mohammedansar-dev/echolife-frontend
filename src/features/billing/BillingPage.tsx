import {
  AlertCircle,
  Check,
  CreditCard,
  Download,
  FileText,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import "./BillingPage.css";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "A simple starting point for preserving memories.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "50 memories",
      "Basic memory organization",
      "Daily reflections",
      "Basic family space",
    ],
  },
  {
    id: "family",
    name: "Family",
    description: "More space and features for growing families.",
    monthlyPrice: 199,
    yearlyPrice: 1999,
    popular: true,
    features: [
      "1,000 memories",
      "Time capsules",
      "Family sharing",
      "AI Persona",
      "Advanced reflections",
    ],
  },
  {
    id: "legacy",
    name: "Legacy",
    description: "A complete space for preserving your family story.",
    monthlyPrice: 399,
    yearlyPrice: 3999,
    features: [
      "Unlimited memories",
      "Advanced Time Capsules",
      "Family & Legacy",
      "AI Persona",
      "Priority features",
    ],
  },
];

const invoices: Invoice[] = [
  {
    id: "INV-2026-08",
    date: "Aug 01, 2026",
    description: "EchoLife Family Plan",
    amount: "₹199",
    status: "Paid",
  },
  {
    id: "INV-2026-07",
    date: "Jul 01, 2026",
    description: "EchoLife Family Plan",
    amount: "₹199",
    status: "Paid",
  },
  {
    id: "INV-2026-06",
    date: "Jun 01, 2026",
    description: "EchoLife Family Plan",
    amount: "₹199",
    status: "Paid",
  },
];

function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const [currentPlan, setCurrentPlan] = useState("family");

  const [showCancel, setShowCancel] = useState(false);

  const [showPayment, setShowPayment] = useState(false);

  const [paymentUpdated, setPaymentUpdated] = useState(false);

  const [showPlanMessage, setShowPlanMessage] = useState(false);

  const selectedPlan =
    plans.find((plan) => plan.id === currentPlan) ?? plans[1];

  const monthlyEquivalent =
    selectedPlan.yearlyPrice > 0
      ? Math.round(selectedPlan.yearlyPrice / 12)
      : 0;

  const yearlySavings =
    selectedPlan.monthlyPrice > 0
      ? selectedPlan.monthlyPrice * 12 - selectedPlan.yearlyPrice
      : 0;

  const handlePlanChange = (planId: string) => {
    if (planId === currentPlan) {
      return;
    }

    setCurrentPlan(planId);
    setShowPlanMessage(true);

    window.setTimeout(() => {
      setShowPlanMessage(false);
    }, 1800);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const content = [
      "ECHOLIFE",
      "Family Memory Platform",
      "",
      "Invoice",
      "--------------------------------",
      `Invoice: ${invoice.id}`,
      `Date: ${invoice.date}`,
      `Description: ${invoice.description}`,
      `Amount: ${invoice.amount}`,
      `Status: ${invoice.status}`,
      "",
      "Thank you for using EchoLife.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${invoice.id}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePaymentUpdate = () => {
    setShowPayment(false);
    setPaymentUpdated(true);

    window.setTimeout(() => {
      setPaymentUpdated(false);
    }, 2000);
  };

  return (
    <main className="billing-page">
      {/* HEADER */}

      <header className="billing-header">
        <div>
          <span className="billing-eyebrow">ACCOUNT BILLING</span>

          <h1>Billing</h1>

          <p>Manage your EchoLife plan, payment method, and billing history.</p>
        </div>

        <div className="billing-security">
          <ShieldCheck size={15} />
          Secure billing
        </div>
      </header>

      {/* SUCCESS MESSAGES */}

      {paymentUpdated && (
        <div className="billing-toast">
          <Check size={13} />
          Payment method updated successfully.
        </div>
      )}

      {showPlanMessage && (
        <div className="billing-toast">
          <Check size={13} />
          Plan selection updated.
        </div>
      )}

      {/* CURRENT PLAN */}

      <section className="billing-current-card">
        <div className="billing-current-main">
          <div className="billing-plan-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <span>CURRENT PLAN</span>

            <h2>EchoLife {selectedPlan.name}</h2>

            <p>Your plan is active and ready to use.</p>
          </div>
        </div>

        <div className="billing-current-price">
          <strong>
            ₹
            {billingCycle === "monthly"
              ? selectedPlan.monthlyPrice
              : monthlyEquivalent}
          </strong>

          <span>/ month</span>
        </div>
      </section>

      {/* PLANS */}

      <section className="billing-section">
        <div className="billing-section-header">
          <div>
            <span>PLANS</span>

            <h2>Choose the right space for your family</h2>

            <p>Upgrade or change your plan whenever you need.</p>
          </div>

          <div className="billing-cycle">
            <button
              type="button"
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>

            <button
              type="button"
              className={billingCycle === "yearly" ? "active" : ""}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <small>Save</small>
            </button>
          </div>
        </div>

        {billingCycle === "yearly" && yearlySavings > 0 && (
          <div className="billing-saving-banner">
            <Check size={12} />

            <span>
              Save ₹{yearlySavings} per year with the{" "}
              <strong>{selectedPlan.name}</strong> annual plan.
            </span>
          </div>
        )}

        <div className="billing-plans">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;

            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <article
                key={plan.id}
                className={`billing-plan ${isCurrent ? "current" : ""}`}
              >
                {plan.popular && (
                  <span className="billing-popular">Most popular</span>
                )}

                <div className="billing-plan-top">
                  <h3>{plan.name}</h3>

                  <p>{plan.description}</p>
                </div>

                <div className="billing-plan-price">
                  <strong>₹{price}</strong>

                  <span>/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>

                {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                  <div className="billing-plan-saving">
                    Save ₹{plan.monthlyPrice * 12 - plan.yearlyPrice}
                    /year
                  </div>
                )}

                <div className="billing-plan-features">
                  {plan.features.map((feature) => (
                    <div key={feature}>
                      <Check size={13} />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={
                    isCurrent
                      ? "billing-plan-button current-button"
                      : "billing-plan-button"
                  }
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? "Current plan"
                    : plan.id === "free"
                      ? "Switch to Free"
                      : "Choose plan"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* PAYMENT + USAGE */}

      <section className="billing-two-column">
        {/* PAYMENT */}

        <article className="billing-card">
          <div className="billing-card-header">
            <div>
              <span>PAYMENT METHOD</span>

              <h2>Payment method</h2>
            </div>

            <CreditCard size={17} />
          </div>

          <div className="billing-payment">
            <div className="billing-card-symbol">
              <CreditCard size={17} />
            </div>

            <div className="billing-payment-details">
              <strong>Visa ending in 4242</strong>

              <span>Expires 12/28</span>
            </div>

            <span className="billing-default">Default</span>
          </div>

          <button
            type="button"
            className="billing-outline-button"
            onClick={() => setShowPayment(true)}
          >
            Update payment method
          </button>
        </article>

        {/* USAGE */}

        <article className="billing-card">
          <div className="billing-card-header">
            <div>
              <span>CURRENT USAGE</span>

              <h2>Memory storage</h2>
            </div>

            <FileText size={17} />
          </div>

          <div className="billing-usage">
            <div className="billing-usage-heading">
              <strong>31 / 1,000</strong>

              <span>memories</span>
            </div>

            <div className="billing-usage-bar">
              <div
                style={{
                  width: "3.1%",
                }}
              />
            </div>

            <p>
              You are currently using 3.1% of your Family plan memory allowance.
            </p>
          </div>
        </article>
      </section>

      {/* BILLING HISTORY */}

      <section className="billing-history">
        <div className="billing-section-header">
          <div>
            <span>BILLING HISTORY</span>

            <h2>Recent invoices</h2>

            <p>View and download your previous invoices.</p>
          </div>
        </div>

        <div className="billing-table">
          <div className="billing-table-header">
            <span>Invoice</span>

            <span>Date</span>

            <span>Description</span>

            <span>Amount</span>

            <span>Status</span>

            <span />
          </div>

          {invoices.map((invoice) => (
            <div key={invoice.id} className="billing-table-row">
              <strong>{invoice.id}</strong>

              <span>{invoice.date}</span>

              <span>{invoice.description}</span>

              <strong>{invoice.amount}</strong>

              <span className="billing-paid">{invoice.status}</span>

              <button
                type="button"
                className="billing-download"
                onClick={() => handleDownloadInvoice(invoice)}
                aria-label={`Download ${invoice.id}`}
              >
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CANCELLATION */}

      <section className="billing-danger">
        <div>
          <div className="billing-danger-icon">
            <AlertCircle size={16} />
          </div>

          <div>
            <h2>Cancel subscription</h2>

            <p>
              Canceling your subscription may remove access to premium EchoLife
              features after the current billing period.
            </p>
          </div>
        </div>

        <button type="button" onClick={() => setShowCancel(true)}>
          Cancel plan
        </button>
      </section>

      {/* PAYMENT MODAL */}

      {showPayment && (
        <div
          className="billing-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowPayment(false);
            }
          }}
        >
          <div className="billing-modal">
            <button
              type="button"
              className="billing-modal-close"
              onClick={() => setShowPayment(false)}
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="billing-modal-icon payment-icon">
              <CreditCard size={20} />
            </div>

            <h2>Update payment method</h2>

            <p>
              This frontend version uses a mock payment form. Real payment
              processing will be connected through the backend.
            </p>

            <label className="billing-field">
              Card number
              <input
                type="text"
                defaultValue="4242 4242 4242 4242"
                placeholder="Card number"
              />
            </label>

            <div className="billing-field-grid">
              <label className="billing-field">
                Expiry
                <input type="text" defaultValue="12/28" placeholder="MM/YY" />
              </label>

              <label className="billing-field">
                CVC
                <input type="password" defaultValue="123" placeholder="CVC" />
              </label>
            </div>

            <div className="billing-modal-actions">
              <button
                type="button"
                className="billing-modal-secondary"
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="billing-modal-primary"
                onClick={handlePaymentUpdate}
              >
                Save payment method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}

      {showCancel && (
        <div
          className="billing-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCancel(false);
            }
          }}
        >
          <div className="billing-modal">
            <button
              type="button"
              className="billing-modal-close"
              onClick={() => setShowCancel(false)}
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="billing-modal-icon">
              <AlertCircle size={20} />
            </div>

            <h2>Cancel your plan?</h2>

            <p>
              Your current plan will remain active until the end of the billing
              period. This frontend version does not make real billing changes.
            </p>

            <div className="billing-modal-actions">
              <button
                type="button"
                className="billing-modal-secondary"
                onClick={() => setShowCancel(false)}
              >
                Keep plan
              </button>

              <button
                type="button"
                className="billing-modal-danger"
                onClick={() => setShowCancel(false)}
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BillingPage;
