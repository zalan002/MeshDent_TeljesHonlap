"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildAttributionPayload } from "@/lib/attribution";
import {
  createCrmSession,
  type CrmFields,
  type CrmResult,
  type CrmSession,
} from "@/lib/crm-form";

const ROLE_OPTIONS = [
  "Praxistulajdonos / fogorvos",
  "Alkalmazott fogorvos",
  "Fogtechnikus",
  "Asszisztens / praxismenedzser",
  "Egyéb",
] as const;

const ACTIVITY_OPTIONS = [
  "Implantációs körhidak / többtagú pótlások",
  "Implantáció + kombinált munkák",
  "Esztétikai / protetikai munkák",
  "Általános rendelő, alkalmi implantológia",
  "Még csak tervezem a digitális workflow-t",
] as const;

type StepKey =
  | "nev"
  | "email"
  | "telefon"
  | "ceg"
  | "pecsetszam"
  | "szerep"
  | "tevekenyseg";

type FormState = {
  nev: string;
  email: string;
  telefon: string;
  ceg: string;
  pecsetszam: string;
  szerep: string;
  tevekenyseg: string;
};

const initialState: FormState = {
  nev: "",
  email: "",
  telefon: "",
  ceg: "",
  pecsetszam: "",
  szerep: "",
  tevekenyseg: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = {
  key: StepKey;
  title: string;
  subtitle?: string;
  inputType: "text" | "email" | "tel" | "radio";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  options?: readonly string[];
  optional?: boolean;
  validate: (value: string) => string | null;
};

const steps: Step[] = [
  {
    key: "nev",
    title: "Hogy szólíthatunk?",
    inputType: "text",
    placeholder: "Pl. Dr. Kovács Anna",
    autoComplete: "name",
    inputMode: "text",
    validate: (v) =>
      v.trim().length >= 2 ? null : "Kérjük, add meg a teljes neved (min. 2 karakter).",
  },
  {
    key: "email",
    title: "Mire írhatunk?",
    subtitle: "Az ajánlatot és a részleteket erre a címre küldjük.",
    inputType: "email",
    placeholder: "rendelo@pelda.hu",
    autoComplete: "email",
    inputMode: "email",
    validate: (v) =>
      EMAIL_REGEX.test(v.trim())
        ? null
        : "Kérjük, érvényes e-mail címet adj meg.",
  },
  {
    key: "telefon",
    title: "Mire hívhatunk?",
    subtitle:
      "Egy időpontot egyeztetünk — nem hívunk be váratlan pillanatban.",
    inputType: "tel",
    placeholder: "+36 30 123 4567",
    autoComplete: "tel",
    inputMode: "tel",
    validate: (v) => {
      const digits = v.replace(/\D+/g, "");
      if (digits.length < 7 || digits.length > 15) {
        return "Kérjük, érvényes telefonszámot adj meg.";
      }
      return null;
    },
  },
  {
    key: "ceg",
    title: "Melyik rendelőben dolgozol?",
    subtitle: "Praxis vagy klinika neve — segít, hogy felkészülten hívjunk.",
    inputType: "text",
    placeholder: "Pl. Mosoly Dental Kft.",
    autoComplete: "organization",
    inputMode: "text",
    validate: (v) =>
      v.trim().length >= 2 ? null : "Kérjük, add meg a rendelő nevét.",
  },
  {
    key: "pecsetszam",
    title: "Fogorvosi pecsétszám",
    subtitle: "Nem kötelező — ha megadod, gyorsabban tudjuk az ajánlatot személyre szabni.",
    inputType: "text",
    placeholder: "Pl. 12345",
    autoComplete: "off",
    inputMode: "text",
    optional: true,
    validate: () => null,
  },
  {
    key: "szerep",
    title: "Mi a szereped a rendelőben?",
    inputType: "radio",
    options: ROLE_OPTIONS,
    validate: (v) =>
      ROLE_OPTIONS.includes(v as (typeof ROLE_OPTIONS)[number])
        ? null
        : "Válassz egy lehetőséget.",
  },
  {
    key: "tevekenyseg",
    title: "Milyen munkák a meghatározóak nálatok?",
    subtitle: "Ez segít abban, hogy a számodra legrelevánsabb eseteket mutassuk meg.",
    inputType: "radio",
    options: ACTIVITY_OPTIONS,
    validate: (v) =>
      ACTIVITY_OPTIONS.includes(v as (typeof ACTIVITY_OPTIONS)[number])
        ? null
        : "Válassz egy lehetőséget.",
  },
];

const DEFAULT_FORRAS = "meshdent-freedom-air-fb";

/** Adatkezelési tájékoztató a hozzájárulási sorhoz (üresen link nélkül jelenik meg). */
const PRIVACY_URL = "/adatkezeles";

/** A form állapota → a CRM mezőkulcsai. */
function crmFieldsFrom(state: FormState): CrmFields {
  return {
    last_name: state.nev.trim(),
    email: state.email.trim(),
    phone: state.telefon.trim(),
    company: state.ceg.trim(),
    // A CRM-ben ez `number` típusú mező: nem számjegyet tartalmazó értéknél az
    // EGÉSZ beküldést elutasítaná. A kitöltő eredeti válaszát az n8n és a CAPI
    // változatlanul kapja meg, a CRM-be csak a számjegyek mennek.
    fogorvosi_pecsetszam: state.pecsetszam.replace(/\D+/g, ""),
    milyen_szerepben: state.szerep,
    milyen_munkak_a_meghatarozoak_nalatok: state.tevekenyseg,
  };
}

type LeadFormProps = {
  forras?: string;
  contentName?: string;
  contentCategory?: string;
};

export default function LeadForm({
  forras = DEFAULT_FORRAS,
  contentName = "Freedom Air konzultáció",
  contentCategory = "Fogászati szkenner érdeklődés",
}: LeadFormProps = {}) {
  const reduceMotion = useReducedMotion();

  const [state, setState] = useState<FormState>(initialState);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const busyRef = useRef(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const crmRef = useRef<CrmSession | null>(null);

  // A CRM render-tokenje csak ~3 másodperc után fogadható el (botvédelem),
  // ezért már a form megjelenésekor lekérjük — így a beküldés nem vár rá.
  useEffect(() => {
    if (!crmRef.current) { crmRef.current = createCrmSession(); void crmRef.current.prepare(); }
  }, []);

  function crmSession(): CrmSession {
    if (!crmRef.current) crmRef.current = createCrmSession();
    return crmRef.current;
  }

  const currentStep = steps[stepIndex];
  const value = state[currentStep.key];
  const isLast = stepIndex === steps.length - 1;

  const progress = useMemo(
    () => 0.18 + 0.82 * (stepIndex / steps.length),
    [stepIndex],
  );

  function update(next: string) {
    setState((s) => ({ ...s, [currentStep.key]: next }));
    if (error) setError(null);
  }

  async function next() {
    if (busyRef.current) return;
    const validationError = currentStep.validate(value);
    if (validationError) { setError(validationError); return; }
    setError(null); setServerError(null);
    if (currentStep.key === "telefon") {
      if (!consentGranted) { setError("Kérjük, fogadd el az adatkezelési tájékoztatót."); return; }
      busyRef.current = true; setSubmitting(true);
      const result = await crmSession().savePartial(crmFieldsFrom(state), buildAttributionPayload());
      busyRef.current = false; setSubmitting(false);
      if (!result.ok) { setServerError(result.error); return; }
    }
    if (!isLast) setStepIndex(i => i + 1);
  }

  function back() {
    if (stepIndex === 0) return;
    setError(null);
    setStepIndex((i) => i - 1);
  }

  async function submit() {
    if (busyRef.current) return;
    const validationError = currentStep.validate(value);
    if (validationError) { setError(validationError); return; }
    if (!consentGranted) { setError("Kérjük, fogadd el az adatkezelési tájékoztatót."); return; }
    setError(null); setServerError(null); setSubmitting(true); busyRef.current = true;
    try {
      const result: CrmResult = await crmSession().submitFinal(crmFieldsFrom(state), buildAttributionPayload());
      if (!result.ok) { setServerError(result.error); return; }
      window.dispatchEvent(new CustomEvent("meshdent-lead", { detail: { formId: "freedom-air", submission: result.submission } }));
      window.location.assign("/FreedomaAir/koszonjuk");
    } finally { busyRef.current = false; setSubmitting(false); }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isLast) submit();
      else next();
    }
  }

  return (
    <form
      className="lead-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) submit();
        else next();
      }}
      noValidate
      aria-label="Időpont-egyeztető űrlap"
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="lead-form__progress"
      >
        <div
          className="lead-form__progress-bar"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="lead-form__step-meta" aria-live="polite">
        {stepIndex + 1}. lépés / {steps.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.key}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="lead-form__step"
        >
          <h2 className="lead-form__title" aria-live="polite">
            {currentStep.title}
          </h2>
          {currentStep.subtitle && (
            <p className="lead-form__subtitle">{currentStep.subtitle}</p>
          )}

          {currentStep.inputType !== "radio" ? (
            <input
              type={currentStep.inputType}
              value={value}
              onChange={(e) => update(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={currentStep.placeholder}
              autoComplete={currentStep.autoComplete}
              inputMode={currentStep.inputMode}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "lead-form-error" : undefined}
              className="lead-form__input"
              autoFocus
            />
          ) : (
            <div className="lead-form__options" role="radiogroup">
              {currentStep.options?.map((opt) => {
                const checked = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => update(opt)}
                    className={`lead-form__option${
                      checked ? " is-active" : ""
                    }`}
                  >
                    <span className="lead-form__option-dot" aria-hidden />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {error && (
            <p
              id="lead-form-error"
              role="alert"
              className="lead-form__error"
            >
              {error}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {serverError && (
        <p role="alert" className="lead-form__error lead-form__error--server">
          {serverError}
        </p>
      )}

      <div className="lead-form__actions">
        {stepIndex > 0 && (
          <button
            type="button"
            className="lead-form__btn lead-form__btn--ghost"
            onClick={back}
            disabled={submitting}
          >
            Vissza
          </button>
        )}
        <button
          type="submit"
          className="lead-form__btn lead-form__btn--primary"
          disabled={submitting}
        >
          {isLast
            ? submitting
              ? "Küldjük..."
              : "Időpontot kérek"
            : "Tovább"}
        </button>
      </div>

      <label className="lead-form__consent" style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <input type="checkbox" checked={consentGranted} onChange={event => setConsentGranted(event.target.checked)} style={{width:16,height:16,flexShrink:0,marginTop:3}} />
        <span>Elfogadom az <a href={PRIVACY_URL} target="_blank" rel="noreferrer">adatkezelési tájékoztatót</a>. A telefonszám megadása után az elérhetőségem rögzítésre kerül.</span>
      </label>
    </form>
  );
}
