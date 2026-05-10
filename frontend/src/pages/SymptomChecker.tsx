import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Chip,
  FormGroup, FormControlLabel, Checkbox, Divider,
  CircularProgress, Alert, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  ExpandMore, CheckCircle, LocalHospital, Science,
  Warning, Shield, MedicalServices, Timer
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

const SymptomChecker = () => {
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
      // Also populate disease predictions from the NLP analysis response
      if (record.predictions?.length > 0) {
        setPredictions(record.predictions);
        setRecommendedSpecialist(record.recommended_specialist || '');
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

  const confidenceColor = (c: number): 'error' | 'warning' | 'info' =>
    c >= 60 ? 'error' : c >= 30 ? 'warning' : 'info';

  const severityColor = (s: string) =>
    s === 'high' ? 'error' : s === 'medium' ? 'warning' : 'success';

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" className="text-gradient" sx={{ mb: 1 }}>
        AI Symptom Checker
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Describe your symptoms in natural language and get a detailed AI diagnosis report
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, maxWidth: 1100 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Input Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start', mb: 5 }}>
        {/* NLP Free Text */}
        <Box className="glass-panel" sx={{ p: 4, flex: '1 1 380px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📝 Describe in Natural Language</Typography>
          <TextField
            fullWidth multiline rows={4}
            placeholder="e.g. I have had a severe headache and high fever for 3 days with body aches and chills..."
            value={symptomText}
            onChange={e => setSymptomText(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button variant="contained" color="secondary" onClick={handleNLPAnalyze}
            disabled={nlpLoading || !symptomText} sx={{ color: '#000', px: 4 }}>
            {nlpLoading ? <CircularProgress size={20} color="inherit" /> : '🔍 Analyze & Diagnose'}
          </Button>

          {nlpResult && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              {nlpResult.extracted_symptoms?.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Extracted symptom phrases:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {nlpResult.extracted_symptoms.map((s: string, i: number) => (
                      <Chip key={i} label={s} variant="outlined" color="primary" size="small" />
                    ))}
                  </Box>
                </>
              )}
              {nlpResult.matched_known_symptoms?.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Matched to ML symptom database:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {nlpResult.matched_known_symptoms.map((s: string, i: number) => (
                      <Chip key={i} label={s.replace(/_/g, ' ')} color="secondary" size="small" sx={{ color: '#000' }} />
                    ))}
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Severity:</Typography>
                <Chip
                  label={(nlpResult.severity || 'low').toUpperCase()}
                  color={severityColor(nlpResult.severity) as any}
                />
              </Box>
              {nlpResult.follow_up_questions?.length > 0 && (
                <Box sx={{ mt: 2, p: 2, background: 'rgba(0,112,243,0.08)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#0070f3' }}>❓ Follow-up Questions:</Typography>
                  {nlpResult.follow_up_questions.map((q: string, i: number) => (
                    <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>• {q}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* ML Symptom Picker */}
        <Box className="glass-panel" sx={{ p: 4, flex: '1 1 380px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🧬 Disease Prediction Engine</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Or manually select symptoms you are experiencing:
          </Typography>
          <Box sx={{ maxHeight: 250, overflowY: 'auto', mb: 3, pr: 1 }}>
            <FormGroup>
              {availableSymptoms.map(s => (
                <FormControlLabel key={s}
                  control={<Checkbox size="small" checked={selectedSymptoms.includes(s)} onChange={() => toggleSymptom(s)} sx={{ color: '#0070f3' }} />}
                  label={<Typography variant="body2">{s.replace(/_/g, ' ')}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {selectedSymptoms.map(s => <Chip key={s} label={s.replace(/_/g, ' ')} onDelete={() => toggleSymptom(s)} size="small" color="primary" />)}
          </Box>
          <Button variant="contained" color="primary" onClick={handlePredict}
            disabled={predLoading || selectedSymptoms.length === 0} sx={{ px: 4 }}>
            {predLoading ? <CircularProgress size={20} color="inherit" /> : '🔮 Predict Disease'}
          </Button>
        </Box>
      </Box>

      {/* ─── Full Diagnosis Report ─── */}
      {predictions.length > 0 && (
        <Box sx={{ maxWidth: 1100 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            🏥 AI Diagnosis Report
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Based on your symptoms, the AI has identified the following potential conditions:
          </Typography>

          {recommendedSpecialist && (
            <Alert
              severity="info"
              icon={<MedicalServices />}
              sx={{ mb: 3 }}
            >
              <strong>Recommended Specialist: {recommendedSpecialist}</strong> — Book an appointment through the Appointments page.
            </Alert>
          )}

          {predictions.map((p: any, i: number) => (
            <Box key={i} sx={{
              mb: 3,
              borderRadius: 3,
              border: i === 0 ? '1px solid rgba(0,112,243,0.4)' : '1px solid rgba(255,255,255,0.1)',
              background: i === 0 ? 'rgba(0,112,243,0.06)' : 'rgba(255,255,255,0.03)',
              overflow: 'hidden'
            }}>
              {/* Disease Header */}
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    {i === 0 && <Chip label="Most Likely" color="primary" size="small" />}
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {i + 1}. {p.disease}
                    </Typography>
                    <Chip label={`${p.confidence}% confidence`} color={confidenceColor(p.confidence)} size="small" />
                  </Box>
                  {p.contagious !== undefined && (
                    <Chip
                      label={p.contagious ? '⚠️ Contagious' : '✅ Not Contagious'}
                      variant="outlined"
                      size="small"
                      color={p.contagious ? 'warning' : 'success'}
                      sx={{ mr: 1 }}
                    />
                  )}
                  {p.recovery_time && (
                    <Chip
                      icon={<Timer fontSize="small" />}
                      label={`Recovery: ${p.recovery_time}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Specialist</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#0070f3' }}>{p.specialist}</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

              {/* Overview */}
              {p.overview && (
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {p.overview}
                  </Typography>
                </Box>
              )}

              {/* Accordion Sections */}
              <Box sx={{ p: 2 }}>
                {p.causes?.length > 0 && (
                  <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Science fontSize="small" color="warning" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Causes</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense disablePadding>
                        {p.causes.map((c: string, ci: number) => (
                          <ListItem key={ci} disableGutters>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle fontSize="small" color="warning" /></ListItemIcon>
                            <ListItemText primary={<Typography variant="body2" color="text.secondary">{c}</Typography>} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {p.key_symptoms?.length > 0 && (
                  <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospital fontSize="small" color="error" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Key Symptoms</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {p.key_symptoms.map((s: string, si: number) => (
                          <Chip key={si} label={s} variant="outlined" size="small" color="error" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {p.treatments?.length > 0 && (
                  <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }} defaultExpanded={i === 0}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MedicalServices fontSize="small" color="primary" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Treatments</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense disablePadding>
                        {p.treatments.map((t: string, ti: number) => (
                          <ListItem key={ti} disableGutters>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                            <ListItemText primary={<Typography variant="body2" color="text.secondary">{t}</Typography>} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {p.prevention?.length > 0 && (
                  <Accordion sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Shield fontSize="small" color="success" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Prevention</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense disablePadding>
                        {p.prevention.map((prev: string, pi: number) => (
                          <ListItem key={pi} disableGutters>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                            <ListItemText primary={<Typography variant="body2" color="text.secondary">{prev}</Typography>} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {p.when_to_see_doctor && (
                  <Box sx={{ mt: 1, p: 2, background: 'rgba(255,100,100,0.08)', borderRadius: 2, border: '1px solid rgba(255,100,100,0.2)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Warning color="error" fontSize="small" sx={{ mt: 0.3, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ff6464', mb: 0.5 }}>When to See a Doctor</Typography>
                        <Typography variant="body2" color="text.secondary">{p.when_to_see_doctor}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ))}

          <Alert severity="warning" icon={<Warning />} sx={{ mt: 2 }}>
            <strong>Disclaimer:</strong> This AI report is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional before taking any action.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SymptomChecker;
