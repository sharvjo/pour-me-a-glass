import { useState, useRef } from "react";

const WINE_TYPES = ["Red", "White", "Rosé", "Orange", "Sparkling", "Surprise me"];
const DESCRIPTOR_SUGGESTIONS = [
  "fruity", "earthy", "funky", "crisp", "tannic", "mineral", "juicy",
  "smoky", "floral", "spicy", "buttery", "acidic", "dry", "rich",
  "light", "bold", "silky", "peppery", "herbaceous", "fizzy"
];
const FOOD_SUGGESTIONS = [
  "tacos", "birria tacos", "steak", "salmon", "pasta", "sushi", "pizza", "lamb",
  "chicken", "oysters", "cheese", "pork", "vegetarian", "seafood", "burgers", "nothing"
];
const EXTRAS = ["on the cheaper side", "sustainable", "natural/low-intervention", "women-owned", "organic"];
const DEALBREAKER_SUGGESTIONS = [
  "tannins", "sparkling", "more than $100", "oaky", "sweet", "bitter", "orange wine", "rosé", "under $20", "too acidic", "heavy", "buttery"
];

const C = {
  bg: "#f0ebe0",
  paper: "#f7f3ea",
  border: "#d6ccba",
  red: "#c8232c",
  blue: "#1a2b5e",
  muted: "#a09070",
  mutedDark: "#6a5a40",
  text: "#1a1208",
  textBody: "#3a2e1e",
  chip: "#ede8dc",
  chipBorder: "#cfc8b4",
};

// ─── Suggestion Popover ───────────────────────────────────────────────────────

function SuggestionPopover({ suggestions, onSelect, onClose, inputRect }) {
  return (
    <div style={{
      position: "fixed",
      top: inputRect ? inputRect.bottom + 6 : 100,
      left: inputRect ? Math.max(8, inputRect.left - 8) : 8,
      background: C.paper,
      border: `2px solid ${C.blue}`,
      borderRadius: "10px",
      zIndex: 1000,
      padding: "10px",
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      maxWidth: "300px",
      boxShadow: "3px 3px 0px rgba(26,43,94,0.15)",
    }}>
      {suggestions.map(s => (
        <button key={s} onClick={() => { onSelect(s); onClose(); }} style={{
          padding: "5px 13px", borderRadius: "20px",
          border: `1.5px solid ${C.chipBorder}`, background: C.chip,
          color: C.textBody, fontSize: "14px", fontFamily: "'Caveat', cursive",
          cursor: "pointer", fontWeight: "500",
        }}>{s}</button>
      ))}
    </div>
  );
}

// ─── Blank Input ──────────────────────────────────────────────────────────────

function BlankInput({ value, onChange, placeholder, suggestions, width = "110px" }) {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef();

  const handleFocus = () => {
    setFocused(true);
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setShowSuggestions(true);
  };

  const filtered = suggestions.filter(s =>
    !value || s.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 12);

  return (
    <>
      <span style={{ display: "inline-block" }}>
        <input
          ref={ref}
          value={value}
          onChange={e => { onChange(e.target.value); if (ref.current) setRect(ref.current.getBoundingClientRect()); }}
          onFocus={handleFocus}
          onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
          placeholder={placeholder}
          style={{
            width, background: "transparent", border: "none",
            borderBottom: `2.5px solid ${focused ? C.red : (value ? C.red : C.muted)}`,
            color: value ? C.red : C.muted, fontSize: "inherit",
            fontFamily: "'Caveat', cursive", fontWeight: value ? "700" : "400",
            padding: "1px 4px", outline: "none", transition: "all 0.15s", textAlign: "center",
          }}
        />
      </span>
      {showSuggestions && filtered.length > 0 && (
        <SuggestionPopover suggestions={filtered} onSelect={onChange}
          onClose={() => setShowSuggestions(false)} inputRect={rect} />
      )}
    </>
  );
}

// ─── Wine Card ────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  easy_find: { label: "easy find", color: "#2a7d4f", bg: "#f0f9f4", border: "#c8e6d4" },
  famous: { label: "well-known pick", color: "#1a2b5e", bg: "#f7f3ea", border: "#d6ccba" },
  sommelier: { label: "✦ sommelier pick", color: "#c8232c", bg: "#1a1208", border: "#1a1208" },
};

const MENU_LABELS = ["pick #1", "pick #2", "✦ wildcard"];
const MENU_COLORS = ["#c8232c", "#1a2b5e", "#c8232c"];

const WineCard = ({ wine, index, onSave, isSaved }) => {
  const tier = wine.tier && TIER_CONFIG[wine.tier];
  const isMenuWildcard = !tier && index === 2;
  const isSommelier = tier && wine.tier === "sommelier";
  const isDark = isMenuWildcard || isSommelier;

  const label = tier ? TIER_CONFIG[wine.tier].label : MENU_LABELS[index] || ("pick #" + (index + 1));
  const labelColor = tier ? TIER_CONFIG[wine.tier].color : (isMenuWildcard ? "rgba(255,255,255,0.6)" : MENU_COLORS[index] || "#c8232c");
  const cardBg = isDark ? (isSommelier ? TIER_CONFIG.sommelier.bg : "#1a2b5e") : (tier ? TIER_CONFIG[wine.tier].bg : "#f7f3ea");
  const cardBorder = isDark ? (isSommelier ? TIER_CONFIG.sommelier.border : "#1a2b5e") : (tier ? TIER_CONFIG[wine.tier].border : "#d6ccba");

  return (
    <div style={{ background: cardBg, border: `2px solid ${cardBorder}`, borderRadius: "12px", padding: "18px 20px", boxShadow: isDark ? "4px 4px 0px rgba(26,43,94,0.25)" : "2px 2px 0px rgba(0,0,0,0.06)", animation: `fadeUp 0.35s ease ${index * 0.1}s both`, position: "relative" }}>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: "700", color: isDark ? "rgba(255,255,255,0.7)" : labelColor, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "20px", fontFamily: "'Caveat', cursive", fontWeight: "700", color: isDark ? "#ffffff" : "#1a1208", marginBottom: "3px", lineHeight: 1.2 }}>{wine.name}</div>
      {wine.grape && <div style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.55)" : "#a09070", fontFamily: "'Caveat', cursive", marginBottom: "10px", fontWeight: "500" }}>{wine.grape}</div>}
      <div style={{ fontSize: "14px", color: isDark ? "rgba(255,255,255,0.85)" : "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.6 }}>{wine.reason}</div>
      <button onClick={() => onSave(wine)} style={{
        position: "absolute", top: "14px", right: "14px",
        background: "none", border: "none", cursor: "pointer",
        fontSize: "20px", lineHeight: 1, padding: "2px",
        opacity: isSaved ? 1 : 0.4, transition: "opacity 0.2s, transform 0.15s",
      }}
        title={isSaved ? "saved!" : "save this wine"}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >🍷</button>
    </div>
  );
};

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({ wine, mode, onSave, onClose }) {
  const [rating, setRating] = useState(null);
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  const [eating, setEating] = useState("");
  const [notes, setNotes] = useState("");

  useState(() => {
    if (!navigator.geolocation) { setLocationLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const addr = data.address;
          const place = addr.restaurant || addr.bar || addr.cafe || addr.amenity || addr.neighbourhood || addr.suburb || addr.city_district || addr.city || addr.town || "";
          setLocation(place);
        } catch { setLocation(""); }
        setLocationLoading(false);
      },
      () => { setLocationLoading(false); }
    );
  }, []);

  const RATINGS = [
    { value: "disliked", label: "👎", desc: "didn't like" },
    { value: "liked", label: "👍", desc: "liked" },
    { value: "loved", label: "👍👍", desc: "loved" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,18,8,0.6)",
      zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeUp 0.2s ease both",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: C.paper, borderRadius: "18px 18px 0 0",
        border: `2px solid ${C.border}`, borderBottom: "none",
        padding: "28px 24px 40px", width: "100%", maxWidth: "520px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", fontWeight: "700", color: C.text, lineHeight: 1.2 }}>{wine.name}</div>
            {wine.grape && <div style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: C.muted, marginTop: "2px" }}>{wine.grape}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: C.muted, padding: 0 }}>✕</button>
        </div>

        {/* Rating */}
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.blue, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>how was it?</div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {RATINGS.map(r => {
            const sel = rating === r.value;
            return (
              <button key={r.value} onClick={() => setRating(r.value)} style={{
                flex: 1, padding: "10px 6px", borderRadius: "12px",
                border: `2px solid ${sel ? C.red : C.chipBorder}`,
                background: sel ? "rgba(200,35,44,0.08)" : C.chip,
                cursor: "pointer", transition: "all 0.15s", textAlign: "center",
              }}>
                <div style={{ fontSize: "22px", lineHeight: 1 }}>{r.label}</div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: sel ? C.red : C.mutedDark, fontWeight: sel ? "700" : "500", marginTop: "4px" }}>{r.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Location */}
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.blue, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>where are you?</div>
        <input
          value={locationLoading ? "" : location}
          onChange={e => setLocation(e.target.value)}
          placeholder={locationLoading ? "detecting location..." : "restaurant, bar, city..."}
          style={{
            width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
            borderRadius: "10px", color: C.text, fontSize: "14px",
            fontFamily: "'Caveat', cursive", fontWeight: "500",
            padding: "9px 14px", outline: "none", marginBottom: "14px", boxSizing: "border-box",
          }}
        />

        {/* What you ate */}
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.blue, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>what were you eating?</div>
        <input
          value={eating}
          onChange={e => setEating(e.target.value)}
          placeholder="steak frites, lamb chops, cheese board..."
          style={{
            width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
            borderRadius: "10px", color: C.text, fontSize: "14px",
            fontFamily: "'Caveat', cursive", fontWeight: "500",
            padding: "9px 14px", outline: "none", marginBottom: "14px", boxSizing: "border-box",
          }}
        />

        {/* Notes */}
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.blue, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>notes (optional)</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="really earthy, opened up after 10 mins, would order again..."
          rows={2}
          style={{
            width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
            borderRadius: "10px", color: C.text, fontSize: "14px",
            fontFamily: "'Caveat', cursive", fontWeight: "500",
            padding: "9px 14px", outline: "none", resize: "none",
            marginBottom: "20px", boxSizing: "border-box",
          }}
        />

        <button
          onClick={() => rating && onSave({ rating, location, eating, notes, mode })}
          disabled={!rating}
          style={{
            width: "100%", padding: "14px",
            background: rating ? C.red : C.border,
            color: rating ? "#fff" : C.muted,
            border: "none", borderRadius: "12px",
            fontSize: "17px", fontFamily: "'Caveat', cursive", fontWeight: "700",
            cursor: rating ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}
        >save this wine →</button>
      </div>
    </div>
  );
}

// ─── Saved Wines Section ──────────────────────────────────────────────────────

function SavedWines({ saved, onClear }) {
  const [open, setOpen] = useState(false);
  if (saved.length === 0) return null;

  const RATING_ORDER = ["loved", "liked", "disliked"];
  const RATING_LABELS = { loved: "👍👍 loved", liked: "👍 liked", disliked: "👎 didn't like" };

  const grouped = RATING_ORDER.reduce((acc, r) => {
    const wines = saved.filter(w => w.rating === r).sort((a, b) => b.savedAt - a.savedAt);
    if (wines.length) acc[r] = wines;
    return acc;
  }, {});

  return (
    <div style={{ borderTop: `3px solid ${C.border}`, marginTop: "40px", paddingTop: "28px" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0,
      }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: "700", color: C.blue }}>
          my wines 🍷 <span style={{ fontSize: "14px", color: C.muted, fontWeight: "500" }}>({saved.length})</span>
        </div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: C.muted }}>{open ? "▲" : "▼"}</div>
      </button>

      {open && (
        <div style={{ marginTop: "20px" }}>
          {RATING_ORDER.filter(r => grouped[r]).map(r => (
            <div key={r} style={{ marginBottom: "24px" }}>
              <div style={{
                fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700",
                color: C.blue, textTransform: "uppercase", letterSpacing: "0.06em",
                marginBottom: "12px", borderBottom: `1.5px dashed ${C.border}`, paddingBottom: "6px",
              }}>{RATING_LABELS[r]}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {grouped[r].map((w, i) => (
                  <div key={i} style={{
                    background: C.paper, border: `2px solid ${C.border}`, borderRadius: "12px",
                    padding: "14px 16px", boxShadow: "2px 2px 0px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", fontWeight: "700", color: C.text }}>{w.name}</div>
                        {w.grape && <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: C.muted }}>{w.grape}</div>}
                      </div>
                      <div style={{ fontFamily: "'Caveat', cursive", fontSize: "11px", color: C.muted, textAlign: "right", flexShrink: 0, marginLeft: "10px" }}>
                        {new Date(w.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        <br />
                        <span style={{ fontSize: "10px", color: C.muted, opacity: 0.7 }}>{w.mode === "menu" ? "from menu" : "no menu"}</span>
                      </div>
                    </div>
                    {w.location && <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: C.mutedDark, marginTop: "6px" }}>📍 {w.location}</div>}
                    {w.eating && <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: C.mutedDark, marginTop: "3px" }}>🍽 {w.eating}</div>}
                    {w.notes && <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.textBody, marginTop: "6px", fontStyle: "italic", lineHeight: 1.5 }}>"{w.notes}"</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={onClear} style={{
            fontSize: "13px", color: C.muted, background: "none", border: "none",
            cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
            marginTop: "8px",
          }}>clear all saved wines</button>
        </div>
      )}
    </div>
  );
}

function ClarificationCard({ clarification, onSubmit }) {
  const [answers, setAnswers] = useState({});

  const setAnswer = (key, val) => setAnswers(prev => ({ ...prev, [key]: val }));

  const allAnswered = clarification.questions.every(q => answers[q.key] !== undefined);

  return (
    <div style={{
      background: C.paper, border: `2px solid ${C.blue}`,
      borderRadius: "14px", padding: "22px 20px",
      boxShadow: "3px 3px 0px rgba(26,43,94,0.15)",
      animation: "fadeUp 0.3s ease both",
    }}>
      <div style={{
        fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
        color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px",
      }}>hold on a sec</div>
      <div style={{
        fontFamily: "'Lora', serif", fontSize: "14px", color: C.textBody,
        lineHeight: 1.6, marginBottom: "20px",
      }}>{clarification.intro}</div>

      {clarification.questions.map(q => (
        <div key={q.key} style={{ marginBottom: "18px" }}>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700",
            color: C.text, marginBottom: "8px",
          }}>{q.label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {q.options.map(opt => {
              const sel = answers[q.key] === opt.value;
              return (
                <button key={opt.value} onClick={() => setAnswer(q.key, opt.value)} style={{
                  padding: "6px 14px", borderRadius: "20px",
                  border: `2px solid ${sel ? C.red : C.chipBorder}`,
                  background: sel ? "rgba(200,35,44,0.08)" : C.chip,
                  color: sel ? C.red : C.mutedDark,
                  fontSize: "14px", fontFamily: "'Caveat', cursive",
                  fontWeight: sel ? "700" : "500", cursor: "pointer", transition: "all 0.15s",
                }}>{opt.label}</button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={() => allAnswered && onSubmit(answers)}
        disabled={!allAnswered}
        style={{
          width: "100%", padding: "14px",
          background: allAnswered ? C.red : C.border,
          color: allAnswered ? "#fff" : C.muted,
          border: "none", borderRadius: "12px",
          fontSize: "17px", fontFamily: "'Caveat', cursive", fontWeight: "700",
          cursor: allAnswered ? "pointer" : "not-allowed", transition: "all 0.2s",
          marginTop: "6px",
        }}
      >
        try again with this →
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WinePicker() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [wineTypes, setWineTypes] = useState([]);
  const toggleWineType = (t) => setWineTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [desc3, setDesc3] = useState("");
  const [dontWant, setDontWant] = useState("");
  const [food, setFood] = useState("");
  const [extras, setExtras] = useState([]);
  const [extrasText, setExtrasText] = useState("");
  const [winesILove, setWinesILove] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [noMatch, setNoMatch] = useState(null);
  const [ratingWine, setRatingWine] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pmag_saved") || "[]"); } catch { return []; }
  });
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setResult(null); setClarification(null); setNoMatch(null);
    const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const mime = file.type || "image/jpeg";
    if (supported.includes(mime)) {
      setImageMime(mime);
      const reader = new FileReader();
      reader.onload = ev => setImageBase64(ev.target.result.split(",")[1]);
      reader.readAsDataURL(file);
    } else {
      setImageMime("image/jpeg");
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        setImageBase64(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const toggleExtra = (e) => setExtras(prev =>
    prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
  );

  const hasEnough = wineTypes.length || desc1 || desc2 || desc3 || food;

  const buildFirstPassPrompt = () => {
    const parts = [];
    if (wineTypes.length) parts.push(`Wine type: ${wineTypes.join(", ")}`);
    const descs = [desc1, desc2, desc3].filter(Boolean);
    if (descs.length) parts.push(`Descriptors: ${descs.join(", ")}`);
    if (dontWant) parts.push(`Dealbreakers (must avoid): ${dontWant}`);
    if (food) parts.push(`Food: ${food}`);
    if (extras.length || extrasText) parts.push(`Also care about: ${[...extras, extrasText].filter(Boolean).join(", ")}`);
    if (winesILove) parts.push(`Wines they already love (use to calibrate style): ${winesILove}`);

    if (imageBase64) {
      return `You are a knowledgeable sommelier at a great wine bar. Concise, confident, dry wit. I have uploaded a photo of a by-the-glass wine list. My preferences: ${parts.join(". ")}

MISMATCH RULE: A mismatch occurs when you cannot find a wine on the list that both (a) pairs well with the food AND (b) matches at least 2 of the stated style criteria. If mismatch, do NOT force bad picks. Scan the ENTIRE list. Food pairing is top priority.

Return ONLY one of these JSON formats, no markdown:
FORMAT A: {"status":"match","picks":[{"name":"wine name as on menu","grape":"grape/region","reason":"1-2 sentences, confident"},{"name":"...","grape":"...","reason":"..."},{"name":"...","grape":"...","reason":"wildcard - most interesting on list"}]}
FORMAT B: {"status":"clarify","intro":"honest 1-2 sentence explanation","questions":[{"key":"wineType","label":"How important is it that it is [wine type]?","options":[{"value":"must","label":"non-negotiable"},{"value":"prefer","label":"I would prefer it"},{"value":"flexible","label":"flexible"}]},{"key":"foodFirst","label":"[food-specific suggestion]?","options":[{"value":"yes","label":"yes, go for it"},{"value":"no","label":"stick to my criteria"}]}]}`;
    } else {
      return `You are a knowledgeable sommelier at a great wine bar. Concise, confident, dry wit. No wine list - give 4 wine recommendations at different levels. My preferences: ${parts.join(". ")}

Food pairing is top priority. Each pick should name a specific wine by producer and name, not just a category.

The 4 picks must be:
1. "easy_find" - one widely available, recognizable producer anyone can find at a wine shop (the crowd-pleaser)
2. "famous" - a well-known quality producer, the kind of name that shows up on good restaurant lists
3. "famous" - another well-known quality producer, different style or region from #2
4. "sommelier" - a smaller, more interesting producer that a wine bar person would recommend, the kind of bottle that starts a conversation

Return ONLY this JSON, no markdown:
{"status":"match","picks":[{"name":"Producer, Wine Name","grape":"grape/region","reason":"1-2 sentences","tier":"easy_find"},{"name":"Producer, Wine Name","grape":"grape/region","reason":"1-2 sentences","tier":"famous"},{"name":"Producer, Wine Name","grape":"grape/region","reason":"1-2 sentences","tier":"famous"},{"name":"Producer, Wine Name","grape":"grape/region","reason":"1-2 sentences","tier":"sommelier"}]}`;
    }
  };

  const buildSecondPassPrompt = (clarificationAnswers) => {
    const parts = [];
    if (wineTypes.length) parts.push(`Original wine type request: ${wineTypes.join(", ")} (importance: ${clarificationAnswers.wineType || "flexible"})`);
    const descs = [desc1, desc2, desc3].filter(Boolean);
    if (descs.length) parts.push(`Style descriptors: ${descs.join(", ")}`);
    if (dontWant) parts.push(`Dealbreakers (must avoid these no matter what): ${dontWant}`);
    if (food) parts.push(`Food: ${food}`);
    if (clarificationAnswers.foodFirst === "yes") parts.push("User is open to wine type that pairs best with the food even if it differs from original request");
    if (clarificationAnswers.wineType === "must") parts.push(`User insists on ${wineType} — prioritize this even if food pairing is imperfect`);
    if (extras.length || extrasText) parts.push(`Also care about: ${[...extras, extrasText].filter(Boolean).join(", ")}`);
    if (winesILove) parts.push(`Wines they already love (use to calibrate style): ${winesILove}`);

    return `You are a knowledgeable sommelier who works at a great wine bar. Concise, confident, dry wit.

I've uploaded a photo of a by-the-glass wine list. Updated preferences after clarification: ${parts.join(". ")}

Give me the best 3 picks you can. If nothing is truly good, be honest in the reason. If absolutely nothing works, return:
{ "status": "nomatch", "message": "one dry honest sentence — tell them to change their order or skip the wine." }

Otherwise return:
{
  "status": "match",
  "picks": [
    { "name": "wine name as on menu", "grape": "grape/region", "reason": "1-2 sentences, confident and specific" },
    { "name": "wine name as on menu", "grape": "grape/region", "reason": "1-2 sentences, confident and specific" },
    { "name": "wine name as on menu", "grape": "grape/region", "reason": "wildcard — most interesting or unusual on the list" }
  ]
}

No markdown, no extra text.`;
  };

  const callAPI = async (prompt) => {
    const msgContent = imageBase64
      ? [
          { type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } },
          { type: "text", text: prompt }
        ]
      : [{ type: "text", text: prompt }];
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 1000, messages: [{ role: "user", content: msgContent }] })
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || "").join("") || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

    const handleSubmit = async () => {
    if (!hasEnough) return;
    setLoading(true);
    setResult(null); setClarification(null); setNoMatch(null);
    try {
      const parsed = await callAPI(buildFirstPassPrompt());
      if (parsed.status === "match") {
        setResult(parsed.picks);
      } else if (parsed.status === "clarify") {
        setClarification(parsed);
      } else if (parsed.status === "nomatch") {
        setNoMatch(parsed.message);
      }
    } catch {
      setNoMatch(imageBase64 ? "Couldn't read the list — try a clearer photo." : "Something went wrong — try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationSubmit = async (answers) => {
    setLoading(true);
    setClarification(null); setResult(null); setNoMatch(null);
    try {
      const parsed = await callAPI(buildSecondPassPrompt(answers));
      if (parsed.status === "match") {
        setResult(parsed.picks);
      } else {
        setNoMatch(parsed.message);
      }
    } catch {
      setNoMatch("Something went wrong — try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null); setClarification(null); setNoMatch(null);
    setImage(null); setImageBase64(null); setImageMime("image/jpeg");
    setWineTypes([]); setDesc1(""); setDesc2(""); setDesc3(""); setDontWant("");
    setFood(""); setExtras([]); setExtrasText(""); setWinesILove("");
  };

  const handleSaveWine = (wine) => setRatingWine(wine);

  const handleRatingSave = (ratingData) => {
    const entry = {
      ...ratingWine,
      ...ratingData,
      savedAt: Date.now(),
      mode: imageBase64 ? "menu" : "no-menu",
    };
    const updated = [entry, ...saved];
    setSaved(updated);
    localStorage.setItem("pmag_saved", JSON.stringify(updated));
    setRatingWine(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lora', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #b8a888; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `3px solid ${C.blue}`, borderTop: `3px solid ${C.red}`,
        background: C.paper, padding: "22px 24px 18px", textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "42px", fontWeight: "700", color: C.red, lineHeight: 1 }}>
          pour me a glass
        </div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, marginTop: "4px", fontStyle: "italic" }}>
          snap a wine list · get your picks
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "28px 20px 56px" }}>

        {/* Photo upload */}
        <div onClick={() => fileRef.current.click()} style={{
          border: `2.5px dashed ${image ? C.red : C.border}`,
          borderRadius: "12px", minHeight: image ? "auto" : "96px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", overflow: "hidden",
          background: image ? C.paper : "rgba(255,255,255,0.4)",
          marginBottom: "24px", transition: "all 0.2s",
        }}>
          {image
            ? <img src={image} alt="Wine list" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: C.muted, padding: "20px" }}>
                <div style={{ fontSize: "30px", marginBottom: "6px" }}>📸</div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "17px", fontWeight: "600" }}>snap or upload a wine list (optional)</div>
              </div>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }}  />
        {image && (
          <button onClick={() => fileRef.current.click()} style={{
            fontSize: "13px", color: C.muted, background: "none", border: "none",
            cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
            display: "block", marginBottom: "20px", marginTop: "-16px", padding: 0,
          }}>↺ use a different photo</button>
        )}

        {/* Mad libs */}
        <div style={{
          background: C.paper, border: `2px solid ${C.border}`, borderRadius: "14px",
          padding: "24px 22px 20px", marginBottom: "16px",
          fontSize: "19px", color: C.mutedDark,
          fontFamily: "'Caveat', cursive", fontWeight: "500",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
        }}>
          {/* Line 1 */}
          <div style={{ lineHeight: "2.8" }}>
            {"I want a "}
            <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px", verticalAlign: "middle" }}>
              {["Red", "White", "Rosé", "Orange", "Sparkling"].map(t => {
                const sel = wineTypes.includes(t);
                return (
                  <button key={t} onClick={() => toggleWineType(t)} style={{
                    padding: "4px 12px", borderRadius: "20px",
                    border: `2px solid ${sel ? C.red : C.chipBorder}`,
                    background: sel ? "rgba(200,35,44,0.08)" : C.chip,
                    color: sel ? C.red : C.mutedDark,
                    fontSize: "15px", fontFamily: "'Caveat', cursive",
                    fontWeight: sel ? "700" : "500", cursor: "pointer", transition: "all 0.15s",
                  }}>{t}</button>
                );
              })}
            </div>
            {" wine that is "}
            <BlankInput value={desc1} onChange={setDesc1} placeholder="___" suggestions={DESCRIPTOR_SUGGESTIONS} width="80px" />
            {", "}
            <BlankInput value={desc2} onChange={setDesc2} placeholder="___" suggestions={DESCRIPTOR_SUGGESTIONS} width="80px" />
            {", "}
            <BlankInput value={desc3} onChange={setDesc3} placeholder="___" suggestions={DESCRIPTOR_SUGGESTIONS} width="80px" />
            {" and I don't want "}
            <BlankInput value={dontWant} onChange={setDontWant} placeholder="___" suggestions={DEALBREAKER_SUGGESTIONS} width="110px" />
            {"."}
          </div>
          {/* Line 2 */}
          <div style={{ lineHeight: "2.8", borderTop: `1.5px dashed ${C.border}`, marginTop: "6px", paddingTop: "4px" }}>
            {"I am eating "}
            <BlankInput value={food} onChange={setFood} placeholder="___" suggestions={FOOD_SUGGESTIONS} width="130px" />
            {"."}
          </div>
        </div>

        {/* Extras */}
        <div style={{
          background: C.paper, border: `2px solid ${C.border}`, borderRadius: "14px",
          padding: "18px 20px", marginBottom: "16px",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
            color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px",
          }}>other things I care about</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {EXTRAS.map(e => {
              const sel = extras.includes(e);
              return (
                <button key={e} onClick={() => toggleExtra(e)} style={{
                  padding: "6px 14px", borderRadius: "20px",
                  border: `2px solid ${sel ? C.red : C.chipBorder}`,
                  background: sel ? "rgba(200,35,44,0.08)" : C.chip,
                  color: sel ? C.red : C.mutedDark,
                  fontSize: "14px", fontFamily: "'Caveat', cursive",
                  fontWeight: sel ? "700" : "500", cursor: "pointer", transition: "all 0.15s",
                }}>{e}</button>
              );
            })}
          </div>
          <input
            value={extrasText}
            onChange={e => setExtrasText(e.target.value)}
            placeholder="anything else... something from the Rhône, not too oaky..."
            style={{
              width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
              borderRadius: "10px", color: C.text, fontSize: "14px",
              fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "9px 14px", outline: "none",
            }}
          />
        </div>

        {/* Wines I love */}
        <div style={{
          background: C.paper, border: `2px solid ${C.border}`, borderRadius: "14px",
          padding: "18px 20px", marginBottom: "22px",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
            color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px",
          }}>wines I already love</div>
          <input
            value={winesILove}
            onChange={e => setWinesILove(e.target.value)}
            placeholder="Mullineux Kloof Street, anything from Hamilton Russell, Sancerre..."
            style={{
              width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
              borderRadius: "10px", color: C.text, fontSize: "14px",
              fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "9px 14px", outline: "none",
            }}
          />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!hasEnough || loading} style={{
          width: "100%", padding: "16px",
          background: hasEnough && !loading ? C.red : C.border,
          color: hasEnough && !loading ? "#fff" : C.muted,
          border: "none", borderRadius: "12px", fontSize: "18px",
          fontFamily: "'Caveat', cursive", fontWeight: "700",
          cursor: hasEnough && !loading ? "pointer" : "not-allowed",
          transition: "all 0.2s", marginBottom: "28px",
          boxShadow: hasEnough && !loading ? "3px 3px 0px rgba(200,35,44,0.25)" : "none",
        }}>
          {loading ? (imageBase64 ? "reading the list..." : "finding your wines...") : (imageBase64 ? "get my picks →" : "just recommend me something →")}
        </button>

        {/* Clarification */}
        {clarification && (
          <ClarificationCard clarification={clarification} onSubmit={handleClarificationSubmit} />
        )}

        {/* No match */}
        {noMatch && (
          <div style={{
            background: C.paper, border: `2px solid ${C.red}`, borderRadius: "14px",
            padding: "20px 22px", boxShadow: "3px 3px 0px rgba(200,35,44,0.15)",
            animation: "fadeUp 0.3s ease both",
          }}>
            <div style={{
              fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
              color: C.red, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px",
            }}>yeah... about that</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: C.textBody, lineHeight: 1.6 }}>
              {noMatch}
            </div>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button onClick={reset} style={{
                fontSize: "15px", color: C.muted, background: "none", border: "none",
                cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
              }}>↺ start over</button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            <div style={{
              fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
              color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px",
            }}>your picks</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.map((wine, i) => (
                <WineCard
                  key={i} wine={wine} index={i}
                  onSave={handleSaveWine}
                  isSaved={saved.some(s => s.name === wine.name)}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "22px" }}>
              <button onClick={reset} style={{
                fontSize: "16px", color: C.muted, background: "none", border: "none",
                cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
              }}>↺ start over</button>
            </div>
          </div>
        )}

        {/* Saved wines */}
        <SavedWines
          saved={saved}
          onClear={() => { setSaved([]); localStorage.removeItem("pmag_saved"); }}
        />
      </div>

      {/* Rating modal */}
      {ratingWine && (
        <RatingModal
          wine={ratingWine}
          mode={imageBase64 ? "menu" : "no-menu"}
          onSave={handleRatingSave}
          onClose={() => setRatingWine(null)}
        />
      )}

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "4px",
        background: `linear-gradient(to right, ${C.red} 50%, ${C.blue} 50%)`,
      }} />
    </div>
  );
}
