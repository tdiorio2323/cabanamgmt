import { redirect } from "next/navigation";

export default function PartnerDemoPage() {
  // Force all partner-demo traffic into the demo UI
  redirect("/demo");
}
