import { createPublicClient } from "@/lib/supabase/public";
import LandingPageClient, {
  DEFAULT_LEAD_FORM_OPTIONS,
  DEFAULT_CALCULATOR_SETTINGS,
  type LeadFormOptions,
  type CalculatorSettings,
} from "./landing-page-client";

// Revalidate periodically so an admin's edit in /admin/lead-form or
// /admin/calculator-settings shows up on the public page without needing a
// full redeploy.
export const revalidate = 60;

export default async function Page() {
  const [leadFormOptions, calculatorSettings] = await Promise.all([
    getLeadFormOptions(),
    getCalculatorSettings(),
  ]);
  return (
    <LandingPageClient
      leadFormOptions={leadFormOptions}
      calculatorSettings={calculatorSettings}
    />
  );
}

async function getLeadFormOptions(): Promise<LeadFormOptions> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("lead_form_options")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return DEFAULT_LEAD_FORM_OPTIONS;

    return {
      salutations: data.salutations ?? DEFAULT_LEAD_FORM_OPTIONS.salutations,
      states: data.states ?? DEFAULT_LEAD_FORM_OPTIONS.states,
      propertyTypes: data.property_types ?? DEFAULT_LEAD_FORM_OPTIONS.propertyTypes,
      billRanges: data.bill_ranges ?? DEFAULT_LEAD_FORM_OPTIONS.billRanges,
      electricSupplyOptions:
        data.electric_supply_options ?? DEFAULT_LEAD_FORM_OPTIONS.electricSupplyOptions,
      languages: data.languages ?? DEFAULT_LEAD_FORM_OPTIONS.languages,
    };
  } catch {
    // Supabase not reachable/configured — fall back to the built-in defaults
    // rather than breaking the public landing page.
    return DEFAULT_LEAD_FORM_OPTIONS;
  }
}

async function getCalculatorSettings(): Promise<CalculatorSettings> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("calculator_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return DEFAULT_CALCULATOR_SETTINGS;

    return {
      ratePerKwh: data.rate_per_kwh ?? DEFAULT_CALCULATOR_SETTINGS.ratePerKwh,
      avgKwhPerKwpMonth: data.avg_kwh_per_kwp_month ?? DEFAULT_CALCULATOR_SETTINGS.avgKwhPerKwpMonth,
      referenceSystemKwp: data.reference_system_kwp ?? DEFAULT_CALCULATOR_SETTINGS.referenceSystemKwp,
      kwpPerPanel: data.kwp_per_panel ?? DEFAULT_CALCULATOR_SETTINGS.kwpPerPanel,
      offsetDayPercent: data.offset_day_percent ?? DEFAULT_CALCULATOR_SETTINGS.offsetDayPercent,
      offsetNightPercent: data.offset_night_percent ?? DEFAULT_CALCULATOR_SETTINGS.offsetNightPercent,
      offsetMixedPercent: data.offset_mixed_percent ?? DEFAULT_CALCULATOR_SETTINGS.offsetMixedPercent,
    };
  } catch {
    return DEFAULT_CALCULATOR_SETTINGS;
  }
}
