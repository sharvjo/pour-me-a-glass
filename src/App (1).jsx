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
        <button key={s} onMouseDown={e => { e.preventDefault(); onSelect(s); onClose(); }} style={{
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

// ─── Wine Glass Icon ──────────────────────────────────────────────────────────

const WineGlassIcon = ({ size = 22, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 10 Q20 40 30 60 Q38 75 50 80 Q62 75 70 60 Q80 40 75 10 Z" stroke={color} strokeWidth="5" fill={filled ? color : "none"} strokeLinejoin="round"/>
    <path d="M35 45 Q45 50 55 44" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <line x1="50" y1="80" x2="50" y2="108" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    <path d="M33 108 Q50 104 67 108" stroke={color} strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

// ─── Cellar Door Icon ─────────────────────────────────────────────────────────

const CellarDoorIcon = ({ size = 22, color = "#5a321a" }) => (
  <svg width={size} height={size} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Arched door body */}
    <path d="M22 122 L22 52 Q22 18 50 18 Q78 18 78 52 L78 122 Z"
      stroke={color} strokeWidth="5"
      fill={color} fillOpacity="0.88"
      strokeLinejoin="round" strokeLinecap="round"/>
    {/* Wood plank divisions */}
    <line x1="40" y1="34" x2="40" y2="119" stroke="#2e1608" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
    <line x1="60" y1="34" x2="60" y2="119" stroke="#2e1608" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
    {/* Brass key handle on the left */}
    <circle cx="31" cy="74" r="3.2" fill="#d49a4a" stroke="#3d2010" strokeWidth="1.2"/>
    <line x1="31" y1="77" x2="31" y2="83" stroke="#d49a4a" strokeWidth="2.6" strokeLinecap="round"/>
  </svg>
);

// ─── Rating Icons ─────────────────────────────────────────────────────────────

const CrossOutIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 22 Q50 48 78 78" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none"/>
    <path d="M78 22 Q50 52 22 78" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none"/>
  </svg>
);

const HeartIcon = ({ size = 18, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 86 C 18 66, 4 42, 20 22 C 32 10, 46 16, 50 30 C 54 16, 68 10, 80 22 C 96 42, 82 66, 50 86 Z"
      stroke={color} strokeWidth="7"
      fill={filled ? color : "none"}
      strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const DoubleHeartIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 90 C 16 68, 2 42, 18 20 C 32 8, 46 14, 50 28 C 54 14, 68 8, 82 20 C 98 42, 84 68, 50 90 Z"
      stroke={color} strokeWidth="6"
      fill="none"
      strokeLinejoin="round" strokeLinecap="round"/>
    <path
      d="M50 76 C 28 60, 18 44, 28 28 C 36 20, 46 24, 50 34 C 54 24, 64 20, 72 28 C 82 44, 72 60, 50 76 Z"
      stroke={color} strokeWidth="5"
      fill="none"
      strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const RATING_COLORS = {
  dislike: "#1a1208",
  like: "#fac2bf",
  love: "#8a101e",
};

const RATING_RANK = { love: 3, like: 2, dislike: 0 };

// Cold-start threshold: history doesn't enter prompts until the user has at least this many ratings.
// Until then, recommendations rely solely on the current ask (color/adjectives/food/dealbreakers).
const RATING_THRESHOLD = 10;

// ─── Wine Type Color ──────────────────────────────────────────────────────────

const WINE_COLORS = {
  red: "#741734",
  rose: "#fac2bf",
  orange: "#d47246",
  white: "#f9e8c0",
  sparkling: "#f9e8c0",
};

const getWineTypeColor = (wine, selectedTypes) => {
  const text = [wine.style, wine.region, wine.grape, wine.name].filter(Boolean).join(" ").toLowerCase();

  // Sparkling first (most distinctive vocabulary)
  if (/sparkling|champagne|cava|prosecco|crémant|cremant|franciacorta|cap classique|pet[- ]?nat|lambrusco|sekt/.test(text)) return WINE_COLORS.sparkling;
  // Rosé
  if (/rosé|\brose\b|rosado|rosato/.test(text)) return WINE_COLORS.rose;
  // Orange / skin contact
  if (/orange wine|skin[- ]?contact|amber wine|ramato/.test(text)) return WINE_COLORS.orange;
  // White grapes & regions
  if (/chardonnay|sauvignon blanc|riesling|pinot grigio|pinot gris|gewürztraminer|gewurztraminer|viognier|chenin blanc|albariño|albarino|vermentino|grüner|gruner|veltliner|semillon|sémillon|marsanne|roussanne|trebbiano|garganega|cortese|falanghina|verdejo|godello|assyrtiko|moscato|muscat|silvaner|sylvaner|chablis|sancerre|muscadet|vouvray|pouilly|mâcon|macon|soave|gavi|white\b/.test(text)) return WINE_COLORS.white;
  // Red grapes & regions
  if (/cabernet|merlot|pinot noir|syrah|shiraz|malbec|tempranillo|sangiovese|nebbiolo|grenache|garnacha|zinfandel|carmen[eè]re|barbera|dolcetto|mourv|cinsault|carignan|gamay|touriga|aglianico|negroamaro|primitivo|montepulciano|nero d'avola|nero davola|valpolicella|chianti|barolo|barbaresco|brunello|amarone|rioja|ribera|bordeaux|beaujolais|c[ôo]tes? du rh[ôo]ne|red\b/.test(text)) return WINE_COLORS.red;

  // Fallback: user's selected wine type(s)
  if (selectedTypes && selectedTypes.length > 0) {
    const t = selectedTypes[0].toLowerCase();
    if (t === "red") return WINE_COLORS.red;
    if (t === "white") return WINE_COLORS.white;
    if (t === "rosé" || t === "rose") return WINE_COLORS.rose;
    if (t === "orange") return WINE_COLORS.orange;
    if (t === "sparkling") return WINE_COLORS.sparkling;
  }

  // Final fallback
  return WINE_COLORS.red;
};

// ─── Wine Card ────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  easy_find: { label: "easy find", color: "#2a7d4f", bg: "#f0f9f4", border: "#c8e6d4" },
  famous: { label: "well-known pick", color: "#1a2b5e", bg: "#f7f3ea", border: "#d6ccba" },
  sommelier: { label: "✦ sommelier pick", color: "#c8232c", bg: "#1a1208", border: "#1a1208" },
};

const MENU_LABELS = ["pick #1", "pick #2", "✦ wildcard"];
const MENU_COLORS = ["#c8232c", "#1a2b5e", "#c8232c"];

const WineCard = ({ wine, index, onSave, isSaved, selectedTypes, rating, onRate }) => {
  const tier = wine.tier && TIER_CONFIG[wine.tier];
  const isMenuWildcard = !tier && index === 2;
  const isSommelier = tier && wine.tier === "sommelier";
  const isDark = isMenuWildcard || isSommelier;
  const isStyleCard = !!wine.style; // no-photo format

  const label = tier ? TIER_CONFIG[wine.tier].label : MENU_LABELS[index] || ("pick #" + (index + 1));
  const labelColor = tier ? TIER_CONFIG[wine.tier].color : (isMenuWildcard ? "rgba(255,255,255,0.6)" : MENU_COLORS[index] || "#c8232c");
  const cardBg = isDark ? (isSommelier ? TIER_CONFIG.sommelier.bg : "#1a2b5e") : (tier ? TIER_CONFIG[wine.tier].bg : "#f7f3ea");
  const cardBorder = isDark ? (isSommelier ? TIER_CONFIG.sommelier.border : "#1a2b5e") : (tier ? TIER_CONFIG[wine.tier].border : "#d6ccba");
  const wineColor = getWineTypeColor(wine, selectedTypes);
  const unsavedColor = isDark ? "rgba(255,255,255,0.45)" : "#73787C";
  const glassColor = isSaved ? wineColor : unsavedColor;
  const saveKey = wine.style || wine.name;

  const ratingGrey = isDark ? "rgba(255,255,255,0.45)" : "#73787C";
  const dislikeActive = isDark ? "#ffffff" : RATING_COLORS.dislike;

  const ratingButtonStyle = (active) => ({
    background: "none", border: "none", cursor: "pointer", padding: "3px",
    opacity: active ? 1 : 0.6,
    transform: active ? "scale(1.15)" : "scale(1)",
    transition: "opacity 0.2s, transform 0.15s",
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  const captionColor = isDark ? "rgba(255,255,255,0.6)" : "#73787C";
  const captionStyle = {
    fontFamily: "'Caveat', cursive", fontSize: "11px", fontWeight: "700",
    letterSpacing: "0.05em", color: captionColor, lineHeight: 1,
  };

  return (
    <div style={{ background: cardBg, border: `2px solid ${cardBorder}`, borderRadius: "12px", padding: "14px 18px 18px", boxShadow: isDark ? "4px 4px 0px rgba(26,43,94,0.25)" : "2px 2px 0px rgba(0,0,0,0.06)", animation: `fadeUp 0.35s ease ${index * 0.1}s both` }}>
      {/* Header row: save (left) + rate this (right) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <button
          onClick={() => onSave({ ...wine, name: saveKey })}
          title={isSaved ? "tap to remove from the cellar" : "save to the cellar"}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
            background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
            opacity: isSaved ? 1 : 0.7,
            transition: "opacity 0.2s, transform 0.15s",
            transform: isSaved ? "scale(1.05)" : "scale(1)",
          }}
        >
          <WineGlassIcon size={22} color={glassColor} filled={isSaved} />
          <span style={{ ...captionStyle, color: isSaved ? wineColor : captionColor }}>save</span>
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              onClick={() => onRate(saveKey, "dislike")}
              title={rating === "dislike" ? "tap to clear" : "didn't like"}
              style={ratingButtonStyle(rating === "dislike")}
            >
              <CrossOutIcon size={18} color={rating === "dislike" ? dislikeActive : ratingGrey} />
            </button>
            <button
              onClick={() => onRate(saveKey, "like")}
              title={rating === "like" ? "tap to clear" : "liked"}
              style={ratingButtonStyle(rating === "like")}
            >
              <HeartIcon size={18} color={rating === "like" ? RATING_COLORS.like : ratingGrey} filled={rating === "like"} />
            </button>
            <button
              onClick={() => onRate(saveKey, "love")}
              title={rating === "love" ? "tap to clear" : "loved"}
              style={ratingButtonStyle(rating === "love")}
            >
              <DoubleHeartIcon size={18} color={rating === "love" ? RATING_COLORS.love : ratingGrey} />
            </button>
          </div>
          <span style={captionStyle}>rate this</span>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: "700", color: isDark ? "rgba(255,255,255,0.7)" : labelColor, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>

        {isStyleCard ? (
          <>
            <div style={{ fontSize: "22px", fontFamily: "'Caveat', cursive", fontWeight: "700", color: isDark ? "#ffffff" : "#1a1208", marginBottom: "2px", lineHeight: 1.2 }}>{wine.style}</div>
            <div style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.55)" : "#a09070", fontFamily: "'Caveat', cursive", marginBottom: "10px", fontWeight: "500" }}>{wine.region}</div>
            <div style={{ fontSize: "14px", color: isDark ? "rgba(255,255,255,0.85)" : "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.6, marginBottom: "10px" }}>{wine.description}</div>
            {wine.producers && wine.producers.length > 0 && (
              <div style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.6)" : C.mutedDark, fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: 1.5 }}>
                Try producers like {wine.producers.slice(0, -1).join(", ")}{wine.producers.length > 1 ? `, and ${wine.producers[wine.producers.length - 1]}` : wine.producers[0]}.
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: "20px", fontFamily: "'Caveat', cursive", fontWeight: "700", color: isDark ? "#ffffff" : "#1a1208", marginBottom: "3px", lineHeight: 1.2 }}>{wine.name}</div>
            {wine.grape && <div style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.55)" : "#a09070", fontFamily: "'Caveat', cursive", marginBottom: "10px", fontWeight: "500" }}>{wine.grape}</div>}
            <div style={{ fontSize: "14px", color: isDark ? "rgba(255,255,255,0.85)" : "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.6 }}>{wine.reason}</div>
          </>
        )}
      </div>
    </div>
  );
};

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

// ─── Lookup Card ──────────────────────────────────────────────────────────────

const LookupCard = ({ wine, onSave, isSaved, rating, onRate }) => {
  const wineColor = getWineTypeColor(wine, []);
  const unsavedColor = "#73787C";
  const glassColor = isSaved ? wineColor : unsavedColor;
  const ratingGrey = "#73787C";

  const ratingButtonStyle = (active) => ({
    background: "none", border: "none", cursor: "pointer", padding: "3px",
    opacity: active ? 1 : 0.6,
    transform: active ? "scale(1.15)" : "scale(1)",
    transition: "opacity 0.2s, transform 0.15s",
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  const captionStyle = {
    fontFamily: "'Caveat', cursive", fontSize: "11px", fontWeight: "700",
    letterSpacing: "0.05em", color: "#73787C", lineHeight: 1,
  };

  const wineForSave = { ...wine, source: "lookup", reason: wine.description };

  return (
    <div style={{
      background: "#f7f3ea", border: `2px solid #d6ccba`, borderRadius: "12px",
      padding: "14px 18px 18px",
      boxShadow: "2px 2px 0px rgba(0,0,0,0.06)",
    }}>
      {/* Header row: save left, rate right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <button
          onClick={() => onSave(wineForSave)}
          title={isSaved ? "tap to remove from the cellar" : "save to the cellar"}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
            background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
            opacity: isSaved ? 1 : 0.7,
            transition: "opacity 0.2s, transform 0.15s",
            transform: isSaved ? "scale(1.05)" : "scale(1)",
          }}
        >
          <WineGlassIcon size={22} color={glassColor} filled={isSaved} />
          <span style={{ ...captionStyle, color: isSaved ? wineColor : "#73787C" }}>save</span>
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button onClick={() => onRate(wine.name, "dislike")} style={ratingButtonStyle(rating === "dislike")}>
              <CrossOutIcon size={18} color={rating === "dislike" ? RATING_COLORS.dislike : ratingGrey} />
            </button>
            <button onClick={() => onRate(wine.name, "like")} style={ratingButtonStyle(rating === "like")}>
              <HeartIcon size={18} color={rating === "like" ? RATING_COLORS.like : ratingGrey} filled={rating === "like"} />
            </button>
            <button onClick={() => onRate(wine.name, "love")} style={ratingButtonStyle(rating === "love")}>
              <DoubleHeartIcon size={18} color={rating === "love" ? RATING_COLORS.love : ratingGrey} />
            </button>
          </div>
          <span style={captionStyle}>rate this</span>
        </div>
      </div>

      {/* Body */}
      <div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: "700", color: wine._approximate ? "#a07020" : "#1a2b5e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
          {wine._approximate ? "best guess" : "about this wine"}
        </div>
        <div style={{ fontSize: "24px", fontFamily: "'Caveat', cursive", fontWeight: "700", color: "#1a1208", lineHeight: 1.15, marginBottom: "2px" }}>{wine.name}</div>
        {wine.region && <div style={{ fontSize: "13px", color: "#a09070", fontFamily: "'Caveat', cursive", fontWeight: "500", marginBottom: "12px" }}>{wine.region}</div>}

        {wine.caveat && (
          <div style={{
            background: "rgba(160,112,32,0.08)", borderLeft: `3px solid #a07020`,
            padding: "8px 12px", borderRadius: "0 8px 8px 0", marginBottom: "14px",
            fontSize: "12px", color: "#5a4218", fontFamily: "'Lora', serif",
            fontStyle: "italic", lineHeight: 1.5,
          }}>{wine.caveat}</div>
        )}

        <div style={{ fontSize: "14px", color: "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.6, marginBottom: "14px" }}>
          {wine.description}
        </div>

        {wine.story && (
          <div style={{
            background: "rgba(26,43,94,0.05)", borderLeft: `3px solid #1a2b5e`,
            padding: "10px 12px", borderRadius: "0 8px 8px 0", marginBottom: "14px",
          }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", fontWeight: "700", color: "#1a2b5e", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>worth knowing</div>
            <div style={{ fontSize: "13px", color: "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.55, fontStyle: "italic" }}>{wine.story}</div>
          </div>
        )}

        {wine.pairings && wine.pairings.length > 0 && (
          <div style={{ marginBottom: wine.verdict ? "14px" : 0 }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", fontWeight: "700", color: "#a09070", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>pairs with</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {wine.pairings.map((p, i) => (
                <span key={i} style={{
                  fontSize: "13px", color: "#3a2e1e", fontFamily: "'Lora', serif",
                  background: "rgba(160,144,112,0.12)", padding: "4px 10px",
                  borderRadius: "12px",
                }}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {wine.verdict && (
          <div style={{
            background: "rgba(200,35,44,0.06)", border: `1px solid rgba(200,35,44,0.2)`,
            padding: "10px 12px", borderRadius: "8px",
          }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", fontWeight: "700", color: "#c8232c", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>for you</div>
            <div style={{ fontSize: "13px", color: "#3a2e1e", fontFamily: "'Lora', serif", lineHeight: 1.55 }}>{wine.verdict}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WinePicker() {
  // Mode: "recommend" (the original mad libs flow) or "lookup" (ask about a specific wine)
  const [mode, setMode] = useState("recommend");

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
  const [winesILove, setWinesILove] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [noMatch, setNoMatch] = useState(null);
  const fileRef = useRef();
  const lookupFileRef = useRef();

  // Lookup mode state
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupImage, setLookupImage] = useState(null);
  const [lookupImageBase64, setLookupImageBase64] = useState(null);
  const [lookupImageMime, setLookupImageMime] = useState("image/jpeg");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null); // the answer card
  const [lookupCandidates, setLookupCandidates] = useState(null); // multi-wine pick step
  const [lookupClarify, setLookupClarify] = useState(null); // { wineDescriptor, questions: [], answers: ["",""] }
  const [lookupError, setLookupError] = useState(null);
  // After saving a looked-up wine, ask "did I get this right?"
  const [verdictPrompt, setVerdictPrompt] = useState(null);

  // Cellar
  const [cellarEntries, setCellarEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pmag_cellar") || "[]"); } catch { return []; }
  });
  const [cellarOpen, setCellarOpen] = useState(false);
  // Track which saved wines are currently expanded in the drawer
  const [expandedSaves, setExpandedSaves] = useState({});
  const toggleExpanded = (key) => {
    setExpandedSaves(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  // Ratings (persist independently of saving — every tap is remembered)
  const [wineRatings, setWineRatings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pmag_ratings") || "{}"); } catch { return {}; }
  });

  // Free-form notes the user adds when rating a wine (fed back into prompts)
  const [wineNotes, setWineNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pmag_notes") || "{}"); } catch { return {}; }
  });

  // Feedback on lookup verdicts: how accurate was the model's description? Fed back into prompts.
  const [verdictFeedback, setVerdictFeedback] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pmag_verdicts") || "{}"); } catch { return {}; }
  });

  // Modal: prompt for "where + what are you eating" before adding to cellar
  const [savePrompt, setSavePrompt] = useState(null); // { wine, location, food } | null
  // Modal: prompt for thoughts after a rating is set
  const [notesPrompt, setNotesPrompt] = useState(null); // { wineKey, rating, draft } | null

  const savedNames = new Set(cellarEntries.map(e => e.name));

  // Tap on the save glass: if already saved, remove silently. If not, open modal.
  const handleSaveWine = (wine) => {
    if (savedNames.has(wine.name)) {
      const updated = cellarEntries.filter(e => e.name !== wine.name);
      setCellarEntries(updated);
      try { localStorage.setItem("pmag_cellar", JSON.stringify(updated)); } catch {}
      return;
    }
    // Pre-fill food field with whatever they currently have in the mad libs (if anything)
    setSavePrompt({ wine, location: "", food: food || "" });
  };

  // Called from the save modal when the user confirms
  const confirmSave = () => {
    if (!savePrompt) return;
    const { wine, location, food: ctxFood } = savePrompt;
    const savedContext = (location || ctxFood)
      ? { location: location.trim(), food: ctxFood.trim() }
      : null;
    const entry = { ...wine, savedAt: new Date().toISOString() };
    if (savedContext) entry.savedContext = savedContext;
    const updated = [...cellarEntries, entry];
    setCellarEntries(updated);
    try { localStorage.setItem("pmag_cellar", JSON.stringify(updated)); } catch {}
    const justSaved = entry;
    setSavePrompt(null);
    // If this came from a lookup, ask whether the model's description was accurate
    if (justSaved.source === "lookup") {
      setVerdictPrompt({
        wineKey: justSaved.name,
        wineDescription: justSaved.reason || justSaved.description || "",
        accuracy: null,
        note: "",
      });
    }
  };

  // Called from the verdict modal: stores accuracy feedback
  const confirmVerdict = () => {
    if (!verdictPrompt) return;
    const { wineKey, accuracy, note } = verdictPrompt;
    if (accuracy) {
      const updated = { ...verdictFeedback, [wineKey]: { accuracy, note: note.trim() || "", at: new Date().toISOString() } };
      setVerdictFeedback(updated);
      try { localStorage.setItem("pmag_verdicts", JSON.stringify(updated)); } catch {}
    }
    setVerdictPrompt(null);
  };

  // Tap on a rating: store it. If the rating became non-null, open notes modal.
  const handleRate = (wineKey, newRating) => {
    const updated = { ...wineRatings };
    let becameActive = false;
    if (updated[wineKey] === newRating) {
      delete updated[wineKey]; // toggle off
    } else {
      updated[wineKey] = newRating;
      becameActive = true;
    }
    setWineRatings(updated);
    try { localStorage.setItem("pmag_ratings", JSON.stringify(updated)); } catch {}
    if (becameActive) {
      setNotesPrompt({ wineKey, rating: newRating, draft: wineNotes[wineKey] || "" });
    }
  };

  // Called from the notes modal
  const confirmNote = () => {
    if (!notesPrompt) return;
    const { wineKey, draft } = notesPrompt;
    const trimmed = draft.trim();
    const updated = { ...wineNotes };
    if (trimmed) {
      updated[wineKey] = trimmed;
    } else {
      delete updated[wineKey];
    }
    setWineNotes(updated);
    try { localStorage.setItem("pmag_notes", JSON.stringify(updated)); } catch {}
    setNotesPrompt(null);
  };

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

  // Lookup mode: separate image upload pipeline, doesn't touch the recommendation flow's image state
  const handleLookupImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLookupImage(URL.createObjectURL(file));
    setLookupResult(null); setLookupCandidates(null); setLookupError(null);
    const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const mime = file.type || "image/jpeg";
    if (supported.includes(mime)) {
      setLookupImageMime(mime);
      const reader = new FileReader();
      reader.onload = ev => setLookupImageBase64(ev.target.result.split(",")[1]);
      reader.readAsDataURL(file);
    } else {
      setLookupImageMime("image/jpeg");
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        setLookupImageBase64(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const clearLookupImage = () => {
    setLookupImage(null);
    setLookupImageBase64(null);
    if (lookupFileRef.current) lookupFileRef.current.value = "";
  };

  const hasLookupEnough = !!(lookupQuery.trim() || lookupImageBase64);

  const buildLookupAnswerPrompt = (wineDescriptor, priorAnswers) => {
    const parts = [];
    parts.push(`The user is asking about this wine: ${wineDescriptor}`);
    if (priorAnswers && priorAnswers.length) {
      parts.push(`Additional details they provided when I asked: ${priorAnswers.map(a => `Q: ${a.q} A: ${a.a}`).join(" | ")}`);
    }
    if (food) parts.push(`They mentioned they may eat: ${food}`);
    if (winesILove) parts.push(`Wines they already love (use to calibrate the verdict): ${winesILove}`);
    const ratingCtx = buildRatingContext();
    if (ratingCtx) parts.push(ratingCtx);
    const verdictCtx = buildVerdictContext();
    if (verdictCtx) parts.push(verdictCtx);
    const personalize = Object.keys(wineRatings).length >= RATING_THRESHOLD;
    const isFollowup = priorAnswers && priorAnswers.length > 0;

    return `You are a knowledgeable sommelier. Concise, confident, dry wit. ${parts.join(". ")}

Tell the user about this wine. ${personalize ? "Include a personalized verdict on whether they'll likely enjoy it, grounded in their taste history." : "Skip the personalized verdict — they don't have enough rating history yet, so do not speculate on whether they'll like it."}

DECISION TREE (apply in order):

1. **You confidently know the specific wine** (you can describe its real producer, region, style, vintage character without inventing) → return status "known" with full details.

2. **You don't recognize this exact wine BUT you'd be guessing** → ${isFollowup
  ? `the user has already answered earlier follow-up questions, so DO NOT ask again. Skip to step 4 (approximate).`
  : `return status "clarify" with EXACTLY two short questions that would help you pin it down. Good questions: producer, vintage, region/appellation, grape, where they saw it. Bad questions: vague taste preferences. Make the questions specific and answerable in a few words.`}

3. **The descriptor is so vague that even with answers you couldn't help** (e.g. just "a Cab") → return status "clarify" with two narrowing questions.

4. **You don't know the specific bottle but you DO know enough about its category** (e.g. "Vena Cava 2019 Sauvignon Blanc from Baja California" — you may not know that exact producer, but you know Baja California Sauvignon Blanc as a category and what 2019 was like there) → return status "approximate" with your best inferred answer based on the grape + region + vintage. Be honest in the "caveat" field about what you couldn't pin down. Still produce a real, useful description / story / pairings the user can act on.

CRITICAL: Never invent specific producer facts, awards, or scores you don't actually know. If you must approximate, the description should be about the grape/region/vintage in general, NOT fabricated specifics about the producer. The "caveat" field is where you say "I don't have specifics on this exact producer, but here's what to expect from this category."

Style rules:
- "name": clean specific wine name, e.g. "Mullineux Kloof Street Rouge 2021" or "Chablis Premier Cru Vaillons" — never with editorial brackets
- "region": grape, region, country — e.g. "Syrah blend, Swartland, South Africa"
- "description": 2 sentences — what it is, how it tastes
- "story": 1-2 sentences — something genuinely interesting. For approximate answers, this should be about the appellation, vintage, or category — not invented producer history.
- "pairings": array of 2-3 specific food suggestions
- "verdict": ${personalize ? "1-2 sentences: will they like it, and why, based on their history" : "empty string"}
- "caveat" (approximate only): 1 sentence explaining what you knew vs guessed, e.g. "I don't have notes on this specific producer, but Baja California Sauv Blancs from 2019 generally..."

Return ONLY this JSON, no markdown:
FORMAT KNOWN: {"status":"known","wine":{"name":"...","region":"...","description":"...","story":"...","pairings":["...","...","..."],"verdict":"..."}}
FORMAT APPROXIMATE: {"status":"approximate","wine":{"name":"...","region":"...","description":"...","story":"...","pairings":["...","...","..."],"verdict":"...","caveat":"..."}}
FORMAT CLARIFY: {"status":"clarify","questions":["question 1?","question 2?"]}`;
  };

  const buildLookupIdentifyPrompt = () => {
    return `You are a sommelier looking at a photo. Your job: identify the wine(s) visible in the image.

If the photo shows ONE wine clearly (a single bottle/label, or a single row of a menu), return status "single".
If the photo shows MULTIPLE wines (a menu page with several wines, or several bottles), return status "multiple" with a list so the user can pick which one they want to know about.
If you can't make out any wine clearly, return status "unreadable".

Return ONLY this JSON, no markdown:
FORMAT SINGLE: {"status":"single","wine":"clean wine identifier as you read it, e.g. 'Domaine Tempier Bandol Rouge 2019'"}
FORMAT MULTIPLE: {"status":"multiple","wines":["wine 1 as on menu","wine 2 as on menu","wine 3 as on menu"]}
FORMAT UNREADABLE: {"status":"unreadable"}`;
  };

  // Single place to interpret a lookup answer response
  const applyLookupAnswer = (parsed, wineDescriptor) => {
    if (parsed.status === "known" || parsed.status === "approximate") {
      setLookupResult({ ...parsed.wine, _approximate: parsed.status === "approximate" });
      setLookupClarify(null);
    } else if (parsed.status === "clarify" && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      setLookupClarify({
        wineDescriptor,
        questions: parsed.questions.slice(0, 2),
        answers: parsed.questions.slice(0, 2).map(() => ""),
      });
    } else {
      setLookupError("Couldn't pull together a confident answer — try adding more detail.");
    }
  };

  // Two-step photo flow: identify → (pick if needed) → answer
  // Text-only flow: skip step 1, go straight to answer
  const handleLookupSubmit = async () => {
    if (!hasLookupEnough) return;
    setLookupLoading(true);
    setLookupResult(null); setLookupCandidates(null); setLookupClarify(null); setLookupError(null);
    try {
      // If there's text, prefer answering the text query directly (no need to identify)
      if (lookupQuery.trim()) {
        const desc = lookupQuery.trim();
        const parsed = await callAPI(buildLookupAnswerPrompt(desc, null), null);
        applyLookupAnswer(parsed, desc);
        return;
      }

      // Photo-only path: identify first
      const lookupImg = { data: lookupImageBase64, mime: lookupImageMime };
      const idParsed = await callAPI(buildLookupIdentifyPrompt(), lookupImg);
      if (idParsed.status === "unreadable") {
        setLookupError("I couldn't read the photo clearly — try a closer/sharper shot.");
        return;
      }
      if (idParsed.status === "multiple") {
        setLookupCandidates(idParsed.wines);
        return; // wait for user to pick
      }
      // status === "single"
      const answerParsed = await callAPI(buildLookupAnswerPrompt(idParsed.wine, null), null);
      applyLookupAnswer(answerParsed, idParsed.wine);
    } catch {
      setLookupError("Something went wrong — try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  // User picked a wine from the multi-wine candidates list
  const handleLookupPick = async (wineDescriptor) => {
    setLookupLoading(true);
    setLookupCandidates(null);
    try {
      const parsed = await callAPI(buildLookupAnswerPrompt(wineDescriptor, null), null);
      applyLookupAnswer(parsed, wineDescriptor);
    } catch {
      setLookupError("Something went wrong — try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  // User answered the clarifying questions — submit answers back to the model
  const handleLookupClarifySubmit = async () => {
    if (!lookupClarify) return;
    const { wineDescriptor, questions, answers } = lookupClarify;
    const priorAnswers = questions.map((q, i) => ({ q, a: answers[i].trim() })).filter(x => x.a);
    setLookupLoading(true);
    setLookupClarify(null);
    try {
      // Force fallback to approximate if clarification yields nothing useful
      const parsed = await callAPI(buildLookupAnswerPrompt(wineDescriptor, priorAnswers), null);
      applyLookupAnswer(parsed, wineDescriptor);
    } catch {
      setLookupError("Something went wrong — try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const resetLookup = () => {
    setLookupResult(null); setLookupCandidates(null); setLookupClarify(null); setLookupError(null);
    setLookupQuery(""); clearLookupImage();
  };

  const hasEnough = wineTypes.length || desc1 || desc2 || desc3 || food;

  // Summarize past ratings for the model so it learns from the user's taste over time.
  // Cold-start: stays empty until the user has at least RATING_THRESHOLD ratings, so early
  // recommendations rely only on what they're asking for in this moment.
  const buildRatingContext = () => {
    const entries = Object.entries(wineRatings);
    if (entries.length < RATING_THRESHOLD) return "";
    const fmt = (k) => {
      const note = wineNotes[k];
      return note ? `${k} — note: "${note}"` : k;
    };
    const loved = entries.filter(([, r]) => r === "love").map(([k]) => fmt(k)).slice(0, 12);
    const liked = entries.filter(([, r]) => r === "like").map(([k]) => fmt(k)).slice(0, 12);
    const disliked = entries.filter(([, r]) => r === "dislike").map(([k]) => fmt(k)).slice(0, 12);
    const out = [];
    out.push(`Background taste history (use only as a tiebreaker after honoring their CURRENT ask above; do not override the wine type, descriptors, dealbreakers, or food they specified just now)`);
    if (loved.length) out.push(`previously loved: ${loved.join("; ")}`);
    if (liked.length) out.push(`previously liked: ${liked.join("; ")}`);
    if (disliked.length) out.push(`previously disliked: ${disliked.join("; ")}`);
    return out.join(". ");
  };

  // Saved-with-context history: where they were, what they were eating.
  // Same cold-start gate as buildRatingContext.
  const buildSaveContext = () => {
    if (Object.keys(wineRatings).length < RATING_THRESHOLD) return "";
    const withCtx = cellarEntries
      .filter(e => e.savedContext && (e.savedContext.location || e.savedContext.food))
      .slice(-10);
    if (!withCtx.length) return "";
    const lines = withCtx.map(e => {
      const c = e.savedContext;
      const parts = [];
      if (c.food) parts.push(`with ${c.food}`);
      if (c.location) parts.push(`at ${c.location}`);
      return `${e.name} (${parts.join(", ")})`;
    });
    return `Background pairing history (only use as a tiebreaker, never to override the current ask): ${lines.join("; ")}`;
  };

  // Verdict feedback: which lookup descriptions were accurate vs off.
  // Gated on the same threshold so it only enters once there's enough history to be meaningful.
  const buildVerdictContext = () => {
    const entries = Object.entries(verdictFeedback);
    if (!entries.length || Object.keys(wineRatings).length < RATING_THRESHOLD) return "";
    const off = entries.filter(([, v]) => v.accuracy === "off");
    const partial = entries.filter(([, v]) => v.accuracy === "partial");
    const out = [];
    if (off.length) {
      const summary = off.slice(0, 6).map(([k, v]) => v.note ? `${k}: "${v.note}"` : k).join("; ");
      out.push(`Past lookup descriptions the user flagged as wrong (be more careful with similar wines): ${summary}`);
    }
    if (partial.length) {
      const summary = partial.slice(0, 6).map(([k, v]) => v.note ? `${k}: "${v.note}"` : k).join("; ");
      out.push(`Past lookup descriptions the user flagged as partially right: ${summary}`);
    }
    return out.join(". ");
  };

  const buildFirstPassPrompt = () => {
    const parts = [];
    if (wineTypes.length) parts.push(`Wine type: ${wineTypes.join(", ")}`);
    const descs = [desc1, desc2, desc3].filter(Boolean);
    if (descs.length) parts.push(`Descriptors: ${descs.join(", ")}`);
    if (dontWant) parts.push(`Dealbreakers (must avoid): ${dontWant}`);
    if (food) parts.push(`Food: ${food}`);
    if (winesILove) parts.push(`Wines they already love (use to calibrate style): ${winesILove}`);
    const ratingCtx = buildRatingContext();
    if (ratingCtx) parts.push(ratingCtx);
    const saveCtx = buildSaveContext();
    if (saveCtx) parts.push(saveCtx);
    const verdictCtx = buildVerdictContext();
    if (verdictCtx) parts.push(verdictCtx);

    if (imageBase64) {
      return `You are a knowledgeable sommelier at a great wine bar. Concise, confident, dry wit. I have uploaded a photo of a by-the-glass wine list. My preferences: ${parts.join(". ")}

MISMATCH RULE: A mismatch occurs when you cannot find a wine on the list that both (a) pairs well with the food AND (b) matches at least 2 of the stated style criteria. If mismatch, do NOT force bad picks. Scan the ENTIRE list. Food pairing is top priority.

PRIORITY HIERARCHY (apply in order, never let a lower one override a higher one):
1. Wine type / color the user just selected (red, white, rosé, orange, sparkling) — non-negotiable when stated
2. Descriptors / adjectives the user just typed (the mad libs)
3. Food they're eating right now
4. Dealbreakers they listed
5. Wines they said they already love (calibration)
6. Background taste history, if any (only as tiebreaker between picks that all satisfy 1-5)
The user's CURRENT ask in this conversation always outranks their history. If they ask for white tonight, never recommend a red just because they've loved reds before.

Return ONLY one of these JSON formats, no markdown:
FORMAT A: {"status":"match","picks":[{"name":"wine name as on menu","grape":"grape/region","reason":"1-2 sentences, confident"},{"name":"...","grape":"...","reason":"..."},{"name":"...","grape":"...","reason":"wildcard - most interesting on list"}]}
FORMAT B: {"status":"clarify","intro":"honest 1-2 sentence explanation","questions":[{"key":"wineType","label":"How important is it that it is [wine type]?","options":[{"value":"must","label":"non-negotiable"},{"value":"prefer","label":"I would prefer it"},{"value":"flexible","label":"flexible"}]},{"key":"foodFirst","label":"[food-specific suggestion]?","options":[{"value":"yes","label":"yes, go for it"},{"value":"no","label":"stick to my criteria"}]}]}`;
    } else {
      return `You are a knowledgeable sommelier at a great wine bar. Concise, confident, dry wit. No wine list — give exactly 4 specific style-based recommendations tailored tightly to what the person asked for. My preferences: ${parts.join(". ")}

Food pairing is top priority. 

PRIORITY HIERARCHY (apply in order, never let a lower one override a higher one):
1. Wine type / color the user just selected (red, white, rosé, orange, sparkling) — non-negotiable when stated
2. Descriptors / adjectives the user just typed (the mad libs)
3. Food they're eating right now
4. Dealbreakers they listed
5. Wines they said they already love (calibration)
6. Background taste history, if any (only as tiebreaker between picks that all satisfy 1-5)
The user's CURRENT ask in this conversation always outranks their history. If they ask for white tonight, never recommend a red just because they've loved reds before.

Style naming rules — this is critical:
- The "style" field must be a clean, specific wine name a sommelier would say out loud: "Chablis Premier Cru", "Ribera del Duero Reserva", "Swartland Chenin Blanc", "Barolo", "Grüner Veltliner Smaragd"
- Never use parentheses, slashes, or descriptors in the style name — not "Orange Wine (Skin-Contact)", not "Crisp White / Albariño"
- The region field handles the grape and place: "Chardonnay, Burgundy, France" or "Tempranillo, Castilla y León, Spain"
- The description must directly reference the person's preferences and food — specific, not generic

The 4 picks must be:
1. tier "easy_find" — approachable, crowd-pleasing, widely available style that fits their ask precisely
2. tier "famous" — a well-known classic on good restaurant lists, specific to their preferences
3. tier "famous" — a DIFFERENT well-known classic, distinct in region or grape from #2 but still fitting the ask (must not duplicate #2's style)
4. tier "sommelier" — something more interesting or unexpected, still fits their ask

CRITICAL: Return EXACTLY 4 picks. Each MUST have a "tier" field. Picks #2 and #3 must be meaningfully different from each other.

Return ONLY this JSON, no markdown:
{"status":"match","picks":[{"style":"Chablis Premier Cru","region":"Chardonnay, Burgundy, France","description":"2 sentences directly referencing their preferences and food","tier":"easy_find","producers":["Producer 1","Producer 2","Producer 3","Producer 4"]},{"style":"...","region":"...","description":"...","tier":"famous","producers":["...","...","...","..."]},{"style":"...","region":"...","description":"...","tier":"famous","producers":["...","...","...","..."]},{"style":"...","region":"...","description":"...","tier":"sommelier","producers":["...","...","...","..."]}]}`;
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
    if (winesILove) parts.push(`Wines they already love (use to calibrate style): ${winesILove}`);
    const ratingCtx = buildRatingContext();
    if (ratingCtx) parts.push(ratingCtx);
    const saveCtx = buildSaveContext();
    if (saveCtx) parts.push(saveCtx);
    const verdictCtx = buildVerdictContext();
    if (verdictCtx) parts.push(verdictCtx);

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

  const callAPI = async (prompt, imgOverride) => {
    const img = imgOverride !== undefined ? imgOverride : (imageBase64 ? { data: imageBase64, mime: imageMime } : null);
    const msgContent = img
      ? [
          { type: "image", source: { type: "base64", media_type: img.mime, data: img.data } },
          { type: "text", text: prompt }
        ]
      : [{ type: "text", text: prompt }];
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 1500, messages: [{ role: "user", content: msgContent }] })
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

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lora', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        input::placeholder { color: #b8a888; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `3px solid ${C.blue}`, borderTop: `3px solid ${C.red}`,
        background: C.paper, padding: "22px 24px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "42px", fontWeight: "700", color: C.red, lineHeight: 1 }}>
            pour me a glass
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, marginTop: "4px", fontStyle: "italic" }}>
            snap a wine list · get your picks
          </div>
        </div>
        <button onClick={() => setCellarOpen(true)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
          background: "none", border: "none", cursor: "pointer", padding: "4px 6px",
          flexShrink: 0, marginLeft: "8px",
        }}>
          <CellarDoorIcon size={28} color="#5a321a" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "11px", color: "#5a321a", fontWeight: "700", letterSpacing: "0.04em" }}>
            {cellarEntries.length > 0 ? `the cellar (${cellarEntries.length})` : "the cellar"}
          </span>
        </button>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "28px 20px 56px" }}>

        {/* Mode toggle */}
        <div style={{
          display: "flex", gap: "0",
          background: C.paper, border: `2px solid ${C.border}`, borderRadius: "12px",
          padding: "4px", marginBottom: "20px",
        }}>
          {[
            { key: "recommend", label: "find me a wine" },
            { key: "lookup", label: "look up a wine" },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: "8px",
                background: mode === m.key ? C.red : "transparent",
                color: mode === m.key ? "#fff" : C.mutedDark,
                border: "none", cursor: "pointer",
                fontFamily: "'Caveat', cursive", fontSize: "16px", fontWeight: "700",
                letterSpacing: "0.03em", transition: "all 0.15s",
              }}
            >{m.label}</button>
          ))}
        </div>

        {mode === "recommend" && (<>

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
              {result.map((wine, i) => {
                const key = wine.style || wine.name;
                return <WineCard
                  key={i} wine={wine} index={i}
                  onSave={handleSaveWine} isSaved={savedNames.has(key)}
                  selectedTypes={wineTypes}
                  rating={wineRatings[key] || null}
                  onRate={handleRate}
                />;
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: "22px" }}>
              <button onClick={reset} style={{
                fontSize: "16px", color: C.muted, background: "none", border: "none",
                cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
              }}>↺ start over</button>
            </div>
          </div>
        )}

        </>)}

        {mode === "lookup" && (<>
          {/* Photo (optional) */}
          <div onClick={() => lookupFileRef.current && lookupFileRef.current.click()} style={{
            border: `2.5px dashed ${lookupImage ? C.red : C.border}`,
            borderRadius: "12px", minHeight: lookupImage ? "auto" : "96px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden",
            background: lookupImage ? C.paper : "rgba(255,255,255,0.4)",
            marginBottom: "16px", transition: "all 0.2s",
            position: "relative",
          }}>
            {lookupImage
              ? <>
                  <img src={lookupImage} alt="Wine" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
                  <button onClick={(e) => { e.stopPropagation(); clearLookupImage(); }} style={{
                    position: "absolute", top: "8px", right: "8px",
                    background: "rgba(0,0,0,0.55)", color: "#fff", border: "none",
                    borderRadius: "50%", width: "26px", height: "26px",
                    cursor: "pointer", fontSize: "16px", lineHeight: 1,
                  }}>×</button>
                </>
              : <div style={{ textAlign: "center", color: C.muted, padding: "20px" }}>
                  <div style={{ fontSize: "30px", marginBottom: "6px" }}>📸</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", fontWeight: "600" }}>snap the bottle or one row of a menu</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>optional</div>
                </div>}
            <input ref={lookupFileRef} type="file" accept="image/*" onChange={handleLookupImage} style={{ display: "none" }} />
          </div>

          {/* Text input */}
          <div style={{
            background: C.paper, border: `2px solid ${C.border}`, borderRadius: "14px",
            padding: "18px 20px", marginBottom: "20px",
            boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
              color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px",
            }}>tell me about this wine</div>
            <textarea
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              placeholder="type of wine? producer? wine name? vintage? description from menu?"
              rows={3}
              style={{
                width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                borderRadius: "10px", color: C.text, fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "10px 14px", outline: "none",
                resize: "vertical", lineHeight: 1.4,
              }}
            />
          </div>

          {/* Submit / loading / candidates / clarify / result / error */}
          {!lookupLoading && !lookupResult && !lookupCandidates && !lookupClarify && !lookupError && (
            <button
              onClick={handleLookupSubmit}
              disabled={!hasLookupEnough}
              style={{
                width: "100%", padding: "14px",
                background: hasLookupEnough ? C.red : C.border,
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "18px", fontFamily: "'Caveat', cursive", fontWeight: "700",
                cursor: hasLookupEnough ? "pointer" : "not-allowed",
                boxShadow: hasLookupEnough ? "2px 2px 0px rgba(200,35,44,0.25)" : "none",
                transition: "all 0.15s",
              }}
            >look it up →</button>
          )}

          {lookupLoading && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: C.red, fontWeight: "600" }}>checking the cellar in my head...</div>
            </div>
          )}

          {lookupCandidates && (
            <div style={{
              background: C.paper, border: `2px solid ${C.blue}`, borderRadius: "14px",
              padding: "18px 20px", marginBottom: "16px",
              boxShadow: "2px 2px 0px rgba(26,43,94,0.1)",
            }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: "700", color: C.blue, marginBottom: "4px" }}>which one?</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, fontStyle: "italic", marginBottom: "14px" }}>I see a few wines in that photo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {lookupCandidates.map((w, i) => (
                  <button key={i} onClick={() => handleLookupPick(w)} style={{
                    textAlign: "left", padding: "12px 14px",
                    background: C.chip, border: `2px solid ${C.chipBorder}`,
                    borderRadius: "10px", cursor: "pointer",
                    fontFamily: "'Caveat', cursive", fontSize: "16px", fontWeight: "600",
                    color: C.text,
                  }}>{w}</button>
                ))}
              </div>
            </div>
          )}

          {lookupClarify && (
            <div style={{
              background: C.paper, border: `2px solid ${C.blue}`, borderRadius: "14px",
              padding: "18px 20px", marginBottom: "16px",
              boxShadow: "2px 2px 0px rgba(26,43,94,0.1)",
            }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: "700", color: C.blue, marginBottom: "4px" }}>a couple of quick questions</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, fontStyle: "italic", marginBottom: "14px" }}>
                this'll help me give you a better answer — answer what you can, skip what you don't know
              </div>

              {lookupClarify.questions.map((q, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <label style={{
                    display: "block", marginBottom: "6px",
                    fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700",
                    color: C.text, letterSpacing: "0.03em",
                  }}>{q}</label>
                  <input
                    value={lookupClarify.answers[i]}
                    onChange={e => {
                      const newAnswers = [...lookupClarify.answers];
                      newAnswers[i] = e.target.value;
                      setLookupClarify({ ...lookupClarify, answers: newAnswers });
                    }}
                    placeholder="not sure? leave blank"
                    style={{
                      width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                      borderRadius: "10px", color: C.text, fontSize: "15px",
                      fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "9px 14px", outline: "none",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button
                  onClick={() => { setLookupClarify(null); resetLookup(); }}
                  style={{
                    flex: "0 0 auto", padding: "10px 16px",
                    background: "none", color: C.muted, border: `2px solid ${C.border}`,
                    borderRadius: "10px", fontSize: "15px",
                    fontFamily: "'Caveat', cursive", fontWeight: "600", cursor: "pointer",
                  }}
                >start over</button>
                <button
                  onClick={handleLookupClarifySubmit}
                  style={{
                    flex: 1, padding: "10px",
                    background: C.red, color: "#fff", border: "none",
                    borderRadius: "10px", fontSize: "16px",
                    fontFamily: "'Caveat', cursive", fontWeight: "700", cursor: "pointer",
                    boxShadow: "2px 2px 0px rgba(200,35,44,0.25)",
                  }}
                >give me your best answer →</button>
              </div>
            </div>
          )}

          {lookupError && (
            <div style={{
              background: C.paper, border: `2px solid ${C.muted}`, borderRadius: "14px",
              padding: "18px 20px", marginBottom: "16px",
            }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: C.text, lineHeight: 1.5 }}>{lookupError}</div>
              <button onClick={resetLookup} style={{
                marginTop: "12px", padding: "8px 16px",
                background: "none", color: C.red, border: `2px solid ${C.red}`,
                borderRadius: "8px", cursor: "pointer",
                fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: "700",
              }}>try again</button>
            </div>
          )}

          {lookupResult && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <LookupCard
                wine={lookupResult}
                onSave={handleSaveWine}
                isSaved={savedNames.has(lookupResult.name)}
                rating={wineRatings[lookupResult.name] || null}
                onRate={handleRate}
              />
              <div style={{ textAlign: "center", marginTop: "22px" }}>
                <button onClick={resetLookup} style={{
                  fontSize: "16px", color: C.muted, background: "none", border: "none",
                  cursor: "pointer", fontFamily: "'Caveat', cursive", fontWeight: "600",
                }}>↺ look up another</button>
              </div>
            </div>
          )}
        </>)}
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "4px",
        background: `linear-gradient(to right, ${C.red} 50%, ${C.blue} 50%)`,
      }} />

      {/* Save context modal — appears when saving a wine, asks for location + food */}
      {savePrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={() => setSavePrompt(null)} style={{ position: "absolute", inset: 0, background: "rgba(26,18,8,0.55)" }} />
          <div style={{
            position: "relative", width: "min(440px, 100%)",
            background: C.paper, border: `2px solid ${C.blue}`, borderRadius: "16px",
            padding: "26px 24px 22px",
            boxShadow: "4px 4px 0px rgba(26,43,94,0.2)",
            animation: "fadeUp 0.25s ease both",
          }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: "700", color: C.red, lineHeight: 1.1 }}>
              save to the cellar
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, fontStyle: "italic", marginTop: "4px", marginBottom: "18px" }}>
              {savePrompt.wine.style || savePrompt.wine.name}
            </div>

            <label style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.text, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>where are you?</label>
            <input
              autoFocus
              value={savePrompt.location}
              onChange={e => setSavePrompt({ ...savePrompt, location: e.target.value })}
              placeholder="Lei, my kitchen, that wine bar in Williamsburg..."
              style={{
                width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                borderRadius: "10px", color: C.text, fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "10px 14px", outline: "none",
                marginBottom: "16px",
              }}
            />

            <label style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: "700", color: C.text, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>what are you eating?</label>
            <input
              value={savePrompt.food}
              onChange={e => setSavePrompt({ ...savePrompt, food: e.target.value })}
              placeholder="lamb chops, oysters, just the wine..."
              style={{
                width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                borderRadius: "10px", color: C.text, fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "500", padding: "10px 14px", outline: "none",
                marginBottom: "20px",
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setSavePrompt(null)} style={{
                flex: "0 0 auto", padding: "12px 18px",
                background: "none", color: C.muted, border: `2px solid ${C.border}`,
                borderRadius: "10px", fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "600", cursor: "pointer",
              }}>cancel</button>
              <button onClick={confirmSave} style={{
                flex: 1, padding: "12px",
                background: C.red, color: "#fff", border: "none",
                borderRadius: "10px", fontSize: "16px",
                fontFamily: "'Caveat', cursive", fontWeight: "700", cursor: "pointer",
                boxShadow: "2px 2px 0px rgba(200,35,44,0.25)",
              }}>save it →</button>
            </div>
          </div>
        </div>
      )}

      {/* Notes modal — appears after rating, asks for thoughts */}
      {notesPrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={() => setNotesPrompt(null)} style={{ position: "absolute", inset: 0, background: "rgba(26,18,8,0.55)" }} />
          <div style={{
            position: "relative", width: "min(440px, 100%)",
            background: C.paper, border: `2px solid ${notesPrompt.rating === "love" ? RATING_COLORS.love : (notesPrompt.rating === "like" ? "#d49aa0" : "#3a2e1e")}`,
            borderRadius: "16px", padding: "26px 24px 22px",
            boxShadow: "4px 4px 0px rgba(26,43,94,0.18)",
            animation: "fadeUp 0.25s ease both",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              {notesPrompt.rating === "love" && <DoubleHeartIcon size={22} color={RATING_COLORS.love} />}
              {notesPrompt.rating === "like" && <HeartIcon size={22} color={RATING_COLORS.like} filled={true} />}
              {notesPrompt.rating === "dislike" && <CrossOutIcon size={20} color={RATING_COLORS.dislike} />}
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: "700", color: C.red, lineHeight: 1.1 }}>
                {notesPrompt.rating === "love" ? "what made you love it?" : notesPrompt.rating === "like" ? "what did you like?" : "what put you off?"}
              </div>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, fontStyle: "italic", marginBottom: "16px" }}>
              {notesPrompt.wineKey} · helps the algorithm learn your taste
            </div>

            <textarea
              autoFocus
              value={notesPrompt.draft}
              onChange={e => setNotesPrompt({ ...notesPrompt, draft: e.target.value })}
              placeholder="too tannic, paired great with the lamb, reminded me of that Mullineux..."
              rows={4}
              style={{
                width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                borderRadius: "10px", color: C.text, fontSize: "15px",
                fontFamily: "'Lora', serif", fontWeight: "400", padding: "12px 14px", outline: "none",
                marginBottom: "18px", resize: "vertical", lineHeight: 1.5,
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setNotesPrompt(null)} style={{
                flex: "0 0 auto", padding: "12px 18px",
                background: "none", color: C.muted, border: `2px solid ${C.border}`,
                borderRadius: "10px", fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "600", cursor: "pointer",
              }}>skip</button>
              <button onClick={confirmNote} style={{
                flex: 1, padding: "12px",
                background: C.red, color: "#fff", border: "none",
                borderRadius: "10px", fontSize: "16px",
                fontFamily: "'Caveat', cursive", fontWeight: "700", cursor: "pointer",
                boxShadow: "2px 2px 0px rgba(200,35,44,0.25)",
              }}>save thoughts →</button>
            </div>
          </div>
        </div>
      )}

      {/* Verdict accuracy modal — appears after saving a looked-up wine */}
      {verdictPrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={() => setVerdictPrompt(null)} style={{ position: "absolute", inset: 0, background: "rgba(26,18,8,0.55)" }} />
          <div style={{
            position: "relative", width: "min(440px, 100%)",
            background: C.paper, border: `2px solid ${C.blue}`, borderRadius: "16px",
            padding: "26px 24px 22px",
            boxShadow: "4px 4px 0px rgba(26,43,94,0.18)",
            animation: "fadeUp 0.25s ease both",
          }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: "700", color: C.red, lineHeight: 1.1 }}>
              did I get it right?
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: C.muted, fontStyle: "italic", marginTop: "4px", marginBottom: "14px" }}>
              your feedback helps me describe wines better next time
            </div>

            {verdictPrompt.wineDescription && (
              <div style={{
                background: C.chip, border: `2px solid ${C.chipBorder}`,
                borderRadius: "10px", padding: "10px 12px", marginBottom: "16px",
                fontFamily: "'Lora', serif", fontSize: "13px", color: C.textBody,
                lineHeight: 1.5, fontStyle: "italic",
              }}>
                "{verdictPrompt.wineDescription}"
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                { key: "accurate", label: "spot on", color: "#2a7d4f" },
                { key: "partial", label: "partly", color: "#a07020" },
                { key: "off", label: "not really", color: RATING_COLORS.love },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setVerdictPrompt({ ...verdictPrompt, accuracy: opt.key })}
                  style={{
                    padding: "12px 14px", textAlign: "left",
                    background: verdictPrompt.accuracy === opt.key ? `${opt.color}15` : C.chip,
                    border: `2px solid ${verdictPrompt.accuracy === opt.key ? opt.color : C.chipBorder}`,
                    borderRadius: "10px", cursor: "pointer",
                    fontFamily: "'Caveat', cursive", fontSize: "16px",
                    fontWeight: verdictPrompt.accuracy === opt.key ? "700" : "500",
                    color: verdictPrompt.accuracy === opt.key ? opt.color : C.text,
                    transition: "all 0.15s",
                  }}
                >{opt.label}</button>
              ))}
            </div>

            {verdictPrompt.accuracy && verdictPrompt.accuracy !== "accurate" && (
              <textarea
                value={verdictPrompt.note}
                onChange={e => setVerdictPrompt({ ...verdictPrompt, note: e.target.value })}
                placeholder={verdictPrompt.accuracy === "off" ? "what was wrong? e.g. it was much fuller-bodied than described..." : "what was off? optional..."}
                rows={3}
                style={{
                  width: "100%", background: C.chip, border: `2px solid ${C.chipBorder}`,
                  borderRadius: "10px", color: C.text, fontSize: "14px",
                  fontFamily: "'Lora', serif", fontWeight: "400", padding: "10px 12px", outline: "none",
                  marginBottom: "16px", resize: "vertical", lineHeight: 1.5,
                }}
              />
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setVerdictPrompt(null)} style={{
                flex: "0 0 auto", padding: "12px 18px",
                background: "none", color: C.muted, border: `2px solid ${C.border}`,
                borderRadius: "10px", fontSize: "15px",
                fontFamily: "'Caveat', cursive", fontWeight: "600", cursor: "pointer",
              }}>skip</button>
              <button onClick={confirmVerdict} disabled={!verdictPrompt.accuracy} style={{
                flex: 1, padding: "12px",
                background: verdictPrompt.accuracy ? C.red : C.border,
                color: "#fff", border: "none",
                borderRadius: "10px", fontSize: "16px",
                fontFamily: "'Caveat', cursive", fontWeight: "700",
                cursor: verdictPrompt.accuracy ? "pointer" : "not-allowed",
                boxShadow: verdictPrompt.accuracy ? "2px 2px 0px rgba(200,35,44,0.25)" : "none",
              }}>send →</button>
            </div>
          </div>
        </div>
      )}

      {/* Cellar drawer */}
      {cellarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setCellarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(26,18,8,0.5)" }} />
          <div style={{
            position: "relative", width: "min(400px, 100vw)", height: "100%",
            background: C.bg, overflowY: "auto",
            borderLeft: `3px solid ${C.blue}`,
            display: "flex", flexDirection: "column",
            animation: "slideInRight 0.3s ease both",
          }}>
            <div style={{
              borderBottom: `2px solid ${C.border}`, padding: "22px 22px 16px",
              background: C.paper, position: "sticky", top: 0, zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: "700", color: C.red }}>the cellar</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", color: C.muted, fontStyle: "italic" }}>
                  {cellarEntries.length} {cellarEntries.length === 1 ? "wine saved" : "wines saved"}
                </div>
              </div>
              <button onClick={() => setCellarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: C.muted }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ padding: "18px 18px 40px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {cellarEntries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
                  <WineGlassIcon size={36} color={C.muted} />
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", marginTop: "14px", fontWeight: "600" }}>nothing saved yet</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", marginTop: "6px", fontStyle: "italic" }}>tap the glass icon on any pick to save it</div>
                </div>
              ) : (
                cellarEntries.slice().sort((a, b) => {
                  const rA = wineRatings[a.name];
                  const rB = wineRatings[b.name];
                  const rankA = rA ? RATING_RANK[rA] : 1;
                  const rankB = rB ? RATING_RANK[rB] : 1;
                  if (rankA !== rankB) return rankB - rankA; // higher rank first
                  return new Date(b.savedAt) - new Date(a.savedAt); // newer first within tier
                }).map((wine, i) => {
                  const wineKey = wine.style || wine.name;
                  const isExpanded = !!expandedSaves[wineKey];
                  const tierColor = wine.tier && TIER_CONFIG[wine.tier] ? TIER_CONFIG[wine.tier].color : C.muted;
                  const r = wineRatings[wineKey];
                  const ctx = wine.savedContext;
                  const dateStr = new Date(wine.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  return (
                    <div key={wineKey}>
                      {/* Collapsed label row — always visible, click to toggle */}
                      <button
                        onClick={() => toggleExpanded(wineKey)}
                        style={{
                          width: "100%",
                          background: C.paper,
                          border: `2px solid ${C.border}`,
                          borderLeft: `4px solid ${tierColor}`,
                          borderRadius: "10px",
                          padding: "12px 14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          opacity: r === "dislike" ? 0.7 : 1,
                          boxShadow: isExpanded ? "none" : "2px 2px 0px rgba(0,0,0,0.05)",
                          textAlign: "left",
                        }}
                      >
                        <span style={{
                          fontFamily: "'Caveat', cursive",
                          fontSize: "19px",
                          fontWeight: "700",
                          color: C.text,
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>{wineKey}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          {r === "love" && <DoubleHeartIcon size={16} color={RATING_COLORS.love} />}
                          {r === "like" && <HeartIcon size={16} color={RATING_COLORS.like} filled={true} />}
                          {r === "dislike" && <CrossOutIcon size={14} color={RATING_COLORS.dislike} />}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded: full WineCard + saved-with footer */}
                      {isExpanded && (
                        <div style={{ marginTop: "8px", animation: "fadeUp 0.2s ease both" }}>
                          <WineCard
                            wine={wine}
                            index={i}
                            onSave={handleSaveWine}
                            isSaved={true}
                            selectedTypes={[]}
                            rating={r || null}
                            onRate={handleRate}
                          />
                          <div style={{
                            marginTop: "-2px", padding: "8px 14px 10px",
                            fontFamily: "'Lora', serif", fontSize: "12px",
                            color: C.muted, fontStyle: "italic", lineHeight: 1.4,
                          }}>
                            {ctx && (ctx.food || ctx.location) ? (
                              <>
                                saved {ctx.food && <>with <span style={{ color: C.textBody, fontStyle: "normal", fontWeight: 600 }}>{ctx.food}</span></>}
                                {ctx.food && ctx.location && " "}
                                {ctx.location && <>at <span style={{ color: C.textBody, fontStyle: "normal", fontWeight: 600 }}>{ctx.location}</span></>}
                                {" · "}{dateStr}
                              </>
                            ) : (
                              <>saved {dateStr}</>
                            )}
                            {wineNotes[wineKey] && (
                              <div style={{ marginTop: "4px", color: C.textBody, fontStyle: "italic" }}>
                                "{wineNotes[wineKey]}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
