import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Psychology, 
  EventAvailable, 
  Security, 
  ArrowForward
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <Paper className="glass-panel" sx={{ p: 4, height: '100%', textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
    <Box sx={{ color: '#0070f3', fontSize: 60, mb: 2 }}>{icon}</Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{title}</Typography>
    <Typography color="text.secondary">{desc}</Typography>
  </Paper>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative',
        pt: { xs: 10, md: 20 }, 
        pb: { xs: 10, md: 15 },
        textAlign: 'center',
        px: 3
      }}>
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: -1,
        }} />
        
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '3rem', md: '5rem' }, 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          mb: 3
        }}>
          Healthcare, <br />
          <span className="text-gradient">Powered by AI.</span>
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 5, fontWeight: 400 }}>
          Experience the future of medicine. Get instant AI symptom analysis, 
          book smart appointments, and manage your health records securely.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => navigate('/register')}
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px' }}
          >
            Get Started Free
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Doctor Login
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h3" sx={{ mb: 8, fontWeight: 700, textAlign: 'center' }}>
          Why Choose SmartHealth?
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <FeatureCard 
              icon={<Psychology fontSize="inherit" />}
              title="AI Symptom Checker"
              desc="Describe your symptoms in natural language and let our advanced NLP models predict potential conditions instantly."
            />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <FeatureCard 
              icon={<EventAvailable fontSize="inherit" />}
              title="Smart Appointments"
              desc="Seamlessly book appointments with specialized doctors based on your AI symptom analysis results."
            />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <FeatureCard 
              icon={<Security fontSize="inherit" />}
              title="Secure Health Records"
              desc="Your data is encrypted and safe. Keep a complete timeline of your symptom checks and doctor visits."
            />
          </Box>
        </Box>
      </Container>

      {/* How it Works Section */}
      <Box sx={{ background: 'rgba(255,255,255,0.02)', py: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <Typography variant="h3" sx={{ mb: 8, fontWeight: 700, textAlign: 'center' }}>
            How It Works
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {[
              "Sign up for a free patient account in seconds.",
              "Run a quick AI symptom check to understand your health.",
              "Book an appointment with the right specialist right away."
            ].map((text, idx) => (
              <Box key={idx} sx={{ flex: '1 1 300px' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: 'rgba(0,112,243,0.1)', color: '#0070f3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.2rem', flexShrink: 0
                  }}>
                    {idx + 1}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>{text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default Landing;
