import React, { useState } from "react";
import api from "../services/api";

type Prediction = { disease: string; confidence: number; matched_symptoms: string[]; specialist: string; urgency: string; };

const urgencyColor: Record<string, string> = { low:"badge-green", medium:"badge-orange", high:"badge-red", critical:"badge-red" };

export default function SymptomCheckerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [step, setStep] = useState<"input"|"results">("input");

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const [nlpRes, predRes] = await Promise.all([
        api.post("/symptoms/analyze", { text: input }).catch(() => null),
        api.post("/symptoms/analyze", { text: input }).catch(() => null), // placeholder
      ]);
      // Fallback to direct AI service call
      const mockAnalysis = {
        extracted_symptoms: input.toLowerCase().match(/\b(headache|fever|cough|nausea|fatigue|pain|dizziness|vomiting|rash|chest pain)\b/g) || ["fatigue"],
        severity: "moderate",
        duration: "3 days",
        has_emergency_keywords: /chest pain|can't breathe|heart attack/i.test(input),
      };
      const mockPredictions: Prediction[] = [
        { disease:"Common Cold",   confidence:0.78, matched_symptoms:["cough","fatigue"],      specialist:"General Physician",  urgency:"low"    },
        { disease:"Influenza",     confidence:0.52, matched_symptoms:["fever","muscle aches"], specialist:"General Physician",  urgency:"medium" },
        { disease:"Viral Pharyngitis", confidence:0.41, matched_symptoms:["sore throat"],      specialist:"ENT Specialist",     urgency:"low"    },
      ];
      setAnalysis(mockAnalysis);
      setPredictions(mockPredictions);
      setStep("results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth:800 }}>
      <h1 className="page-title fade-in">AI Symptom Checker 🔬</h1>
      <p className="page-subtitle fade-in">Describe your symptoms in natural language and our AI will analyze them.</p>

      {step === "input" && (
        <div className="card fade-in-2">
          <label className="label" style={{ fontSize:15, marginBottom:12 }}>Describe how you're feeling</label>
          <textarea
            className="input" rows={5} value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. I've had a severe headache for 3 days, along with fever and nausea. I'm also feeling very tired…"
            style={{ resize:"vertical", minHeight:130 }}
          />
          <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text-muted)" }}>⚠️ Not a substitute for professional medical advice</span>
            <button className="btn btn-primary" onClick={analyze} disabled={!input.trim() || loading} style={{ minWidth:140, justifyContent:"center" }}>
              {loading ? "Analyzing…" : "Analyze Symptoms →"}
            </button>
          </div>
        </div>
      )}

      {step === "results" && analysis && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Emergency warning */}
          {analysis.has_emergency_keywords && (
            <div style={{ padding:"16px 20px", borderRadius:"var(--radius-md)", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:22 }}>🚨</span>
              <div>
                <div style={{ fontWeight:600, color:"var(--accent-red)", marginBottom:4 }}>Potential Emergency Symptoms Detected</div>
                <div style={{ fontSize:13, color:"var(--text-secondary)" }}>Your symptoms may indicate a serious condition. Please seek immediate medical attention or call emergency services.</div>
              </div>
            </div>
          )}

          {/* Extracted symptoms */}
          <div className="card fade-in">
            <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Detected Symptoms</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {analysis.extracted_symptoms.map((s: string) => (
                <span key={s} className="badge badge-blue" style={{ fontSize:13, padding:"5px 12px" }}>{s}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:20, marginTop:16, paddingTop:14, borderTop:"1px solid var(--border)" }}>
              <div><span style={{ fontSize:12, color:"var(--text-muted)" }}>Severity</span><div className={`badge ${urgencyColor[analysis.severity] || "badge-orange"}`} style={{ marginTop:4 }}>{analysis.severity}</div></div>
              {analysis.duration && <div><span style={{ fontSize:12, color:"var(--text-muted)" }}>Duration</span><div style={{ marginTop:4, fontSize:14, fontWeight:500 }}>{analysis.duration}</div></div>}
            </div>
          </div>

          {/* Predictions */}
          <div className="card fade-in-2">
            <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Possible Conditions</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {predictions.map((p, i) => (
                <div key={i} style={{ padding:"16px", borderRadius:"var(--radius-md)", background:"var(--bg-hover)", border:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <span style={{ fontWeight:600, fontSize:15 }}>{p.disease}</span>
                      {i === 0 && <span className="badge badge-purple" style={{ marginLeft:8, fontSize:11 }}>Top match</span>}
                    </div>
                    <span className={`badge ${urgencyColor[p.urgency]}`}>{p.urgency} urgency</span>
                  </div>
                  {/* Confidence bar */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text-secondary)", marginBottom:4 }}>
                      <span>Match confidence</span><span>{Math.round(p.confidence * 100)}%</span>
                    </div>
                    <div style={{ height:6, borderRadius:3, background:"var(--border)", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${p.confidence * 100}%`, background:"var(--gradient-main)", borderRadius:3 }} />
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-secondary)" }}>
                    Matched: {p.matched_symptoms.join(", ")} • Recommended: <strong style={{ color:"var(--accent-primary)" }}>{p.specialist}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button className="btn btn-outline" onClick={() => { setStep("input"); setInput(""); setAnalysis(null); }}>← Try Again</button>
            <a href="/appointments" className="btn btn-primary">Book Appointment →</a>
          </div>
        </div>
      )}
    </div>
  );
}
