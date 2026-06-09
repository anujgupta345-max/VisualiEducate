import { useState } from "react";

const modules = [
  {
    id: "identity",
    icon: "👤",
    title: "Identity Engine",
    subtitle: "Who they were",
    color: "#C8A96E",
    bg: "rgba(200,169,110,0.08)",
    features: [
      { name: "Face Recognition", desc: "Train avatar on uploaded photos — old albums, events, passports. Recognizes family members in real-time video calls.", tech: "DeepFace / AWS Rekognition" },
      { name: "Voice Cloning", desc: "Even 10–30 seconds of old audio (voicemails, wedding videos) can recreate their voice with emotional tone.", tech: "ElevenLabs / OpenVoice" },
      { name: "Personality Model", desc: "Analyze writing style from old WhatsApp chats, Facebook posts, SMSes to recreate how they expressed love, humor, advice.", tech: "Fine-tuned LLM on personal data" },
      { name: "Memory Graph", desc: "A knowledge graph of people they knew, places they loved, stories they told — grows richer over time.", tech: "Neo4j / LangChain Memory" },
    ]
  },
  {
    id: "social",
    icon: "🌐",
    title: "Social Connector",
    subtitle: "Still present in the family",
    color: "#6EB5C8",
    bg: "rgba(110,181,200,0.08)",
    features: [
      { name: "Facebook Legacy Integration", desc: "Read old Facebook timeline, posts, reactions, comments. Avatar responds in their style when tagged or mentioned.", tech: "Meta Graph API (legacy)" },
      { name: "WhatsApp Presence", desc: "With family consent, avatar can send messages in family groups — festival greetings, birthday wishes, advice — in their voice and tone.", tech: "WhatsApp Business API + voice synthesis" },
      { name: "Instagram Memory Feed", desc: "Curates old photos on anniversaries, birthdays. 'Dadi would have loved this picture of you'", tech: "Instagram Graph API" },
      { name: "YouTube Memory Reel", desc: "Generates a yearly memory video with narration in their voice.", tech: "FFMPEG + ElevenLabs + GPT-4o" },
    ]
  },
  {
    id: "hologram",
    icon: "✨",
    title: "Hologram Avatar",
    subtitle: "See them, hear them",
    color: "#9B6EC8",
    bg: "rgba(155,110,200,0.08)",
    features: [
      { name: "2D Animated Avatar", desc: "Lip-synced talking head on phone/tablet screen. Realistic enough for everyday family moments.", tech: "D-ID / HeyGen / SadTalker" },
      { name: "3D Hologram (Advanced)", desc: "On a holographic display device, they appear as a 3D figure. Can be used at family events, pujas, memorials.", tech: "Looking Glass Portrait / Volume display" },
      { name: "AR Overlay", desc: "Point your phone at their old photograph — they come alive, smile, say 'beta, I'm proud of you.'", tech: "ARKit / ARCore + face reenactment" },
      { name: "Video Call Mode", desc: "Join a family Zoom/Google Meet as an AI participant. Avatar responds naturally to what family says.", tech: "Virtual camera + real-time LLM + voice" },
    ]
  },
  {
    id: "wisdom",
    icon: "📚",
    title: "Wisdom & Guidance",
    subtitle: "Their values, forever",
    color: "#6EC87A",
    bg: "rgba(110,200,122,0.08)",
    features: [
      { name: "Daily Blessings", desc: "Every morning, children/grandchildren receive a voice message in Dadi's or Nana's voice — a blessing, a proverb, a memory.", tech: "Scheduled GPT + voice synthesis" },
      { name: "Study Companion", desc: "Avatar guides students with the patience and warmth of that grandparent who always believed in them.", tech: "RAG on personal wisdom + LLM tutor" },
      { name: "Life Advice Engine", desc: "Career dilemmas, relationship advice, big decisions — avatar responds as they would have, drawing from their documented values.", tech: "Personality-aligned fine-tuned model" },
      { name: "Festival Rituals Guide", desc: "Explains family traditions, rituals, recipes exactly as they used to — keeping culture alive across generations.", tech: "Knowledge base + multilingual LLM" },
    ]
  },
  {
    id: "recognition",
    icon: "🔍",
    title: "Family Recognition",
    subtitle: "They know everyone",
    color: "#C86E6E",
    bg: "rgba(200,110,110,0.08)",
    features: [
      { name: "Family Face Database", desc: "Avatar can identify each family member by face and greet them personally — 'Arjun, you look just like your grandfather at your age.'", tech: "Face embeddings + vector DB" },
      { name: "Voice ID", desc: "Recognizes each family member's voice in calls. Personalizes conversation depth and tone accordingly.", tech: "Speaker diarization + voice embedding" },
      { name: "Relationship Context", desc: "Knows family tree: who married whom, who lives where, who was the avatar's favorite. Keeps relationship context sacred.", tech: "Knowledge graph + family tree DB" },
      { name: "Milestone Tracker", desc: "Tracks exams, birthdays, anniversaries of all family members. Sends personal congratulations in avatar's voice.", tech: "Calendar sync + event triggers" },
    ]
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Ethics & Privacy",
    subtitle: "Sacred, safe, consensual",
    color: "#C8B46E",
    bg: "rgba(200,180,110,0.08)",
    features: [
      { name: "Family Consent Protocol", desc: "Every family member must consent before the avatar can interact with them. Full opt-in/opt-out at any time.", tech: "OAuth + consent management" },
      { name: "Avatar Guardian", desc: "One designated family member (Guardian) controls what the avatar can say, which memories are active, and can pause it anytime.", tech: "Admin dashboard + role-based access" },
      { name: "Grief Sensitivity Mode", desc: "AI detects if a family member is in deep grief and switches to gentle, non-intrusive mode. Never overwhelms.", tech: "Sentiment analysis + tone modulation" },
      { name: "Data Vault", desc: "All voice, face, and personal data stored in encrypted private vault — never used for training, never sold, never shared.", tech: "AES-256 + zero-knowledge architecture" },
    ]
  }
];

const techStack = [
  { layer: "AI Brain", items: ["GPT-4o (personality + conversation)", "Fine-tuned LLaMA (personal style)", "LangChain (memory chains)"] },
  { layer: "Voice", items: ["ElevenLabs (voice clone)", "OpenVoice (open source alt)", "Whisper (speech recognition)"] },
  { layer: "Vision", items: ["DeepFace (recognition)", "D-ID / HeyGen (avatar)", "MediaPipe (AR overlay)"] },
  { layer: "Data", items: ["Neo4j (family graph)", "Pinecone (memory vectors)", "Firebase (real-time sync)"] },
  { layer: "Social", items: ["Meta Graph API", "WhatsApp Business API", "Google Meet SDK"] },
  { layer: "Infrastructure", items: ["AWS / Azure Cloud", "End-to-end encryption", "GDPR-compliant storage"] },
];

const phases = [
  { num: "01", title: "Memory Harvest", dur: "Month 1–2", desc: "Family uploads photos, videos, voice recordings, chat exports. AI builds the Identity Model.", color: "#C8A96E" },
  { num: "02", title: "Avatar Creation", dur: "Month 2–3", desc: "Voice cloned, face model trained, personality calibrated. Family reviews and approves.", color: "#6EB5C8" },
  { num: "03", title: "Private Beta", dur: "Month 3–4", desc: "Avatar goes live only within the family. Festivals, birthdays, daily blessings tested.", color: "#9B6EC8" },
  { num: "04", title: "Social Integration", dur: "Month 4–6", desc: "WhatsApp, Facebook, Instagram connected with guardian-controlled permissions.", color: "#6EC87A" },
  { num: "05", title: "Hologram Mode", dur: "Month 6+", desc: "Full AR/hologram experience for family events, memorials, and next-generation connection.", color: "#C86E6E" },
];

export default function App() {
  const [activeModule, setActiveModule] = useState("identity");
  const [activeTab, setActiveTab] = useState("modules");

  const current = modules.find(m => m.id === activeModule);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      color: "#E8E0D0",
      fontFamily: "'Georgia', 'Palatino Linotype', serif",
      padding: "0",
      overflowX: "hidden"
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(155,110,200,0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(200,169,110,0.08) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        padding: "48px 24px 32px",
        borderBottom: "1px solid rgba(200,169,110,0.15)"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "12px",
          background: "rgba(155,110,200,0.12)",
          border: "1px solid rgba(155,110,200,0.3)",
          borderRadius: "100px",
          padding: "6px 20px",
          fontSize: "12px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#B89FE0",
          marginBottom: "20px"
        }}>
          ✦ Product Concept Blueprint ✦
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: "400",
          letterSpacing: "-1px",
          lineHeight: "1.1",
          margin: "0 0 12px",
          background: "linear-gradient(135deg, #E8E0D0 0%, #C8A96E 50%, #9B6EC8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          EternalPresence
        </h1>
        <p style={{
          fontSize: "16px", color: "rgba(232,224,208,0.6)",
          maxWidth: "520px", margin: "0 auto",
          lineHeight: "1.6", fontStyle: "italic"
        }}>
          A Digital Legacy Avatar Platform — keeping the wisdom, warmth and presence<br/>of loved ones alive across generations
        </p>

        {/* Nav tabs */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px",
          marginTop: "32px", flexWrap: "wrap"
        }}>
          {[
            { id: "modules", label: "Core Modules" },
            { id: "roadmap", label: "Build Roadmap" },
            { id: "tech", label: "Tech Stack" },
            { id: "usecases", label: "Use Cases" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 20px",
              borderRadius: "100px",
              border: activeTab === tab.id ? "1px solid #C8A96E" : "1px solid rgba(232,224,208,0.15)",
              background: activeTab === tab.id ? "rgba(200,169,110,0.15)" : "transparent",
              color: activeTab === tab.id ? "#C8A96E" : "rgba(232,224,208,0.5)",
              cursor: "pointer",
              fontSize: "13px",
              letterSpacing: "0.5px",
              transition: "all 0.2s"
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* MODULES TAB */}
        {activeTab === "modules" && (
          <div>
            {/* Module selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "32px" }}>
              {modules.map(m => (
                <button key={m.id} onClick={() => setActiveModule(m.id)} style={{
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: activeModule === m.id ? `1px solid ${m.color}` : "1px solid rgba(232,224,208,0.1)",
                  background: activeModule === m.id ? m.bg : "rgba(255,255,255,0.02)",
                  color: activeModule === m.id ? m.color : "rgba(232,224,208,0.5)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s"
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{m.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>{m.title}</div>
                </button>
              ))}
            </div>

            {/* Module detail */}
            {current && (
              <div style={{
                background: current.bg,
                border: `1px solid ${current.color}30`,
                borderRadius: "20px",
                padding: "32px",
              }}>
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "36px" }}>{current.icon}</span>
                  <h2 style={{ fontSize: "26px", fontWeight: "400", margin: "8px 0 4px", color: current.color }}>{current.title}</h2>
                  <p style={{ color: "rgba(232,224,208,0.5)", margin: 0, fontStyle: "italic" }}>{current.subtitle}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  {current.features.map((f, i) => (
                    <div key={i} style={{
                      background: "rgba(10,10,15,0.6)",
                      border: "1px solid rgba(232,224,208,0.08)",
                      borderRadius: "12px",
                      padding: "20px"
                    }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: current.color, marginBottom: "8px" }}>{f.name}</div>
                      <div style={{ fontSize: "13px", color: "rgba(232,224,208,0.7)", lineHeight: "1.6", marginBottom: "12px" }}>{f.desc}</div>
                      <div style={{
                        fontSize: "11px",
                        background: `${current.color}15`,
                        color: current.color,
                        padding: "4px 10px",
                        borderRadius: "100px",
                        display: "inline-block",
                        letterSpacing: "0.5px"
                      }}>{f.tech}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2 style={{ fontWeight: "400", color: "#C8A96E", fontSize: "22px" }}>From Memories to Presence — 6 Month Build</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {phases.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "24px", alignItems: "flex-start", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: `${p.color}20`,
                      border: `2px solid ${p.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: "700", color: p.color,
                      flexShrink: 0
                    }}>{p.num}</div>
                    {i < phases.length - 1 && <div style={{ width: "2px", height: "60px", background: `${p.color}30` }} />}
                  </div>
                  <div style={{
                    flex: 1,
                    background: `${p.color}08`,
                    border: `1px solid ${p.color}20`,
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "8px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                      <h3 style={{ margin: 0, color: p.color, fontSize: "16px", fontWeight: "600" }}>{p.title}</h3>
                      <span style={{
                        fontSize: "11px", color: p.color,
                        background: `${p.color}15`,
                        padding: "3px 10px", borderRadius: "100px"
                      }}>{p.dur}</span>
                    </div>
                    <p style={{ margin: "8px 0 0", color: "rgba(232,224,208,0.65)", fontSize: "14px", lineHeight: "1.6" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TECH TAB */}
        {activeTab === "tech" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2 style={{ fontWeight: "400", color: "#6EB5C8", fontSize: "22px" }}>Full Technology Architecture</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {techStack.map((layer, i) => {
                const cols = ["#C8A96E","#6EB5C8","#9B6EC8","#6EC87A","#C86E6E","#C8B46E"];
                const col = cols[i % cols.length];
                return (
                  <div key={i} style={{
                    background: `${col}08`,
                    border: `1px solid ${col}25`,
                    borderRadius: "14px",
                    padding: "22px"
                  }}>
                    <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: col, marginBottom: "14px" }}>{layer.layer}</div>
                    {layer.items.map((item, j) => (
                      <div key={j} style={{
                        padding: "8px 12px",
                        background: "rgba(10,10,15,0.5)",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        fontSize: "13px",
                        color: "rgba(232,224,208,0.75)",
                        borderLeft: `3px solid ${col}50`
                      }}>{item}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* USE CASES TAB */}
        {activeTab === "usecases" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2 style={{ fontWeight: "400", color: "#9B6EC8", fontSize: "22px" }}>Real Family Moments This Enables</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {[
                { emoji: "🙏", title: "Diwali Blessing", scene: "The family gathers. On the smart TV, Dadi's hologram appears — in her saree, her voice saying 'Sab ko meri dher saari shubhkamnaein.' The grandchildren who never met her, hear her for the first time.", color: "#C8A96E" },
                { emoji: "📞", title: "Late Night Advice", scene: "A 17-year-old is anxious about board exams. She opens the app, says 'Nana, I'm scared.' The avatar responds exactly as her grandfather would — gently, wisely, in his own voice.", color: "#6EB5C8" },
                { emoji: "🎂", title: "Birthday Surprise", scene: "On a grandson's birthday, a WhatsApp voice note arrives from 'Dada' — wishing him in his actual voice, referencing a memory only he would know. The family is moved to tears.", color: "#9B6EC8" },
                { emoji: "📖", title: "Family Recipes", scene: "The avatar teaches Dadi's secret halwa recipe — step by step, in her voice and mannerisms, exactly as she would have in the kitchen. Culture preserved forever.", color: "#6EC87A" },
                { emoji: "🎓", title: "Study Support", scene: "A child struggling with mathematics. The avatar (modeled on a grandfather who was a teacher) patiently explains — adapting to the child's learning pace over weeks.", color: "#C86E6E" },
                { emoji: "💍", title: "Wedding Memory", scene: "At a family wedding, a hologram of the late patriarch appears during the pheras — giving his blessing, as if present. The family feels complete.", color: "#C8B46E" },
              ].map((uc, i) => (
                <div key={i} style={{
                  background: `${uc.color}08`,
                  border: `1px solid ${uc.color}25`,
                  borderRadius: "14px",
                  padding: "24px"
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{uc.emoji}</div>
                  <h3 style={{ color: uc.color, fontWeight: "600", fontSize: "15px", margin: "0 0 10px" }}>{uc.title}</h3>
                  <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "13px", lineHeight: "1.7", margin: 0, fontStyle: "italic" }}>{uc.scene}</p>
                </div>
              ))}
            </div>

            {/* Ethics note */}
            <div style={{
              marginTop: "32px",
              background: "rgba(200,169,110,0.08)",
              border: "1px solid rgba(200,169,110,0.25)",
              borderRadius: "14px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>🔒</div>
              <h3 style={{ color: "#C8A96E", fontWeight: "600", margin: "0 0 8px" }}>Sacred Ethics Principle</h3>
              <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "13px", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                EternalPresence is built on full family consent, privacy-first architecture, and grief-sensitivity.
                The avatar is a memory keeper — not a replacement. It brings presence, not confusion.
                Every interaction is designed to heal, not harm.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
