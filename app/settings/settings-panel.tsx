
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "../actions/settings";
import {
  Palette,
  Shield,
  Bell,
  UserRound,
  Monitor,
  Check,
  Sparkles,
  Save,
} from "lucide-react";

type Settings = {
  theme: string;
  accent_color: string;
  font_size: string;
  compact_mode: boolean;
  reduced_motion: boolean;
  profile_visibility: string;
  show_online_status: boolean;
  allow_messages: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
};

const accents = [
  { id: "purple", name: "Purple", color: "#8B5CF6" },
  { id: "cyan", name: "Cyan", color: "#22D3EE" },
  { id: "pink", name: "Pink", color: "#EC4899" },
  { id: "blue", name: "Blue", color: "#3B82F6" },
  { id: "green", name: "Green", color: "#10B981" },
];

export default function SettingsPanel({
  initialSettings,
}: {
  initialSettings: Settings;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const accent =
    accents.find((item) => item.id === settings.accent_color)?.color ||
    "#8B5CF6";

  function updateSetting(key: keyof Settings, value: string | boolean) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("");
  }

  function save() {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(settings).forEach(([key, value]) => {
        formData.set(key, String(value));
      });

      const result = await saveSettings(formData);

      if (!result.success) {
        setMessage(result.error || "Unable to save settings.");
        return;
      }

      setMessage("Your settings have been saved!");
      router.refresh();
    });
  }

  const cardStyle = {
    background: "#151629",
    border: "1px solid #302B4C",
    borderRadius: "16px",
    padding: "23px",
    marginBottom: "20px",
  };

  const headingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "22px",
    fontSize: "18px",
    fontWeight: 800,
  };

  const selectStyle = {
    width: "100%",
    maxWidth: "250px",
    padding: "11px",
    borderRadius: "9px",
    border: "1px solid #39304F",
    background: "#090A14",
    color: "white",
    fontSize: "13px",
  };

  function SettingRow({
    title,
    description,
    setting,
  }: {
    title: string;
    description: string;
    setting: keyof Settings;
  }) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          padding: "16px 0",
          borderTop: "1px solid #302B4C",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px" }}>
            {title}
          </div>
          <div
            style={{
              color: "#9996B5",
              fontSize: "12px",
              marginTop: "5px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={Boolean(settings[setting])}
          onClick={() =>
            updateSetting(setting, !settings[setting])
          }
          style={{
            width: "48px",
            height: "27px",
            flexShrink: 0,
            borderRadius: "20px",
            border: "none",
            padding: "3px",
            background: settings[setting] ? accent : "#444258",
            cursor: "pointer",
            display: "flex",
            justifyContent: settings[setting] ? "flex-end" : "flex-start",
            transition: "background 160ms ease",
          }}
        >
          <span
            style={{
              width: "21px",
              height: "21px",
              borderRadius: "50%",
              background: "white",
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "850px" }}>
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            color: accent,
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          PERSONALISE YOUR EXPERIENCE
        </div>

        <h1 style={{ fontSize: "34px", margin: "9px 0" }}>
          Settings<span style={{ color: accent }}>.</span>
        </h1>

        <p style={{ color: "#9996B5", margin: 0 }}>
          Make VYBE feel like yours.
        </p>
      </div>

      <section style={cardStyle}>
        <div style={headingStyle}>
          <Palette color={accent} size={21} />
          Appearance
        </div>

        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontWeight: 700, marginBottom: "5px" }}>
            Theme
          </div>
          <p style={{ color: "#9996B5", fontSize: "12px" }}>
            Choose how VYBE looks.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { id: "dark", label: "Dark", bg: "#090A14" },
              { id: "light", label: "Light", bg: "#E9E9F5" },
              { id: "system", label: "System", bg: "linear-gradient(90deg,#090A14 50%,#E9E9F5 50%)" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateSetting("theme", item.id)}
                style={{
                  width: "105px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: settings.theme === item.id
                    ? `2px solid ${accent}`
                    : "1px solid #39304F",
                  background: "#090A14",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: "43px",
                    borderRadius: "6px",
                    background: item.bg,
                    marginBottom: "9px",
                    border: "1px solid #444258",
                  }}
                />
                <span style={{ fontSize: "12px" }}>{item.label}</span>
                {settings.theme === item.id && (
                  <Check size={13} style={{ marginLeft: "5px" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #302B4C", paddingTop: "18px" }}>
          <div style={{ fontWeight: 700, marginBottom: "13px" }}>
            Accent colour
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {accents.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.name}
                aria-label={`${item.name} accent colour`}
                aria-pressed={settings.accent_color === item.id}
                onClick={() => updateSetting("accent_color", item.id)}
                style={{
                  width: "39px",
                  height: "39px",
                  borderRadius: "50%",
                  background: item.color,
                  border: settings.accent_color === item.id
                    ? "3px solid white"
                    : "3px solid transparent",
                  outline: settings.accent_color === item.id
                    ? `2px solid ${item.color}`
                    : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: "22px" }}>
          <div style={{ fontWeight: 700, marginBottom: "9px" }}>
            Text size
          </div>
          <select
            value={settings.font_size}
            onChange={(event) =>
              updateSetting("font_size", event.target.value)
            }
            style={selectStyle}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <SettingRow
          title="Compact layout"
          description="Reduce spacing to fit more content on screen."
          setting="compact_mode"
        />

        <SettingRow
          title="Reduce animations"
          description="Minimise motion and visual effects."
          setting="reduced_motion"
        />

        <div
          style={{
            marginTop: "18px",
            padding: "17px",
            borderRadius: "12px",
            background: "#090A14",
            border: "1px solid #302B4C",
          }}
        >
          <div style={{ color: "#9996B5", fontSize: "11px", marginBottom: "10px" }}>
            LIVE ACCENT PREVIEW
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "35px", height: "35px", borderRadius: "10px", background: accent }} />
            <div>
              <div style={{ fontWeight: 800 }}>Your VYBE</div>
              <div style={{ color: accent, fontSize: "12px" }}>
                Your people. Your world.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={headingStyle}>
          <Shield color={accent} size={21} />
          Privacy & Security
        </div>

        <div style={{ fontWeight: 700, marginBottom: "9px" }}>
          Profile visibility
        </div>

        <select
          value={settings.profile_visibility}
          onChange={(event) =>
            updateSetting("profile_visibility", event.target.value)
          }
          style={selectStyle}
        >
          <option value="public">Public profile</option>
          <option value="private">Private profile</option>
        </select>

        <SettingRow
          title="Online status"
          description="Let other members see when you're online."
          setting="show_online_status"
        />

        <SettingRow
          title="Allow messages"
          description="Allow other members to message you."
          setting="allow_messages"
        />

        <p style={{ color: "#77778E", fontSize: "11px", lineHeight: 1.5 }}>
          These preferences are saved to your account. Some privacy controls
          will need to be connected to the relevant VYBE features before
          they can enforce restrictions.
        </p>
      </section>

      <section style={cardStyle}>
        <div style={headingStyle}>
          <Bell color={accent} size={21} />
          Notifications
        </div>

        <SettingRow
          title="Email notifications"
          description="Receive VYBE updates by email."
          setting="email_notifications"
        />

        <SettingRow
          title="In-app notifications"
          description="Receive activity updates inside VYBE."
          setting="in_app_notifications"
        />
      </section>

      <section style={cardStyle}>
        <div style={headingStyle}>
          <UserRound color={accent} size={21} />
          Account
        </div>

        <p style={{ color: "#9996B5", fontSize: "13px", lineHeight: 1.6 }}>
          Manage your VYBE profile from your profile page. Account security,
          password changes and email management will have their own controls.
        </p>

        <a
          href="/profile"
          style={{
            display: "inline-block",
            marginTop: "5px",
            color: accent,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          Manage my profile →
        </a>
      </section>

      <div
        style={{
          position: "sticky",
          bottom: "15px",
          padding: "15px",
          borderRadius: "14px",
          background: "#201B34",
          border: "1px solid #493A69",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "13px", color: "#C9C3DD" }}>
          {message || "Remember to save your changes."}
        </span>

        <button
          type="button"
          onClick={save}
          disabled={isPending}
          style={{
            ...{
              padding: "12px 20px",
              border: "none",
              borderRadius: "9px",
              background: `linear-gradient(90deg, ${accent}, #22D3EE)`,
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            },
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Save size={16} />
          {isPending ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}
