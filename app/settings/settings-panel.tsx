
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "../actions/settings";
import {
  Palette,
  Shield,
  Bell,
  UserRound,
  Check,
  Save,
  RotateCcw,
  Monitor,
  Layout,
  Type,
  Eye,
} from "lucide-react";

type Settings = {
  theme: string;
  accent_color: string;
  custom_accent_color: string;
  font_size: string;
  font_family: string;
  border_radius: string;
  content_width: string;
  sidebar_style: string;
  compact_mode: boolean;
  reduced_motion: boolean;
  profile_visibility: string;
  show_online_status: boolean;
  allow_messages: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
};

const defaults: Settings = {
  theme: "dark",
  accent_color: "purple",
  custom_accent_color: "",
  font_size: "medium",
  font_family: "default",
  border_radius: "rounded",
  content_width: "comfortable",
  sidebar_style: "expanded",
  compact_mode: false,
  reduced_motion: false,
  profile_visibility: "public",
  show_online_status: true,
  allow_messages: true,
  email_notifications: true,
  in_app_notifications: true,
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
  initialSettings: Partial<Settings>;
}) {
  const router = useRouter();

  const normalise = (value: Partial<Settings>): Settings => ({
    ...defaults,
    ...value,
  });

  const [savedSettings, setSavedSettings] = useState<Settings>(
    () => normalise(initialSettings)
  );

  const [settings, setSettings] = useState<Settings>(
    () => normalise(initialSettings)
  );

  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const accent =
    settings.custom_accent_color ||
    accents.find((item) => item.id === settings.accent_color)?.color ||
    "#8B5CF6";

  const isLight =
    settings.theme === "light" ||
    (settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  const colours = {
    background: isLight ? "#F3F4FA" : "#090A14",
    card: isLight ? "#FFFFFF" : "#151629",
    text: isLight ? "#17172B" : "#F4F4FF",
    muted: isLight ? "#686880" : "#9996B5",
    border: isLight ? "#DCDCEC" : "#302B4C",
    input: isLight ? "#F1F1F8" : "#090A14",
    buttonText: "#FFFFFF",
  };

  function updateSetting(key: keyof Settings, value: string | boolean) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("");
  }

  function resetChanges() {
    setSettings({ ...savedSettings });
    setMessage("Your unsaved changes have been reset.");
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

      setSavedSettings({ ...settings });
      setMessage("Your settings have been saved!");
      router.refresh();
    });
  }

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = settings.theme;
    root.dataset.fontSize = settings.font_size;
    root.dataset.fontFamily = settings.font_family;
    root.dataset.compact = String(settings.compact_mode);
    root.dataset.reducedMotion = String(settings.reduced_motion);
    root.dataset.borderRadius = settings.border_radius;
    root.dataset.contentWidth = settings.content_width;
    root.dataset.sidebarStyle = settings.sidebar_style;

    root.style.setProperty("--vybe-accent", accent);

    const media = window.matchMedia("(prefers-color-scheme: light)");

    const applyTheme = () => {
      const light =
        settings.theme === "light" ||
        (settings.theme === "system" && media.matches);

      root.dataset.resolvedTheme = light ? "light" : "dark";
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [settings, accent]);

  const cardStyle = {
    background: colours.card,
    border: `1px solid ${colours.border}`,
    borderRadius:
      settings.border_radius === "sharp"
        ? "5px"
        : settings.border_radius === "round"
          ? "25px"
          : "15px",
    padding: "23px",
    marginBottom: "20px",
    color: colours.text,
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
    maxWidth: "300px",
    padding: "11px",
    borderRadius: "9px",
    border: `1px solid ${colours.border}`,
    background: colours.input,
    color: colours.text,
    fontSize: "13px",
  };

  function SectionLabel({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div
        style={{
          fontWeight: 750,
          fontSize: "14px",
          marginBottom: "8px",
          color: colours.text,
        }}
      >
        {children}
      </div>
    );
  }

  function Description({ children }: { children: React.ReactNode }) {
    return (
      <p
        style={{
          color: colours.muted,
          fontSize: "12px",
          lineHeight: 1.6,
          margin: "5px 0 12px",
        }}
      >
        {children}
      </p>
    );
  }

  function SettingRow({
    title,
    description,
    setting,
  }: {
    title: string;
    description: string;
    setting: keyof Settings;
  }) {
    const enabled = Boolean(settings[setting]);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          padding: "16px 0",
          borderTop: `1px solid ${colours.border}`,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px" }}>
            {title}
          </div>
          <div
            style={{
              color: colours.muted,
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
          aria-checked={enabled}
          onClick={() => updateSetting(setting, !enabled)}
          style={{
            width: "48px",
            height: "27px",
            flexShrink: 0,
            borderRadius: "20px",
            border: "none",
            padding: "3px",
            background: enabled ? accent : "#77778E",
            cursor: "pointer",
            display: "flex",
            justifyContent: enabled ? "flex-end" : "flex-start",
            transition: settings.reduced_motion ? "none" : "background 160ms ease",
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

  function SelectSetting({
    title,
    description,
    setting,
    options,
  }: {
    title: string;
    description: string;
    setting: keyof Settings;
    options: { value: string; label: string }[];
  }) {
    return (
      <div style={{ marginTop: "20px" }}>
        <SectionLabel>{title}</SectionLabel>
        <Description>{description}</Description>
        <select
          value={String(settings[setting])}
          onChange={(event) => updateSetting(setting, event.target.value)}
          style={selectStyle}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth:
          settings.content_width === "compact"
            ? "680px"
            : settings.content_width === "wide"
              ? "1150px"
              : "850px",
        color: colours.text,
        background: "transparent",
        fontFamily:
          settings.font_family === "modern"
            ? "Arial, sans-serif"
            : settings.font_family === "classic"
              ? "Georgia, serif"
              : "inherit",
        fontSize:
          settings.font_size === "small"
            ? "13px"
            : settings.font_size === "large"
              ? "16px"
              : "14px",
        transition: settings.reduced_motion ? "none" : "max-width 200ms ease",
      }}
    >
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

        <p style={{ color: colours.muted, margin: 0 }}>
          Make VYBE feel like yours. Every detail, your way.
        </p>
      </div>

      <section style={cardStyle}>
        <div style={headingStyle}>
          <Palette color={accent} size={21} />
          Appearance & Themes
        </div>

        <SectionLabel>Choose your theme</SectionLabel>
        <Description>
          Choose dark, light or automatically follow your device.
        </Description>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { id: "dark", label: "Dark", bg: "#090A14", fg: "#FFFFFF" },
            { id: "light", label: "Light", bg: "#F3F4FA", fg: "#17172B" },
            {
              id: "system",
              label: "System",
              bg: "linear-gradient(90deg,#090A14 50%,#F3F4FA 50%)",
              fg: colours.text,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateSetting("theme", item.id)}
              style={{
                width: "105px",
                padding: "10px",
                borderRadius: "10px",
                border:
                  settings.theme === item.id
                    ? `2px solid ${accent}`
                    : `1px solid ${colours.border}`,
                background: colours.input,
                color: colours.text,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "43px",
                  borderRadius: "6px",
                  background: item.bg,
                  marginBottom: "9px",
                  border: "1px solid #77778E",
                }}
              />
              <span style={{ fontSize: "12px" }}>{item.label}</span>
              {settings.theme === item.id && (
                <Check size={13} style={{ marginLeft: "5px" }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <SectionLabel>Accent colour</SectionLabel>
          <Description>
            Choose the colour used for buttons, highlights and details.
          </Description>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {accents.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.name}
                aria-label={`${item.name} accent colour`}
                aria-pressed={
                  settings.accent_color === item.id &&
                  !settings.custom_accent_color
                }
                onClick={() => {
                  updateSetting("accent_color", item.id);
                  updateSetting("custom_accent_color", "");
                }}
                style={{
                  width: "39px",
                  height: "39px",
                  borderRadius: "50%",
                  background: item.color,
                  border:
                    settings.accent_color === item.id &&
                    !settings.custom_accent_color
                      ? "3px solid white"
                      : "3px solid transparent",
                  outline:
                    settings.accent_color === item.id &&
                    !settings.custom_accent_color
                      ? `2px solid ${item.color}`
                      : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: "18px" }}>
            <SectionLabel>Custom accent colour</SectionLabel>
            <Description>
              Enter a HEX colour or use the colour picker.
            </Description>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="color"
                value={settings.custom_accent_color || accent}
                onChange={(event) =>
                  updateSetting("custom_accent_color", event.target.value)
                }
                aria-label="Choose custom accent colour"
                style={{
                  width: "55px",
                  height: "43px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />
              <input
                value={settings.custom_accent_color}
                onChange={(event) =>
                  updateSetting("custom_accent_color", event.target.value)
                }
                placeholder="#8B5CF6"
                maxLength={7}
                style={{
                  ...selectStyle,
                  width: "150px",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colours.border}`, marginTop: "24px", paddingTop: "5px" }}>
          <div style={headingStyle}>
            <Type color={accent} size={19} />
            Typography & Layout
          </div>

          <SelectSetting
            title="Text size"
            description="Change the overall text size."
            setting="font_size"
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
          />

          <SelectSetting
            title="Font style"
            description="Choose the style of text used in the settings panel."
            setting="font_family"
            options={[
              { value: "default", label: "Default" },
              { value: "modern", label: "Modern" },
              { value: "classic", label: "Classic" },
            ]}
          />

          <SelectSetting
            title="Corner style"
            description="Choose how rounded interface panels and controls appear."
            setting="border_radius"
            options={[
              { value: "sharp", label: "Sharp corners" },
              { value: "rounded", label: "Rounded corners" },
              { value: "round", label: "Extra rounded" },
            ]}
          />

          <SelectSetting
            title="Content width"
            description="Choose how much horizontal space content uses."
            setting="content_width"
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "wide", label: "Wide" },
            ]}
          />

          <SelectSetting
            title="Sidebar appearance"
            description="Choose how the navigation sidebar is displayed."
            setting="sidebar_style"
            options={[
              { value: "expanded", label: "Expanded" },
              { value: "compact", label: "Compact" },
            ]}
          />

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
        </div>

        <div
          style={{
            marginTop: "22px",
            padding: "17px",
            borderRadius: "12px",
            background: colours.input,
            border: `1px solid ${colours.border}`,
          }}
        >
          <div style={{ color: colours.muted, fontSize: "11px", marginBottom: "10px" }}>
            LIVE PREVIEW
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius:
                  settings.border_radius === "sharp"
                    ? "4px"
                    : settings.border_radius === "round"
                      ? "18px"
                      : "10px",
                background: accent,
              }}
            />
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

        <SelectSetting
          title="Profile visibility"
          description="Choose who can view your profile."
          setting="profile_visibility"
          options={[
            { value: "public", label: "Public profile" },
            { value: "private", label: "Private profile" },
          ]}
        />

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

        <p style={{ color: colours.muted, fontSize: "11px", lineHeight: 1.5 }}>
          These preferences are saved to your account. Some privacy controls
          still need connecting to their relevant VYBE features before they
          can enforce restrictions.
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

        <p style={{ color: colours.muted, fontSize: "13px", lineHeight: 1.6 }}>
          Manage your VYBE profile and personal information.
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

      {hasChanges && (
        <div
          style={{
            position: "sticky",
            bottom: "15px",
            padding: "15px",
            borderRadius: "14px",
            background: isLight ? "#FFFFFF" : "#201B34",
            border: `1px solid ${colours.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "13px", color: colours.muted }}>
            {message || "You have unsaved changes."}
          </span>

          <div style={{ display: "flex", gap: "9px" }}>
            <button
              type="button"
              onClick={resetChanges}
              disabled={isPending}
              style={{
                padding: "12px 15px",
                border: `1px solid ${colours.border}`,
                borderRadius: "9px",
                background: colours.input,
                color: colours.text,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              onClick={save}
              disabled={isPending}
              style={{
                padding: "12px 17px",
                border: "none",
                borderRadius: "9px",
                background: accent,
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <Save size={16} />
              {isPending ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
      )}

      {!hasChanges && message && (
        <p style={{ color: accent, fontSize: "13px" }}>{message}</p>
      )}
    </div>
  );
}
