import { useState, useEffect } from "react";

const LS_AVATAR = "sigil.avatar";

interface AvatarSettings {
  faceShape: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  clothing: string;
}

const DEFAULTS: AvatarSettings = {
  faceShape: "default",
  hairStyle: "default",
  eyeColor: "blue",
  skinTone: "medium",
  clothing: "casual",
};

function load(): AvatarSettings {
  try {
    const raw = localStorage.getItem(LS_AVATAR);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

const SKIN_TONES: Record<string, string> = {
  light: "#f0c8a0",
  medium: "#c68642",
  dark: "#8d5524",
};

const EYE_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  brown: "#92400e",
  hazel: "#a16207",
};

export default function AvatarScreen() {
  const [settings, setSettings] = useState<AvatarSettings>(load);

  useEffect(() => {
    localStorage.setItem(LS_AVATAR, JSON.stringify(settings));
  }, [settings]);

  const update = (key: keyof AvatarSettings, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const faceClass = `avatar-face-shape-${settings.faceShape}`;
  const hairClass = `avatar-hair-${settings.hairStyle}`;

  return (
    <div className="screen-content">
      <div className="screen-header">
        <h2>Avatar</h2>
        <p className="screen-subtitle">
          Companion appearance — saved locally on this device
        </p>
      </div>
      <div className="avatar-customization">
        <div className="avatar-preview">
          <div className={`avatar-large ${faceClass} ${hairClass}`}>
            <div className="avatar-head" style={{ backgroundColor: SKIN_TONES[settings.skinTone] }}>
              <div className="avatar-hair-top"></div>
              <div className="avatar-eyes-large">
                <div className="eye-large" style={{ backgroundColor: EYE_COLORS[settings.eyeColor] }}></div>
                <div className="eye-large" style={{ backgroundColor: EYE_COLORS[settings.eyeColor] }}></div>
              </div>
              <div className="avatar-mouth-large"></div>
              <div className={`avatar-clothing avatar-clothing-${settings.clothing}`}></div>
            </div>
          </div>
        </div>
        <div className="avatar-controls">
          {(
            [
              ["faceShape", "Face Shape", ["default", "round", "oval", "square"]],
              ["hairStyle", "Hair Style", ["default", "short", "long", "curly"]],
              ["eyeColor", "Eye Color", ["blue", "green", "brown", "hazel"]],
              ["skinTone", "Skin Tone", ["light", "medium", "dark"]],
              ["clothing", "Clothing", ["casual", "formal", "professional"]],
            ] as [keyof AvatarSettings, string, string[]][]
          ).map(([key, label, options]) => (
            <div className="control-group" key={key}>
              <label>{label}</label>
              <select value={settings[key]} onChange={(e) => update(key, e.target.value)}>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
