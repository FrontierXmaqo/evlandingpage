"use client";

import { useMemo, useState } from "react";

type ChargeTime = "day" | "night" | "mixed";

const CHARGE_OPTIONS: { key: ChargeTime; label: string; offsetRate: number; note: string }[] = [
  {
    key: "day",
    label: "Mostly during the day",
    offsetRate: 0.8,
    note: "Panels alone usually cover this — your charging lines up with solar generation.",
  },
  {
    key: "night",
    label: "Mostly at night",
    offsetRate: 0.9,
    note: "We'd recommend battery storage so today's solar covers tonight's charging.",
  },
  {
    key: "mixed",
    label: "Mixed / it varies",
    offsetRate: 0.85,
    note: "A mid-size battery is usually worth it to smooth out the difference.",
  },
];

const FAQS = [
  {
    q: "Can solar actually power my EV charger?",
    a: "Yes. Your solar system feeds the same home electrical panel your EV charger is connected to. During the day, charging draws from solar generation first; with NEM, any home charging at night is offset against solar you exported earlier.",
  },
  {
    q: "Do I need a bigger system because I own an EV?",
    a: "Usually, yes — we size the system around your household load plus your typical charging pattern, not just your current TNB bill, so the assessment asks when you usually charge.",
  },
  {
    q: "Will this work with my home EV charger brand?",
    a: "Our hybrid inverters and wiring are compatible with standard AC home chargers used in Malaysia. We confirm your charger's spec during the site assessment.",
  },
  {
    q: "Do I need a battery, or is panels-only enough?",
    a: "Panels-only works well if you charge mostly during the day. If you mainly charge overnight, a battery lets you store daytime solar and use it for charging after dark instead of relying on NEM offset alone.",
  },
  {
    q: "How long does installation take?",
    a: "Most residential installations take 1–3 days, carried out by our in-house licensed team with minimal disruption to your driveway or charging routine.",
  },
  {
    q: "Is MAQO licensed to install solar in Malaysia?",
    a: "Yes — ST Class A and CIDB G7 certified, SEDA registered, and ISO 9001:2015 quality managed, with in-house licensed wiremen and chargemen.",
  },
];

export default function Page() {
  const [bill, setBill] = useState(650);
  const [chargeTime, setChargeTime] = useState<ChargeTime>("night");
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const selected = CHARGE_OPTIONS.find((c) => c.key === chargeTime)!;

  const results = useMemo(() => {
    const totalKwh = bill / 0.44;
    const systemKwp = Math.max(4, (totalKwh / 1463) * 14.3);
    const panels = Math.round(systemKwp / 0.65);
    const monthlySavings = bill * selected.offsetRate;
    const newBill = Math.max(15, bill - monthlySavings);
    return {
      systemKwp: systemKwp.toFixed(1),
      panels,
      monthlySavings: Math.round(monthlySavings),
      newBill: Math.round(newBill),
      tenYear: Math.round(monthlySavings * 120),
      thirtyYear: Math.round(monthlySavings * 360),
    };
  }, [bill, selected]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: wire this into your submitLead Server Action / Supabase insert.
  }

  return (
    <>
      <header>
        <div className="wrap nav">
          <div className="brand">
            <div className="brand-mark">M</div>
            <div>
              MAQO ATAP<span className="brand-sub">Solar for EV homes</span>
            </div>
          </div>
          <div className="nav-actions">
            <a className="btn btn-ghost" href="https://wa.me/60123220816">
              WhatsApp
            </a>
            <a className="btn btn-amber" href="#assessment">
              Free Assessment
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">MAQO ATAP · Built for EV-owning homes</div>
              <h1>
                Your EV runs on electricity. <span className="flip">Stop</span>
                <br />
                buying it all from TNB.
              </h1>
              <p className="lede">
                Charging overnight already lifted your TNB bill. Add rooftop
                solar under NEM and you generate the power your car uses
                instead of paying peak rates for it — free home assessment,
                ST Class A &amp; CIDB G7-certified installation.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-amber" href="#assessment">
                  Get My Free Assessment
                </a>
                <a className="btn btn-ghost" href="#calculator">
                  See My Savings
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <b>90%</b>
                  <span>Max TNB bill reduction</span>
                </div>
                <div className="stat">
                  <b>1,000+</b>
                  <span>Malaysian homes powered since 2013</span>
                </div>
                <div className="stat">
                  <b>1–3 days</b>
                  <span>Typical installation time</span>
                </div>
              </div>
            </div>

            <div className="flow-card">
              <h4>Where your EV&apos;s electrons come from</h4>
              <svg viewBox="0 0 320 220" width="100%" height="220" aria-hidden="true">
                <path
                  id="flowPath"
                  className="flow-path"
                  d="M40,40 C120,40 100,110 160,110 C220,110 200,180 280,180"
                />
                <circle className="flow-node" cx="40" cy="40" r="20" />
                <text className="flow-label" x="40" y="20" textAnchor="middle">
                  Sun
                </text>
                <circle className="flow-node" cx="160" cy="110" r="20" />
                <text className="flow-label" x="160" y="90" textAnchor="middle">
                  Rooftop panels
                </text>
                <circle className="flow-node" cx="280" cy="180" r="20" />
                <text className="flow-label" x="280" y="205" textAnchor="middle">
                  EV charger
                </text>
                <circle
                  className="flow-dot"
                  r="5"
                  style={
                    {
                      offsetPath:
                        "path('M40,40 C120,40 100,110 160,110 C220,110 200,180 280,180')",
                    } as React.CSSProperties
                  }
                />
              </svg>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* PROBLEM */}
        <section id="the-problem">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">The EV tax on your TNB bill</div>
              <h2>Home charging is the single biggest jump on an EV owner&apos;s bill</h2>
              <p>
                A typical EV adds 150–300 kWh of home charging a month on top
                of normal household use — usually pushing families into
                TNB&apos;s highest tiered rate. Solar offsets exactly that
                extra load.
              </p>
            </div>
            <div className="compare">
              <div className="bill-card before">
                <span className="bill-tag before">Before solar</span>
                <div className="bill-amount">RM 612</div>
                <div className="bill-bar-track">
                  <span className="bill-bar-fill" />
                </div>
                <p className="bill-note">
                  Household use + nightly EV charging, billed at TNB&apos;s
                  tiered peak rate.
                </p>
              </div>
              <div className="bill-card after">
                <span className="bill-tag after">After solar (NEM)</span>
                <div className="bill-amount">RM 78</div>
                <div className="bill-bar-track">
                  <span className="bill-bar-fill" />
                </div>
                <p className="bill-note">
                  Solar generation offsets daytime use and battery-stored
                  charging at night.
                </p>
              </div>
              <div className="compare-arrow">
                Illustrative example, based on a 14 kWp system sized for an EV
                household →
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Solar + EV calculator</div>
              <h2>Size a system around your car, not just your house</h2>
              <p>
                Tell us your current TNB bill and when you usually charge at
                home. We&apos;ll estimate the system size and what
                you&apos;d save.
              </p>
            </div>
            <div className="calc-panel">
              <div>
                <div className="field">
                  <label htmlFor="billRange">
                    Average monthly TNB bill (RM)
                  </label>
                  <input
                    type="range"
                    id="billRange"
                    min={150}
                    max={1800}
                    step={10}
                    value={bill}
                    onChange={(e) => setBill(Number(e.target.value))}
                  />
                  <div className="range-val">RM {bill}</div>
                </div>
                <div className="field">
                  <label>When do you usually charge your car?</label>
                  <div className="toggle-row">
                    {CHARGE_OPTIONS.map((opt) => (
                      <div
                        key={opt.key}
                        className={
                          "toggle-opt" + (chargeTime === opt.key ? " active" : "")
                        }
                        role="button"
                        tabIndex={0}
                        onClick={() => setChargeTime(opt.key)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setChargeTime(opt.key)
                        }
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="calc-results">
                <h4>Based on RM{bill}/month, charging {selected.label.toLowerCase()}</h4>
                <p className="calc-note">{selected.note}</p>
                <div className="res-grid">
                  <div className="res-item">
                    <b>{results.systemKwp} kWp</b>
                    <span>Recommended system size</span>
                  </div>
                  <div className="res-item">
                    <b>{results.panels}</b>
                    <span>Estimated panels</span>
                  </div>
                  <div className="res-item highlight">
                    <b>RM {results.monthlySavings.toLocaleString()}</b>
                    <span>Estimated monthly savings</span>
                  </div>
                  <div className="res-item">
                    <b>RM {results.newBill.toLocaleString()}</b>
                    <span>Estimated new TNB bill</span>
                  </div>
                </div>
                <div className="res-long">
                  <div>
                    <b>RM {results.tenYear.toLocaleString()}</b>
                    <span>Saved over 10 years</span>
                  </div>
                  <div>
                    <b>RM {results.thirtyYear.toLocaleString()}</b>
                    <span>Saved over 30 years</span>
                  </div>
                </div>
                <a className="btn btn-blue" href="#assessment" style={{ marginTop: 22 }}>
                  Get My Exact ROI
                </a>
                <p className="calc-disclaimer">
                  Estimate only. Actual system size, savings and pricing
                  depend on real consumption, charger schedule, roof space,
                  shading and a full site assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">How it works</div>
              <h2>From TNB bill to charging on sunlight</h2>
            </div>
            <ol className="steps">
              <li className="step">
                <span className="step-num">01</span>
                <div>
                  <h3>Free assessment, EV included</h3>
                  <p>
                    We review your TNB bill, roof, and your charging habits to
                    size a system that covers your car, not just your
                    household.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step-num">02</span>
                <div>
                  <h3>Pick your package</h3>
                  <p>
                    Outright purchase or instalments, with or without battery
                    storage. We handle the TNB NEM/ATAP application on your
                    behalf.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step-num">03</span>
                <div>
                  <h3>Installation in 1–3 days</h3>
                  <p>
                    Our CIDB G7-certified in-house team installs panels,
                    inverter, and — if selected — battery, with minimal
                    disruption to your driveway or charger.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step-num">04</span>
                <div>
                  <h3>TNB inspection &amp; smart meter</h3>
                  <p>
                    TNB inspects the system and upgrades your meter so
                    exported solar and offset EV charging are correctly
                    recorded.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step-num">05</span>
                <div>
                  <h3>Charge, monitor, save</h3>
                  <p>
                    Track generation and EV charging load side by side in the
                    app, backed by ongoing MAQO after-sales support.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <hr className="divider" />

        {/* INCLUDED */}
        <section id="included">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">What&apos;s covered</div>
              <h2>Everything an EV household needs</h2>
            </div>
            <div className="included">
              <div>
                <b>Solar panels</b>
                <span>Tier-1 panels from AIKO, Huawei, FoxESS — sized for EV load.</span>
              </div>
              <div>
                <b>Hybrid inverter</b>
                <span>Handles simultaneous home use and EV charging draw.</span>
              </div>
              <div>
                <b>Optional battery</b>
                <span>Store daytime solar for night-time charging.</span>
              </div>
              <div>
                <b>Real-time monitoring app</b>
                <span>See generation vs. charging consumption side by side.</span>
              </div>
              <div>
                <b>Scheduled maintenance</b>
                <span>Routine checks to keep output at spec.</span>
              </div>
              <div>
                <b>Dedicated support</b>
                <span>One team from SEDA approval to NEM meter.</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* TESTIMONIALS */}
        <section id="stories" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">EV owners on ATAP</div>
              <h2>Households already charging on their own power</h2>
            </div>
            <div className="testimonials">
              <div className="tcard">
                <span className="ev-tag">EV owner · Subang Jaya</span>
                <p>
                  &ldquo;Our bill used to spike every month once we started
                  charging at home. Since the panels went up, most of that
                  charging is basically free during the day.&rdquo;
                </p>
                <footer>Residential ATAP customer</footer>
              </div>
              <div className="tcard">
                <span className="ev-tag">EV owner · Shah Alam</span>
                <p>
                  &ldquo;The team asked about our charger and driving pattern
                  before sizing anything — it wasn&apos;t a generic package,
                  it was built around how much we actually charge.&rdquo;
                </p>
                <footer>Residential ATAP customer</footer>
              </div>
              <div className="tcard">
                <span className="ev-tag">EV owner · Kajang</span>
                <p>
                  &ldquo;With the battery add-on we charge overnight from
                  stored solar instead of the grid. The app makes it easy to
                  see exactly how much we&apos;re offsetting.&rdquo;
                </p>
                <footer>Residential ATAP customer</footer>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">FAQ</div>
              <h2>What EV owners ask us</h2>
            </div>
            <div id="faqList">
              {FAQS.map((item, i) => (
                <div
                  key={item.q}
                  className={"faq-item" + (openFaq === i ? " open" : "")}
                >
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                  >
                    {item.q}
                    <span className="plus">+</span>
                  </button>
                  <div
                    className="faq-a"
                    style={{ maxHeight: openFaq === i ? 240 : 0 }}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FORM */}
      <section className="form-section" id="assessment">
        <div className="wrap form-grid" style={{ padding: "64px 0" }}>
          <div>
            <div className="eyebrow">Free home assessment</div>
            <h2>See what solar does to your TNB bill</h2>
            <p>
              Takes about 60 seconds. Our ATAP team calls you within 1
              business day with a system sized around your home and your EV.
            </p>
            <ul className="form-points">
              <li>No obligation, no hidden costs on your quote</li>
              <li>We handle your TNB NEM / ATAP application</li>
              <li>Sized around your actual EV charging pattern</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="fname">Full name *</label>
                <input id="fname" required />
              </div>
              <div className="field">
                <label htmlFor="fphone">Mobile / WhatsApp *</label>
                <input id="fphone" required />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="femail">Email</label>
                <input id="femail" type="email" />
              </div>
              <div className="field">
                <label htmlFor="fstate">State *</label>
                <select id="fstate" required defaultValue="">
                  <option value="" disabled>
                    Select state
                  </option>
                  <option>Selangor</option>
                  <option>Kuala Lumpur</option>
                  <option>Putrajaya</option>
                  <option>Negeri Sembilan</option>
                  <option>Melaka</option>
                  <option>Johor</option>
                  <option>Perak</option>
                  <option>Penang</option>
                  <option>Kedah</option>
                  <option>Pahang</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="fbill">Average monthly TNB bill *</label>
                <select id="fbill" required defaultValue="">
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>Below RM250</option>
                  <option>RM250–500</option>
                  <option>RM500–800</option>
                  <option>RM800–1,500</option>
                  <option>Above RM1,500</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="fev">When do you usually charge? *</label>
                <select id="fev" required defaultValue="">
                  <option value="" disabled>
                    Select option
                  </option>
                  <option>Mostly during the day</option>
                  <option>Mostly at night</option>
                  <option>Mixed / it varies</option>
                  <option>Planning to buy an EV soon</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="fprop">Property type *</label>
                <select id="fprop" required defaultValue="">
                  <option value="" disabled>
                    Select type
                  </option>
                  <option>Terrace / Link house</option>
                  <option>Semi-detached</option>
                  <option>Bungalow</option>
                  <option>Apartment / Condo (landed access)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="flang">Preferred language</label>
                <select id="flang" defaultValue="English">
                  <option>English</option>
                  <option>Chinese</option>
                  <option>Malay</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-amber"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {submitted ? "Request received" : "Get My Free Home Assessment"}
            </button>
            <p className="form-legal">
              By submitting, you agree to be contacted by MAQO Engineering
              Sdn Bhd about your solar assessment. No spam.
            </p>
            {submitted && (
              <p className="submit-note show">
                Thanks — our ATAP team will call you within 1 business day.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand">
                <div className="brand-mark">M</div>
                MAQO Engineering Sdn Bhd
              </div>
              <p>
                Energizing a cleaner future — one solar panel, one battery,
                one EV charged at a time.
              </p>
              <p style={{ marginTop: 10, color: "var(--ink-faint)" }}>
                ST Class A · CIDB G7 · SEDA Registered · ISO 9001:2015
              </p>
            </div>
            <div className="foot-contact">
              Email: admin@maqo.asia
              <br />
              Office: 603-8069 1706
              <br />
              WhatsApp: <a href="https://wa.me/60187771095">6018-777 1095</a>
              <br />
              27, Jalan TPP 1/1, Taman Perindustrian Puchong, 47100 Puchong,
              Selangor
            </div>
          </div>
          <div className="foot-bottom">
            <span>
              © 2026 MAQO Engineering Sdn Bhd (MAQO Solar / MAQO
              Technologies). All rights reserved.
            </span>
            <span>Suruhanjaya Tenaga · SEDA · CIDB G7</span>
          </div>
        </div>
      </footer>
    </>
  );
}
