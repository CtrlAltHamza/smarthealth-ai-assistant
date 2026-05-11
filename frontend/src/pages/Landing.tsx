import { Box, Typography, Button, Container, Grid, Accordion, AccordionSummary, AccordionDetails, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Psychology,
  EventAvailable,
  Security,
  ArrowForward,
  HealthAndSafety,
  ExpandMore,
  Bolt,
  Groups,
  Verified,
  Timeline,
} from '@mui/icons-material';
import heroImage from '../assets/medical_ai_hero.png';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const FeatureCard = ({ icon, title, desc, i }: { icon: React.ReactNode; title: string; desc: string; i: number }) => (
  <motion.div custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}>
    <Box className="glass-card" sx={{ height: '100%', textAlign: 'left' }}>
      <Box
        sx={{
          color: 'var(--primary)',
          background: 'rgba(0, 112, 243, 0.1)',
          width: 56,
          height: 56,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700, fontFamily: 'Outfit' }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</Typography>
    </Box>
  </motion.div>
);

const SectionTitle = ({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 }, maxWidth: 720, mx: 'auto' }}>
    <Typography variant="overline" sx={{ color: 'var(--accent)', letterSpacing: '0.2em', fontWeight: 700 }}>
      {kicker}
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit', mt: 1, mb: 2, fontSize: { xs: '1.85rem', md: '2.5rem' } }}>
      {title}
    </Typography>
    <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{subtitle}</Typography>
  </Box>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 12 },
          background:
            'radial-gradient(ellipse 100% 80% at 50% -30%, rgba(0,112,243,0.2), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 20%, rgba(121,40,202,0.12), transparent)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    mb: 3,
                    borderRadius: '999px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,112,243,0.08)',
                  }}
                >
                  <Bolt sx={{ fontSize: 18, color: 'var(--accent)' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em' }}>
                    LIVE AI ENGINE · NLP + ML
                  </Typography>
                </Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.75rem', md: '4.25rem' },
                    fontWeight: 800,
                    fontFamily: 'Outfit',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    mb: 2.5,
                  }}
                >
                  Your health,
                  <br />
                  <span className="text-gradient">intelligently</span> guided.
                </Typography>
                <Typography sx={{ color: 'var(--text-muted)', mb: 4, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 520 }}>
                  SmartHealth combines secure records, AI symptom understanding, specialist routing, and real-time scheduling — built as a
                  modern clinical companion, not a toy chatbot.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <button type="button" className="btn-premium" onClick={() => navigate('/register')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Start free <ArrowForward sx={{ fontSize: 20 }} />
                  </button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'var(--glass-border)',
                      color: 'var(--text-vibrant)',
                      borderRadius: 3,
                      px: 3,
                      py: 1.25,
                      '&:hover': { borderColor: 'var(--primary)', background: 'rgba(0,112,243,0.06)' },
                    }}
                  >
                    Clinician login
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 4, mt: 5, flexWrap: 'wrap' }}>
                  {[
                    { icon: <Verified sx={{ color: 'var(--accent)', fontSize: 22 }} />, t: 'JWT + RBAC' },
                    { icon: <Security sx={{ color: 'var(--primary)', fontSize: 22 }} />, t: 'Encrypted transit' },
                    { icon: <Groups sx={{ color: '#b388ff', fontSize: 22 }} />, t: 'Care team ready' },
                  ].map((x) => (
                    <Box key={x.t} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {x.icon}
                      <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                        {x.t}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }}>
                <Box sx={{ position: 'relative' }} className="float-slow">
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: '-12%',
                      background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 65%)',
                      zIndex: 0,
                    }}
                    className="pulse-glow"
                  />
                  <Box
                    component="img"
                    src={heroImage}
                    alt="AI-assisted healthcare visualization"
                    sx={{
                      width: '100%',
                      maxHeight: { xs: 320, md: 460 },
                      objectFit: 'cover',
                      borderRadius: '28px',
                      border: '1px solid var(--glass-border)',
                      boxShadow: '0 40px 80px rgba(0,0,0,0.55)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats strip */}
      <Box sx={{ py: 5, borderBlock: '1px solid var(--glass-border)', background: 'rgba(22,27,34,0.65)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            {[
              { val: '85%+', lab: 'Model target accuracy' },
              { val: 'Real-time', lab: 'Booking & alerts' },
              { val: '3-tier', lab: 'Patient · Doctor · Admin' },
              { val: 'Full stack', lab: 'React · Node · FastAPI' },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.lab}>
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary)' }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', mt: 0.5 }}>
                    {stat.lab}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <SectionTitle
          kicker="PLATFORM"
          title="Everything in one clinical workspace"
          subtitle="From first symptom description to specialist handoff — orchestrated with guardrails, documentation, and transparency."
        />
        <Grid container spacing={3}>
          {[
            {
              icon: <Psychology sx={{ fontSize: 30 }} />,
              title: 'NLP symptom intelligence',
              desc: 'Natural language is parsed, normalized, and matched to structured symptom lexicons before ML scoring — reducing vague intake.',
            },
            {
              icon: <HealthAndSafety sx={{ fontSize: 30 }} />,
              title: 'Probabilistic disease insight',
              desc: 'Ensemble-friendly pipelines surface ranked hypotheses with confidence, plain-language context, and escalation cues.',
            },
            {
              icon: <EventAvailable sx={{ fontSize: 30 }} />,
              title: 'Scheduling that respects capacity',
              desc: 'Conflict-aware booking, reschedules, doctor reviews, and live notifications keep patients and providers aligned.',
            },
          ].map((f, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={f.title}>
              <FeatureCard {...f} i={i} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, transparent, rgba(0,112,243,0.04), transparent)' }}>
        <Container maxWidth="lg">
          <SectionTitle
            kicker="WORKFLOW"
            title="How SmartHealth guides a visit"
            subtitle="A linear journey patients understand — with hooks for doctors and admins behind the scenes."
          />
          <Grid container spacing={3}>
            {[
              { step: '01', title: 'Describe symptoms', body: 'Free text or structured checklist feeds the AI service securely.' },
              { step: '02', title: 'Review AI insights', body: 'Severity, follow-up prompts, and educational context appear instantly.' },
              { step: '03', title: 'Book the right expert', body: 'Specialist hints and ratings help you choose a provider and time slot.' },
              { step: '04', title: 'Track your timeline', body: 'Dashboard charts, PDF summaries, and notifications keep history portable.' },
            ].map((s, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.step}>
                <motion.div custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                  <Box className="glass-panel" sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--primary)', opacity: 0.35, fontFamily: 'Outfit' }}>
                      {s.step}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>
                      {s.body}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tech + FAQ */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Timeline sx={{ color: 'var(--accent)' }} />
              <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)' }}>
                STACK
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 2 }}>
              Built like a real product
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', mb: 3, lineHeight: 1.7 }}>
              React &amp; MUI on the client, Express &amp; Sequelize on the API, FastAPI + spaCy + sklearn for AI, PostgreSQL for records, and Socket.io for live
              notifications — mirroring the architecture in our course proposal.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['TypeScript', 'Redux Toolkit', 'Swagger', 'JWT', 'Chart.js', 'PDF export', 'Docker-ready'].map((t) => (
                <Box
                  key={t}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    border: '1px solid var(--glass-border)',
                    typography: 'caption',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}
                >
                  {t}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Outfit' }}>
              FAQs
            </Typography>
            {[
              {
                q: 'Is this a replacement for a doctor?',
                a: 'No. SmartHealth assists with information and logistics; all outputs include disclaimers and encourage professional care for urgent symptoms.',
              },
              {
                q: 'How are appointments kept fair?',
                a: 'The API blocks double-booked slots per doctor within a time window and supports patient reschedules with the same checks.',
              },
              {
                q: 'Can I export my data?',
                a: 'Yes — generate a PDF health summary from your dashboard, including recent AI analyses and visit counts.',
              },
            ].map((faq) => (
              <Accordion
                key={faq.q}
                disableGutters
                sx={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px !important',
                  mb: 1.5,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--text-muted)' }} />}>
                  <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ py: 10, textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(13,17,23,0.9)' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 800, mb: 2 }}>
              Ready for calmer, clearer care?
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', mb: 4 }}>
              Create your account in minutes — explore the AI engine, book a specialist, and own your health timeline.
            </Typography>
            <button type="button" className="btn-premium" onClick={() => navigate('/register')} style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
              Create your SmartHealth account
            </button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, borderTop: '1px solid var(--glass-border)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 800, mb: 1 }}>
                SmartHealth AI
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-dim)', lineHeight: 1.7 }}>
                Course project prototype — Spring 2026. Not for emergency use.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Product
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink component="button" variant="body2" onClick={() => navigate('/register')} sx={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                  Sign up
                </MuiLink>
                <MuiLink component="button" variant="body2" onClick={() => navigate('/login')} sx={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                  Sign in
                </MuiLink>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Legal
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-dim)' }}>
                Educational demonstration only. No HIPAA claims.
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block', mt: 4, textAlign: 'center' }}>
            © {new Date().getFullYear()} SmartHealth Technologies. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
