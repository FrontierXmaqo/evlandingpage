"use client";

import Image from "next/image";
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

/*
 * MAQO wordmark, rendered from the logo artwork at /public/maqo-logo.svg
 * (swap that file for the official export whenever you have it — the
 * component and its sizing stay the same).
 */
function MaqoLogo({ invert = false }: { invert?: boolean }) {
  return (
    <Image
      src="/maqo-logo.svg"
      alt="MAQO — Energizing a cleaner future"
      width={572}
      height={176}
      className={"maqo-img" + (invert ? " invert" : "")}
      priority
    />
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.22.89 2.39 1.01 2.56.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="arrow"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

/* Line icons for the "what's covered" pillars. */
const iconProps = {
  viewBox: "0 0 32 32",
  width: 30,
  height: 30,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconPanel() {
  return (
    <svg {...iconProps}>
      <path d="M6 6h20l3 14H3L6 6Z" />
      <path d="M4.4 13h23.2M13 6l-1.5 14M19 6l1.5 14M16 20v6M11 26h10" />
    </svg>
  );
}
function IconInverter() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="4" width="22" height="24" rx="3" />
      <path d="M17 9l-5 8h4l-1 6 5-8h-4l1-6Z" />
      <path d="M9 24h4" />
    </svg>
  );
}
function IconBattery() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="9" width="23" height="14" rx="3" />
      <path d="M29 14v4" />
      <path d="M7 13v6M12 13v6M17 13v6" />
    </svg>
  );
}
function IconApp() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="3" width="14" height="26" rx="3" />
      <path d="M13 21l3-5 3 3 4-7" />
      <path d="M14 25.5h4" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg {...iconProps}>
      <path d="M5 19v-4a11 11 0 0 1 22 0v4" />
      <rect x="3" y="17" width="6" height="8" rx="2.5" />
      <rect x="23" y="17" width="6" height="8" rx="2.5" />
      <path d="M26 25v1a3 3 0 0 1-3 3h-4" />
    </svg>
  );
}

const PILLARS = [
  {
    icon: <IconPanel />,
    title: "Solar panels",
    body: "Tier-1 panels from AIKO, Huawei and FoxESS — sized for your EV load, not just the house.",
  },
  {
    icon: <IconInverter />,
    title: "Hybrid inverter",
    body: "Handles simultaneous household use and EV charging draw without tripping your supply.",
  },
  {
    icon: <IconBattery />,
    title: "Optional battery",
    body: "Store daytime solar so your car charges on your own power after dark.",
  },
  {
    icon: <IconApp />,
    title: "Real-time monitoring",
    body: "See generation against charging consumption side by side, on your phone.",
  },
  {
    icon: <IconSupport />,
    title: "Dedicated support",
    body: "One in-house team from SEDA approval all the way to your NEM meter.",
  },
];

/* Hero illustration: rooftop solar array feeding a home EV charger. */
function SolarEvScene() {
  return (
    <svg
      className="solar-ev"
      viewBox="0 0 560 400"
      width="100%"
      role="img"
      aria-label="A house with rooftop solar panels powering a wall charger that is charging an electric car in the driveway"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF4DC" />
          <stop offset="100%" stopColor="#FDFEFB" />
        </linearGradient>
        <linearGradient id="panelFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#254A34" />
          <stop offset="100%" stopColor="#0E2116" />
        </linearGradient>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE6D8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="400" fill="url(#sky)" />

      {/* Sun */}
      <g className="sun">
        <circle cx="468" cy="72" r="32" fill="#F5901E" opacity="0.16" />
        <circle cx="468" cy="72" r="21" fill="#F5901E" />
        <g stroke="#F5901E" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="468" y1="32" x2="468" y2="42" />
          <line x1="468" y1="102" x2="468" y2="112" />
          <line x1="428" y1="72" x2="438" y2="72" />
          <line x1="498" y1="72" x2="508" y2="72" />
          <line x1="440" y1="44" x2="447" y2="51" />
          <line x1="489" y1="93" x2="496" y2="100" />
          <line x1="440" y1="100" x2="447" y2="93" />
          <line x1="489" y1="51" x2="496" y2="44" />
        </g>
      </g>

      {/* Ground + driveway */}
      <rect x="0" y="330" width="560" height="70" fill="#E4EDDC" />
      <rect x="0" y="330" width="560" height="2.5" fill="#CFDCC4" />
      <path d="M300,330 L560,330 L560,400 L262,400 Z" fill="#DAE4D1" />

      {/* House */}
      <path d="M78,215 L302,150 L302,330 L78,330 Z" fill="#FFFFFF" />
      <path d="M78,215 L302,150 L302,330 L78,330 Z" fill="none" stroke="#CFDCC4" strokeWidth="2" />
      <path d="M62,205 L306,134 L318,155 L74,226 Z" fill="#152A1D" />

      {/* Solar array */}
      <g stroke="#7DB928" strokeWidth="1.2" strokeOpacity="0.6">
        <path d="M72,192 L107,182 L114,207 L79,217 Z" fill="url(#panelFace)" />
        <path d="M110,181 L145,171 L152,196 L117,206 Z" fill="url(#panelFace)" />
        <path d="M148,170 L183,160 L190,185 L155,195 Z" fill="url(#panelFace)" />
        <path d="M186,159 L221,149 L228,174 L193,184 Z" fill="url(#panelFace)" />
        <path d="M224,148 L259,138 L266,163 L231,173 Z" fill="url(#panelFace)" />
        <path d="M262,137 L297,127 L304,152 L269,162 Z" fill="url(#panelFace)" />
      </g>
      <path d="M72,192 L297,127 L300,138 L75,203 Z" fill="#F5901E" opacity="0.22" />

      {/* Windows + door */}
      <rect x="104" y="248" width="46" height="38" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <line x1="127" y1="248" x2="127" y2="286" stroke="#CFDCC4" strokeWidth="2" />
      <rect x="172" y="248" width="46" height="38" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <line x1="195" y1="248" x2="195" y2="286" stroke="#CFDCC4" strokeWidth="2" />
      <rect x="242" y="252" width="42" height="78" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <circle cx="276" cy="292" r="3" fill="#7DB928" />

      {/* Wall charger */}
      <rect x="306" y="232" width="28" height="46" rx="8" fill="#7DB928" />
      <path d="M322,244 L313,258 L319,258 L316,268 L325,254 L319,254 Z" fill="#FFFFFF" />
      <circle className="charger-led" cx="320" cy="273" r="2.6" fill="#F2FFDD" />

      {/* Charging cable */}
      <path className="cable" d="M334,262 C356,282 344,314 372,306" />
      <circle r="4.5" fill="#7DB928">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M334,262 C356,282 344,314 372,306" />
      </circle>
      <circle r="4.5" fill="#F5901E">
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M334,262 C356,282 344,314 372,306" />
      </circle>

      {/* Car */}
      <g>
        <path
          d="M368,332 L368,308 Q369,298 382,294 L406,286 Q426,262 456,262 L480,262 Q502,264 514,286 L530,294 Q540,298 540,310 L540,332 Z"
          fill="url(#carBody)"
          stroke="#BCCDB2"
          strokeWidth="2"
        />
        <path d="M410,288 Q428,270 456,270 L478,270 Q498,272 508,288 Z" fill="#152A1D" />
        <line x1="456" y1="270" x2="456" y2="288" stroke="#BCCDB2" strokeWidth="2" />
        <circle cx="375" cy="304" r="6" fill="#7DB928" />
        <circle cx="375" cy="304" r="2.2" fill="#FFFFFF" />
        <rect x="533" y="300" width="8" height="7" rx="3" fill="#F5901E" />
        <circle cx="404" cy="332" r="19" fill="#152A1D" />
        <circle cx="404" cy="332" r="8" fill="#CBD9C2" />
        <circle cx="506" cy="332" r="19" fill="#152A1D" />
        <circle cx="506" cy="332" r="8" fill="#CBD9C2" />
      </g>

      {/* Charging badge */}
      <g>
        <rect x="404" y="208" width="116" height="36" rx="18" fill="#FFFFFF" stroke="#DDE7D5" strokeWidth="1.5" />
        <rect x="419" y="220" width="22" height="12" rx="3" fill="none" stroke="#7DB928" strokeWidth="2" />
        <rect x="442" y="223" width="3" height="6" rx="1.5" fill="#7DB928" />
        <rect x="421" y="222" width="18" height="8" rx="1.5" fill="#7DB928">
          <animate attributeName="width" values="4;18;18" dur="2.4s" repeatCount="indefinite" />
        </rect>
        <text x="453" y="231" className="ev-badge-text">
          Charging
        </text>
      </g>
    </svg>
  );
}

/* Sun → panels → charger flow diagram (shown in "How it works"). */
function ElectronFlow() {
  return (
    <div className="flow-card">
      <h4>Where your EV&apos;s electrons come from</h4>
      <svg viewBox="0 0 320 220" width="100%" height="220" aria-hidden="true">
        <path
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
      <p className="flow-note">
        Every kWh your car takes at home can come off your own roof instead of
        TNB&apos;s highest tier.
      </p>
    </div>
  );
}

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
          <a className="brand" href="#top" aria-label="MAQO home">
            <MaqoLogo />
          </a>
          <nav className="nav-links">
            <a href="#the-problem">The problem</a>
            <a href="#calculator">Savings</a>
            <a href="#how-it-works">How it works</a>
            <a href="#covered">What&apos;s covered</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-whatsapp" href="https://wa.me/60123220816">
              <WhatsAppIcon />
              <span>WhatsApp Us</span>
            </a>
            <a className="btn btn-primary" href="#assessment">
              Free Assessment
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <span className="hero-blob hero-blob-a" aria-hidden="true" />
          <span className="hero-blob hero-blob-b" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                MAQO ATAP · Built for EV-owning homes
              </div>
              <h1>
                Charge Your EV On <span className="hl">Sunlight</span>.
                <br />
                Not On <span className="strike">TNB</span>.
              </h1>
              <p className="lede">
                Your car already runs on electricity — the only question is who
                sells it to you. Put solar on your roof under NEM and your
                driveway becomes your own fuel station, cutting up to{" "}
                <b>90% off your TNB bill</b>.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary btn-lg" href="#assessment">
                  Get My Free Assessment
                  <ArrowIcon />
                </a>
                <a className="btn btn-outline btn-lg" href="#calculator">
                  See My Savings
                </a>
              </div>
              <ul className="hero-trust">
                <li>ST Class A</li>
                <li>CIDB G7</li>
                <li>SEDA Registered</li>
                <li>ISO 9001:2015</li>
              </ul>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-frame">
                <SolarEvScene />
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">Typical bill after solar</span>
                <span className="hero-chip-value">
                  RM 612 <ArrowIcon /> <b>RM 78</b>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIAL BAND */}
        <section className="band">
          <div className="wrap band-grid">
            <div className="band-item">
              <b>90%</b>
              <span>Maximum TNB bill reduction</span>
            </div>
            <div className="band-item">
              <b>Class A</b>
              <span>Suruhanjaya Tenaga contractor licence</span>
            </div>
            <div className="band-item">
              <b>G7</b>
              <span>Highest CIDB contractor grade</span>
            </div>
            <div className="band-item">
              <b>ISO 9001</b>
              <span>:2015 quality-managed installation</span>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section id="the-problem">
          <div className="wrap split">
            <div className="split-copy">
              <span className="eyebrow">
                <i />
                The EV tax on your bill
              </span>
              <h2>
                Home charging is the biggest jump an EV owner ever sees on a
                TNB bill
              </h2>
              <p>
                A typical EV adds 150–300 kWh of home charging a month on top of
                normal household use — usually pushing families into TNB&apos;s
                highest tiered rate. Solar offsets exactly that extra load.
              </p>
              <a className="link-arrow" href="#calculator">
                Estimate your own numbers
                <ArrowIcon />
              </a>
            </div>
            <div className="compare">
              <div className="bill-card before">
                <span className="bill-tag before">Before solar</span>
                <div className="bill-amount">RM 612</div>
                <div className="bill-bar-track">
                  <span className="bill-bar-fill" />
                </div>
                <p className="bill-note">
                  Household use plus nightly EV charging, billed at TNB&apos;s
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
              <p className="compare-note">
                Illustrative example, based on a 14 kWp system sized for an EV
                household.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                Solar + EV calculator
              </span>
              <h2>Size a system around your car, not just your house</h2>
              <p>
                Tell us your current TNB bill and when you usually charge at
                home. We&apos;ll estimate the system size and what you&apos;d
                save.
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
                <h4>
                  Based on RM{bill}/month, charging{" "}
                  {selected.label.toLowerCase()}
                </h4>
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
                <a className="btn btn-primary" href="#assessment">
                  Get My Exact ROI
                  <ArrowIcon />
                </a>
                <p className="calc-disclaimer">
                  Estimate only. Actual system size, savings and pricing depend
                  on real consumption, charger schedule, roof space, shading and
                  a full site assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                How it works
              </span>
              <h2>From TNB bill to charging on sunlight</h2>
            </div>
            <div className="how-grid">
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
              <ElectronFlow />
            </div>
          </div>
        </section>

        {/* WHAT'S COVERED */}
        <section id="covered" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                What&apos;s covered
              </span>
              <h2>Everything an EV household needs</h2>
              <p>
                One scope, one in-house team, one point of contact — from the
                first roof measurement to the day your meter is swapped.
              </p>
            </div>
            <div className="pillars">
              {PILLARS.map((p) => (
                <article className="pillar" key={p.title}>
                  <span className="pillar-icon">{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
              <article className="pillar pillar-cta">
                <h3>Not sure what you need?</h3>
                <p>
                  Our ATAP team specs it around your roof, your bill and your
                  charging pattern — at no cost.
                </p>
                <a className="link-arrow" href="#assessment">
                  Book a free assessment
                  <ArrowIcon />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="stories">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                EV owners on ATAP
              </span>
              <h2>Households already charging on their own power</h2>
            </div>
            <div className="testimonials">
              <div className="tcard">
                <span className="quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <p>
                  Our bill used to spike every month once we started charging at
                  home. Since the panels went up, most of that charging is
                  basically free during the day.
                </p>
                <footer>
                  <b>Residential ATAP customer</b>
                  <span>EV owner · Subang Jaya</span>
                </footer>
              </div>
              <div className="tcard">
                <span className="quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <p>
                  The team asked about our charger and driving pattern before
                  sizing anything — it wasn&apos;t a generic package, it was
                  built around how much we actually charge.
                </p>
                <footer>
                  <b>Residential ATAP customer</b>
                  <span>EV owner · Shah Alam</span>
                </footer>
              </div>
              <div className="tcard">
                <span className="quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <p>
                  With the battery add-on we charge overnight from stored solar
                  instead of the grid. The app makes it easy to see exactly how
                  much we&apos;re offsetting.
                </p>
                <footer>
                  <b>Residential ATAP customer</b>
                  <span>EV owner · Kajang</span>
                </footer>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="alt-bg">
          <div className="wrap faq-grid">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                FAQ
              </span>
              <h2>What EV owners ask us</h2>
              <p>
                Still unsure about something? Message us and a real engineer
                answers.
              </p>
              <a className="btn btn-whatsapp" href="https://wa.me/60123220816">
                <WhatsAppIcon />
                <span>WhatsApp Us</span>
              </a>
            </div>
            <div className="faq-list">
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
                    style={{ maxHeight: openFaq === i ? 260 : 0 }}
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
        <div className="wrap form-grid">
          <div className="form-intro">
            <span className="eyebrow light">
              <i />
              Free home assessment
            </span>
            <h2>See what solar does to your TNB bill</h2>
            <p>
              Takes about 60 seconds. Our ATAP team calls you within 1 business
              day with a system sized around your home and your EV.
            </p>
            <ul className="form-points">
              <li>No obligation, no hidden costs on your quote</li>
              <li>We handle your TNB NEM / ATAP application</li>
              <li>Sized around your actual EV charging pattern</li>
            </ul>
            <a className="btn btn-whatsapp" href="https://wa.me/60123220816">
              <WhatsAppIcon />
              <span>WhatsApp Us</span>
            </a>
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
            <button type="submit" className="btn btn-primary btn-block">
              {submitted ? "Request received" : "Get My Free Home Assessment"}
              {!submitted && <ArrowIcon />}
            </button>
            <p className="form-legal">
              By submitting, you agree to be contacted by MAQO Engineering Sdn
              Bhd about your solar assessment. No spam.
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
              <MaqoLogo invert />
              <p>
                MAQO Engineering Sdn Bhd — one solar panel, one battery, one EV
                charged at a time.
              </p>
              <ul className="foot-certs">
                <li>ST Class A</li>
                <li>CIDB G7</li>
                <li>SEDA Registered</li>
                <li>ISO 9001:2015</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Explore</h5>
              <a href="#the-problem">The problem</a>
              <a href="#calculator">Savings calculator</a>
              <a href="#how-it-works">How it works</a>
              <a href="#covered">What&apos;s covered</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href="mailto:admin@maqo.asia">admin@maqo.asia</a>
              <a href="tel:60380691706">603-8069 1706</a>
              <a href="https://wa.me/60187771095">WhatsApp 6018-777 1095</a>
              <p>
                27, Jalan TPP 1/1, Taman Perindustrian Puchong, 47100 Puchong,
                Selangor
              </p>
            </div>
          </div>
          <div className="foot-bottom">
            <span>
              © 2026 MAQO Engineering Sdn Bhd (MAQO Solar / MAQO Technologies).
              All rights reserved.
            </span>
            <span>Suruhanjaya Tenaga · SEDA · CIDB G7</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        className="wa-float"
        href="https://wa.me/60123220816"
        aria-label="WhatsApp Us"
      >
        <WhatsAppIcon />
        <span>WhatsApp Us</span>
      </a>
    </>
  );
}
