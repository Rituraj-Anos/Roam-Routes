import { AdminHeader } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const settings = await getSettings();
  return (
    <>
      <AdminHeader
        title="Site Settings"
        subtitle="Contact details, social links and the seasonal road-status note."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
