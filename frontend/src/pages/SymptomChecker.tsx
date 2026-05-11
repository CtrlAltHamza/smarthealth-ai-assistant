import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Chip,
  FormGroup, FormControlLabel, Checkbox, Divider,
  CircularProgress, Alert,
  LinearProgress, Grid
} from '@mui/material';
import {
  Science,
  Warning, Shield, MedicalServices, Timer,
  AutoAwesome, Psychology, HistoryEdu
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [symptomText, setSymptomText] = useState('');
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [nlpResult, setNlpResult] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [recommendedSpecialist, setRecommendedSpecialist] = useState<string>('');
  const [nlpLoading, setNlpLoading] = useState(false);
  const [predLoading, setPredLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest<{ symptoms: string[] }>('/symptoms/list', { token })
      .then(d => setAvailableSymptoms(d.symptoms || []))
      .catch(() => {});
  }, [token]);

  const handleNLPAnalyze = async () => {
    if (!symptomText.trim()) return;
    setNlpLoading(true); setError(''); setNlpResult(null);
    try {
      const data = await apiRequest<any>('/symptoms/analyze', {
        method: 'POST',
        token,
        body: { patientId: user?.id, text: symptomText },
      });
      const record = data.record || data;
      setNlpResult(record);
      const preds = record.predictions;
      if (Array.isArray(preds) && preds.length > 0) {
        setPredictions(preds);
        setRecommendedSpecialist(record.recommended_specialist || record.recommendedSpecialist || '');
      }
    } catch (e: any) { setError(e.message || 'Network error: Backend not reachable.'); }
    finally { setNlpLoading(false); }
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) { setError('Select at least one symptom.'); return; }
    setPredLoading(true); setError(''); setPredictions([]);
    setRecommendedSpecialist(''); setNlpResult(null);
    try {
      const data = await apiRequest<any>('/symptoms/predict', {
        method: 'POST',
        token,
        body: { symptoms: selectedSymptoms },
      });
      setPredictions(data.predictions || []);
      setRecommendedSpecialist(data.recommended_specialist || '');
    } catch (e: any) { setError(e.message || 'Network error: AI service may not be running.'); }
    finally { setPredLoading(false); }
  };

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, minHeight: '100vh', position: 'relative' }}>
      
      <Box sx={{ mb: 6 }} className="animate-fade-in">
        <Typography variant="h2" sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 800 }}>
          AI <span className="text-gradient">Diagnostic Engine</span>
        </Typography>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 700 }}>
          Advanced neural processing for symptom analysis. Describe your condition in natural 
          language for a comprehensive clinical insight report.
        </Typography>
      </Box>

      {error && (
        <Alert variant="filled" severity="error" sx={{ mb: 4, borderRadius: '12px', background: 'rgba(211, 47, 47, 0.9)' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Input Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {/* NLP Free Text */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box className="glass-card" sx={{ height: '100%', p: 4, border: '1px solid var(--primary-glow)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Psychology sx={{ color: 'var(--primary)', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>Neural Symptom Analysis</Typography>
            </Box>
            
            <TextField
              fullWidth multiline rows={5}
              placeholder="e.g. I have had a severe headache and high fever for 3 days with body aches and chills..."
              value={symptomText}
              onChange={e => setSymptomText(e.target.value)}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  '& fieldset': { borderColor: 'var(--glass-border)' },
                  '&:hover fieldset': { borderColor: 'var(--primary)' },
                }
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <button 
                className="btn-premium" 
                onClick={handleNLPAnalyze}
                disabled={nlpLoading || !symptomText}
                style={{ minWidth: 200 }}
              >
                {nlpLoading ? <CircularProgress size={24} color="inherit" /> : <><AutoAwesome sx={{ mr: 1, fontSize: 20 }} /> Analyze Symptoms</>}
              </button>
              {nlpLoading && <Typography variant="body2" className="shimmer-bg" sx={{ color: 'var(--primary)', fontWeight: 600 }}>Engine is processing NLP data...</Typography>}
            </Box>

            {nlpResult && (
              <Box sx={{ mt: 4 }} className="animate-fade-in">
                <Divider sx={{ mb: 3, borderColor: 'var(--glass-border)' }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detected Symptoms</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {(nlpResult.aiAnalysis || nlpResult.extracted_symptoms || []).map((s: string, i: number) => (
                        <Chip key={i} label={s} size="small" sx={{ background: 'var(--glass-highlight)', color: 'white' }} />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clinical Severity</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={nlpResult.severity?.toUpperCase()} 
                        size="small" 
                        sx={{ fontWeight: 700, background: nlpResult.severity === 'high' ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.1)', color: nlpResult.severity === 'high' ? '#ff6464' : '#00dfd8' }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Manual Picker */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="glass-card" sx={{ height: '100%', p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <HistoryEdu sx={{ color: 'var(--accent)', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>Manual Assessment</Typography>
            </Box>
            
            <Box sx={{ 
              maxHeight: 280, 
              overflowY: 'auto', 
              mb: 4, 
              pr: 1,
              '&::-webkit-scrollbar-thumb': { background: 'var(--glass-border)' }
            }}>
              <FormGroup>
                {availableSymptoms.map(s => (
                  <FormControlLabel key={s}
                    control={<Checkbox size="small" checked={selectedSymptoms.includes(s)} onChange={() => toggleSymptom(s)} sx={{ color: 'var(--primary)' }} />}
                    label={<Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>{s.replace(/_/g, ' ')}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>

            <button 
              className="btn-premium" 
              onClick={handlePredict}
              disabled={predLoading || selectedSymptoms.length === 0}
              style={{ width: '100%', background: 'var(--bg-soft)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
            >
              {predLoading ? <CircularProgress size={24} color="inherit" /> : 'Run Prediction Model'}
            </button>
          </Box>
        </Grid>
      </Grid>

      {/* ─── Diagnostic Report ─── */}
      {predictions.length > 0 && (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }} className="animate-fade-in">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 800, mb: 1 }}>
              Clinical <span className="text-gradient">Diagnostic Report</span>
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)' }}>Precision machine learning analysis based on reported clinical manifestations.</Typography>
          </Box>

          {recommendedSpecialist && (
            <Box sx={{ 
              p: 3, mb: 5, borderRadius: '16px', 
              background: 'linear-gradient(90deg, rgba(0,112,243,0.1), transparent)',
              border: '1px solid var(--primary-glow)',
              display: 'flex', alignItems: 'center', gap: 3
            }}>
              <MedicalServices sx={{ color: 'var(--primary)', fontSize: 40 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recommended Specialist: {recommendedSpecialist}</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>We recommend consulting a {recommendedSpecialist} for further physical evaluation.</Typography>
              </Box>
              <Button 
                variant="contained" 
                onClick={() => navigate('/appointments')}
                sx={{ ml: 'auto', borderRadius: '12px', background: 'var(--primary)' }}
              >
                Book Appointment
              </Button>
            </Box>
          )}

          {predictions.map((p: any, i: number) => (
            <Box key={i} className="glass-card" sx={{ mb: 4, p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>{p.disease}</Typography>
                    <Chip label={`${p.confidence}% Confidence`} sx={{ background: i === 0 ? 'rgba(0,112,243,0.2)' : 'var(--bg-soft)', color: i === 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={p.contagious ? 'Contagious' : 'Non-Contagious'} size="small" variant="outlined" color={p.contagious ? 'error' : 'success'} />
                    <Chip icon={<Timer sx={{ fontSize: '1rem !important' }} />} label={p.recovery_time} size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Specialist</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--accent)' }}>{p.specialist}</Typography>
                </Box>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={p.confidence} 
                sx={{ height: 4, background: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, var(--primary), var(--accent))' } }} 
              />

              <Box sx={{ p: 4 }}>
                <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.8, mb: 4 }}>{p.overview}</Typography>
                
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Science sx={{ fontSize: 18, color: 'var(--accent)' }} /> Potential Causes
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {p.causes?.map((c: string, ci: number) => (
                        <Chip key={ci} label={c} size="small" variant="outlined" sx={{ borderColor: 'var(--glass-border)' }} />
                      ))}
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield sx={{ fontSize: 18, color: 'var(--primary)' }} /> Preventive Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {p.prevention?.map((prev: string, pi: number) => (
                        <Chip key={pi} label={prev} size="small" variant="outlined" sx={{ borderColor: 'var(--glass-border)' }} />
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 5, p: 3, borderRadius: '12px', background: 'rgba(255,100,100,0.05)', border: '1px solid rgba(255,100,100,0.1)' }}>
                  <Typography variant="subtitle2" sx={{ color: '#ff6464', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Warning sx={{ fontSize: 18 }} /> Critical: When to See a Doctor
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>{p.when_to_see_doctor}</Typography>
                </Box>
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 8, p: 4, textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
            <Typography variant="caption" sx={{ color: 'var(--text-dim)', maxWidth: 600, display: 'block', mx: 'auto' }}>
              DISCLAIMER: The information provided by this AI system is for informational purposes only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SymptomChecker;
