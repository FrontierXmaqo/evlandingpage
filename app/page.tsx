import { createPublicClient } from "@/lib/supabase/public";
import LandingPageClient, {
  DEFAULT_LEAD_FORM_OPTIONS,
  type LeadFormOptions,
} from "./landing-page-client";

// Revalidate periodically so an admin's edit in /admin/website-editor shows
// up on the public page without needing a full redeploy.
export const revalidate = 60;

export default async function Page() {
  const leadFormOptions = await getLeadFormOptions();
  return <LandingPageClient leadFormOptions={leadFormOptions} />;
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
