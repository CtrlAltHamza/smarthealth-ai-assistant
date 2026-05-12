const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon helpers
const {
    FaHeartbeat, FaBrain, FaCalendarCheck, FaChartLine, FaShieldAlt,
    FaUsers, FaGithub, FaCodeBranch, FaCheckCircle, FaClock,
    FaExclamationTriangle, FaRocket, FaLayerGroup, FaTools
} = require("react-icons/fa");
const { MdSecurity, MdBugReport } = require("react-icons/md");

async function iconPng(Icon, color = "#FFFFFF", size = 256) {
    const svg = ReactDOMServer.renderToStaticMarkup(
        React.createElement(Icon, { color, size: String(size) })
    );
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    return "image/png;base64," + buf.toString("base64");
}

async function buildPresentation() {
    const pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";
    pres.title = "SmartHealth AI Assistant — SPM Presentation";
    pres.author = "Saad Abrar, Umair Nawaz, Hamza Khurram";

    // ── COLOR PALETTE ──────────────────────────────────────────
    const C = {
        navy: "0A1628",
        navyMid: "112240",
        blue: "1E4FD8",
        blueMid: "2563EB",
        teal: "0EA5BE",
        tealDark: "0891B2",
        white: "FFFFFF",
        offWhite: "E8EDF8",
        light: "A8B8D8",
        gold: "F59E0B",
        red: "EF4444",
        green: "10B981",
        darkCard: "1A2D4A",
        slate: "6B7A9B",
    };

    const mkShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.18 });

    // Pre-render icons
    const icHeartbeat = await iconPng(FaHeartbeat, "#0EA5BE");
    const icBrain = await iconPng(FaBrain, "#1E4FD8");
    const icCalendar = await iconPng(FaCalendarCheck, "#10B981");
    const icChart = await iconPng(FaChartLine, "#F59E0B");
    const icShield = await iconPng(FaShieldAlt, "#EF4444");
    const icUsers = await iconPng(FaUsers, "#0EA5BE");
    const icGithub = await iconPng(FaGithub, "#FFFFFF");
    const icBranch = await iconPng(FaCodeBranch, "#FFFFFF");
    const icCheck = await iconPng(FaCheckCircle, "#10B981");
    const icClock = await iconPng(FaClock, "#F59E0B");
    const icRisk = await iconPng(FaExclamationTriangle, "#EF4444");
    const icRocket = await iconPng(FaRocket, "#0EA5BE");
    const icLayer = await iconPng(FaLayerGroup, "#1E4FD8");
    const icTools = await iconPng(FaTools, "#F59E0B");
    const icBug = await iconPng(MdBugReport, "#EF4444");

    // ═══════════════════════════════════════════════════════════
    // SLIDE 1 — TITLE / INTRO
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        // Left accent column
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.blue } });

        // Large background circle (decorative)
        s.addShape(pres.shapes.OVAL, {
            x: 5.8, y: -1.5, w: 5.5, h: 5.5,
            fill: { color: C.navyMid, transparency: 0 },
            line: { color: C.blue, width: 1 }
        });
        s.addShape(pres.shapes.OVAL, {
            x: 6.5, y: -0.8, w: 4.2, h: 4.2,
            fill: { color: C.blue, transparency: 80 },
            line: { color: C.teal, width: 0.5 }
        });

        s.addImage({ data: icHeartbeat, x: 0.55, y: 0.42, w: 0.55, h: 0.55 });

        s.addText("SmartHealth AI Assistant", {
            x: 0.42, y: 1.1, w: 7.5, h: 1.1,
            fontSize: 38, bold: true, color: C.white, fontFace: "Trebuchet MS",
            margin: 0
        });
        s.addText("Software Project Perspective", {
            x: 0.42, y: 2.05, w: 7.5, h: 0.55,
            fontSize: 18, color: C.teal, fontFace: "Trebuchet MS",
            italic: true, margin: 0
        });

        // Divider
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.42, y: 2.7, w: 4.5, h: 0.04, fill: { color: C.blue }, line: { color: C.blue, width: 0 }
        });

        // Team chips
        const members = [
            { name: "Saad Abrar", id: "22I-1238", role: "PM & Frontend Dev" },
            { name: "Umair Nawaz", id: "22I-0913", role: "Backend & DevOps" },
            { name: "Hamza Khurram", id: "21I-0735", role: "AI/ML & QA Lead" },
        ];
        members.forEach((m, i) => {
            const y = 2.95 + i * 0.72;
            s.addShape(pres.shapes.RECTANGLE, {
                x: 0.42, y, w: 5.8, h: 0.58,
                fill: { color: C.darkCard }, line: { color: C.blue, width: 0.8 },
                shadow: mkShadow()
            });
            s.addText(m.name, { x: 0.55, y: y + 0.05, w: 2.2, h: 0.27, fontSize: 13, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0 });
            s.addText(m.id, { x: 0.55, y: y + 0.28, w: 2.2, h: 0.22, fontSize: 10, color: C.teal, fontFace: "Trebuchet MS", margin: 0 });
            s.addText(m.role, { x: 2.85, y: y + 0.14, w: 3.2, h: 0.3, fontSize: 11, color: C.light, fontFace: "Trebuchet MS", italic: true, margin: 0 });
        });

        s.addText("FAST NUCES Islamabad  |  Spring 2026  |  SPM", {
            x: 0.42, y: 5.18, w: 7, h: 0.28,
            fontSize: 10, color: C.slate, fontFace: "Trebuchet MS", margin: 0
        });

        // Right decorative panel
        s.addShape(pres.shapes.RECTANGLE, {
            x: 7.2, y: 0, w: 2.8, h: 5.625,
            fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 }
        });
        const decorIcons = [
            { data: icBrain, x: 7.6, y: 0.5 },
            { data: icCalendar, x: 8.5, y: 1.5 },
            { data: icShield, x: 7.5, y: 2.5 },
            { data: icChart, x: 8.6, y: 3.4 },
            { data: icUsers, x: 7.7, y: 4.3 },
        ];
        decorIcons.forEach(ic => {
            s.addImage({ data: ic.data, x: ic.x, y: ic.y, w: 0.55, h: 0.55, transparency: 30 });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 2 — PROJECT OVERVIEW / PROBLEM & SOLUTION
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: "F0F4FF" };

        // Top header band
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
        s.addText("Project Overview", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Problem Statement & Proposed Solution", {
            x: 0.4, y: 0.62, w: 9, h: 0.32,
            fontSize: 12, color: C.teal, fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Problem box
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.35, y: 1.2, w: 4.3, h: 3.9,
            fill: { color: C.white }, line: { color: "D1DCEF", width: 0.8 },
            shadow: mkShadow()
        });
        s.addText("THE PROBLEM", {
            x: 0.55, y: 1.35, w: 3.9, h: 0.3,
            fontSize: 11, bold: true, color: C.red, fontFace: "Trebuchet MS",
            charSpacing: 2, margin: 0
        });
        const problems = [
            "Patients struggle to articulate symptoms accurately",
            "Appointment scheduling is slow and error-prone",
            "Specialists receive inappropriate referrals",
            "Overcrowded emergency departments",
            "Fragmented and inaccessible health records",
        ];
        const pBullets = problems.map((t, i) => ({
            text: t,
            options: { bullet: true, breakLine: i < problems.length - 1, fontSize: 12, color: "2D3748", fontFace: "Trebuchet MS", paraSpaceAfter: 6 }
        }));
        s.addText(pBullets, { x: 0.55, y: 1.75, w: 3.95, h: 3.0 });

        // Solution box
        s.addShape(pres.shapes.RECTANGLE, {
            x: 5.0, y: 1.2, w: 4.65, h: 3.9,
            fill: { color: C.navy }, line: { color: C.blue, width: 1 },
            shadow: mkShadow()
        });
        s.addText("OUR SOLUTION", {
            x: 5.18, y: 1.35, w: 4.2, h: 0.3,
            fontSize: 11, bold: true, color: C.teal, fontFace: "Trebuchet MS",
            charSpacing: 2, margin: 0
        });
        const solutions = [
            { icon: icHeartbeat, txt: "AI-powered symptom analysis with NLP" },
            { icon: icBrain, txt: "Disease prediction engine (85%+ accuracy)" },
            { icon: icUsers, txt: "Intelligent specialist matching & routing" },
            { icon: icCalendar, txt: "Real-time appointment management system" },
            { icon: icChart, txt: "Personalised health data dashboard" },
        ];
        solutions.forEach((sol, i) => {
            const y = 1.78 + i * 0.64;
            s.addImage({ data: sol.icon, x: 5.18, y: y + 0.08, w: 0.28, h: 0.28 });
            s.addText(sol.txt, { x: 5.55, y: y + 0.04, w: 3.9, h: 0.38, fontSize: 12, color: C.offWhite, fontFace: "Trebuchet MS", margin: 0 });
        });

        // Footer stat
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.25, w: 10, h: 0.375, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
        s.addText("Full-stack Web App  •  React + Node.js + Python FastAPI  •  PostgreSQL + Redis  •  Docker", {
            x: 0.3, y: 5.27, w: 9.4, h: 0.32,
            fontSize: 10, color: C.light, fontFace: "Trebuchet MS", align: "center", margin: 0
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 3 — SPM METHODOLOGY
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.blue }, line: { color: C.blue, width: 0 } });
        s.addText("SPM Methodology", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Agile Scrum  ·  8 Sprints  ·  16 Weeks", {
            x: 0.4, y: 0.65, w: 9, h: 0.28,
            fontSize: 12, color: C.teal, fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // 4 ceremony cards
        const ceremonies = [
            { title: "Sprint Planning", desc: "2-week sprints\nStory point estimates\nMoSCoW prioritization", color: C.blue },
            { title: "Daily Standups", desc: "15 min every morning\n3 questions: Did/Will/Blockers\nJira board review", color: C.tealDark },
            { title: "Sprint Review", desc: "Working demo each sprint\nStakeholder feedback\nIncrement validation", color: "7C3AED" },
            { title: "Retrospective", desc: "What went well?\nWhat to improve?\nAction items tracked", color: "059669" },
        ];
        ceremonies.forEach((c, i) => {
            const x = 0.3 + i * 2.4;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.25, w: 2.18, h: 2.6,
                fill: { color: C.darkCard }, line: { color: c.color, width: 1.5 },
                shadow: mkShadow()
            });
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.25, w: 2.18, h: 0.38,
                fill: { color: c.color }, line: { color: c.color, width: 0 }
            });
            s.addText(c.title, {
                x: x + 0.08, y: 1.28, w: 2.0, h: 0.32,
                fontSize: 11, bold: true, color: C.white, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            s.addText(c.desc, {
                x: x + 0.1, y: 1.7, w: 2.0, h: 2.0,
                fontSize: 10.5, color: C.light, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
        });

        // Bottom row: key Scrum artifacts
        const artifacts = [
            { label: "Product Backlog", val: "87 User Stories\nMoSCoW prioritized in Jira" },
            { label: "Sprint Backlog", val: "~32 story points\nper sprint (avg velocity)" },
            { label: "DoD Enforced", val: "Code review + CI pass\n+ 80% test coverage" },
            { label: "8 Sprints", val: "All goals met\n6/6 quality metrics passed" },
        ];
        artifacts.forEach((a, i) => {
            const x = 0.3 + i * 2.4;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 4.05, w: 2.18, h: 1.2,
                fill: { color: C.navyMid }, line: { color: "2D4A7A", width: 0.8 }
            });
            s.addText(a.label, { x: x + 0.1, y: 4.12, w: 2.0, h: 0.3, fontSize: 10, bold: true, color: C.teal, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(a.val, { x: x + 0.1, y: 4.42, w: 2.0, h: 0.72, fontSize: 10, color: C.light, fontFace: "Trebuchet MS", align: "center", margin: 0 });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 4 — PROJECT TIMELINE & WBS
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: "F0F4FF" };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 } });
        s.addText("Project Planning — Timeline & WBS", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 24, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("16-Week Gantt  ·  Work Breakdown Structure  ·  Critical Path", {
            x: 0.4, y: 0.65, w: 9, h: 0.28,
            fontSize: 11, color: C.teal, fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Phase bars (mini Gantt)
        const phases = [
            { label: "Initiation", weeks: "1-2", w: 1.0, color: "5B21B6" },
            { label: "Planning", weeks: "3-4", w: 1.0, color: C.blue },
            { label: "Development I-IV", weeks: "5-12", w: 4.0, color: C.tealDark },
            { label: "Testing", weeks: "13-14", w: 1.0, color: C.gold },
            { label: "Deployment", weeks: "15-16", w: 1.0, color: C.green },
        ];
        let xOff = 0.3;
        phases.forEach(p => {
            s.addShape(pres.shapes.RECTANGLE, {
                x: xOff, y: 1.2, w: p.w, h: 0.52,
                fill: { color: p.color }, line: { color: p.color, width: 0 }
            });
            s.addText(p.label, {
                x: xOff, y: 1.23, w: p.w, h: 0.28,
                fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            s.addText(`Wk ${p.weeks}`, {
                x: xOff, y: 1.48, w: p.w, h: 0.2,
                fontSize: 8, color: "DBEAFE", fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            xOff += p.w + 0.06;
        });

        // WBS columns
        const epics = [
            { title: "Auth & User Mgmt", items: ["Registration", "JWT Auth", "Role-based Access", "Password Recovery"], color: "5B21B6" },
            { title: "AI/ML Services", items: ["NLP Pipeline", "Disease Prediction", "Specialist Matching", "Model Eval"], color: C.blue },
            { title: "Appointments", items: ["Availability Check", "Calendar Booking", "Notifications", "History"], color: C.tealDark },
            { title: "Health Dashboard", items: ["Health Timeline", "Symptom Trends", "PDF Export", "Insights"], color: C.gold },
            { title: "DevOps & QA", items: ["CI/CD Pipeline", "Docker Setup", "Testing Suite", "Deployment"], color: "059669" },
        ];
        const colors = ["5B21B6", C.blue, C.tealDark, C.gold, "059669"];
        epics.forEach((ep, i) => {
            const x = 0.3 + i * 1.9;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.9, w: 1.75, h: 0.38,
                fill: { color: colors[i] }, line: { color: colors[i], width: 0 }
            });
            s.addText(ep.title, {
                x: x + 0.05, y: 1.93, w: 1.65, h: 0.3,
                fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            ep.items.forEach((item, j) => {
                s.addShape(pres.shapes.RECTANGLE, {
                    x, y: 2.34 + j * 0.66, w: 1.75, h: 0.56,
                    fill: { color: C.white }, line: { color: "D1DCEF", width: 0.5 },
                    shadow: { type: "outer", blur: 3, offset: 1, angle: 135, color: "000000", opacity: 0.08 }
                });
                s.addText(item, {
                    x: x + 0.05, y: 2.36 + j * 0.66, w: 1.65, h: 0.5,
                    fontSize: 9.5, color: "2D3748", fontFace: "Trebuchet MS",
                    align: "center", valign: "middle", margin: 0
                });
            });
        });

        // Footer
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.28, w: 10, h: 0.35, fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 } });
        s.addText("Critical Path: Requirements → Architecture → Backend API → AI Integration → E2E Testing → Deployment", {
            x: 0.3, y: 5.3, w: 9.4, h: 0.28,
            fontSize: 9.5, color: C.teal, fontFace: "Trebuchet MS", align: "center", italic: true, margin: 0
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 5 — TEAM ROLES & RACI
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.tealDark }, line: { color: C.tealDark, width: 0 } });
        s.addText("Team Structure & Roles", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("RACI Framework  ·  Scrum Roles  ·  Tuckman Team Development", {
            x: 0.4, y: 0.65, w: 9, h: 0.28,
            fontSize: 11, color: "A7F3D0", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Three member cards
        const members = [
            {
                name: "Saad Abrar", id: "22I-1238",
                scrum: "Product Owner + Scrum Master",
                resp: ["Sprint planning & backlog mgmt", "Jira setup & workflow tracking", "React 18 frontend development", "Stakeholder communication", "Sprint reviews & retrospectives"],
                color: C.blue
            },
            {
                name: "Umair Nawaz", id: "22I-0913",
                scrum: "Development Team",
                resp: ["Express.js REST API design", "PostgreSQL & Redis database", "Docker containerisation", "GitHub Actions CI/CD", "Deployment & monitoring"],
                color: C.tealDark
            },
            {
                name: "Hamza Khurram", id: "21I-0735",
                scrum: "Development Team",
                resp: ["spaCy / BERT NLP pipeline", "Random Forest + Neural Net models", "Python FastAPI microservices", "Test strategy & QA leadership", "87% model accuracy achieved"],
                color: "7C3AED"
            },
        ];

        members.forEach((m, i) => {
            const x = 0.3 + i * 3.2;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.15, w: 2.9, h: 4.15,
                fill: { color: C.darkCard }, line: { color: m.color, width: 1.5 },
                shadow: mkShadow()
            });
            // Color header
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.15, w: 2.9, h: 0.55,
                fill: { color: m.color }, line: { color: m.color, width: 0 }
            });
            s.addText(m.name, { x: x + 0.1, y: 1.18, w: 2.7, h: 0.3, fontSize: 13, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0 });
            s.addText(m.id, { x: x + 0.1, y: 1.46, w: 2.7, h: 0.2, fontSize: 9.5, color: "DBEAFE", fontFace: "Trebuchet MS", margin: 0 });

            s.addText(m.scrum, {
                x: x + 0.12, y: 1.8, w: 2.65, h: 0.28,
                fontSize: 9.5, italic: true, color: C.teal, fontFace: "Trebuchet MS", margin: 0
            });

            const bullets = m.resp.map((r, j) => ({
                text: r,
                options: { bullet: true, breakLine: j < m.resp.length - 1, fontSize: 10, color: C.light, fontFace: "Trebuchet MS", paraSpaceAfter: 4 }
            }));
            s.addText(bullets, { x: x + 0.12, y: 2.15, w: 2.65, h: 2.95 });
        });

        // Tuckman footer
        s.addText("Team Evolution: Forming (Wk 1-2) → Storming (Wk 3-4) → Norming (Wk 5-8) → Performing (Wk 9-16)  |  Velocity grew from 28 → 36 SP/sprint", {
            x: 0.3, y: 5.32, w: 9.4, h: 0.24,
            fontSize: 9, color: C.slate, fontFace: "Trebuchet MS", align: "center", italic: true, margin: 0
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 6 — JIRA & GITHUB WORKFLOW
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: "F0F4FF" };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
        s.addText("Tools: Jira + GitHub", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Project Tracking  ·  Version Control  ·  CI/CD Automation", {
            x: 0.4, y: 0.65, w: 9, h: 0.28,
            fontSize: 11, color: C.teal, fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Jira panel
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.3, y: 1.15, w: 4.5, h: 4.2,
            fill: { color: C.white }, line: { color: "D1DCEF", width: 0.8 },
            shadow: mkShadow()
        });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.3, y: 1.15, w: 4.5, h: 0.42,
            fill: { color: "0052CC" }, line: { color: "0052CC", width: 0 }
        });
        s.addText("JIRA — Project Intelligence", {
            x: 0.5, y: 1.19, w: 4.0, h: 0.33,
            fontSize: 12, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        const jiraItems = [
            "87 user stories across 5 epics (Auth, AI/ML, Appointments, Dashboard, DevOps)",
            "MoSCoW prioritization: Must/Should/Could/Won't",
            "Kanban board: To Do → In Progress → In Review → Done",
            "Sprint burndown charts — velocity tracked across 8 sprints",
            "Bug tracking with severity levels (Critical / Major / Minor)",
            "Tickets linked to GitHub PRs via ticket-ID naming convention",
            "Velocity stabilised at ~32 story points per sprint by Sprint 4",
        ];
        const jBullets = jiraItems.map((t, i) => ({
            text: t,
            options: { bullet: true, breakLine: i < jiraItems.length - 1, fontSize: 10.5, color: "2D3748", fontFace: "Trebuchet MS", paraSpaceAfter: 5 }
        }));
        s.addText(jBullets, { x: 0.5, y: 1.66, w: 4.0, h: 3.5 });

        // GitHub panel
        s.addShape(pres.shapes.RECTANGLE, {
            x: 5.2, y: 1.15, w: 4.5, h: 4.2,
            fill: { color: C.white }, line: { color: "D1DCEF", width: 0.8 },
            shadow: mkShadow()
        });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 5.2, y: 1.15, w: 4.5, h: 0.42,
            fill: { color: "161B22" }, line: { color: "161B22", width: 0 }
        });
        s.addImage({ data: icGithub, x: 5.35, y: 1.19, w: 0.28, h: 0.28 });
        s.addText("GITHUB — Code & Quality Gate", {
            x: 5.7, y: 1.19, w: 3.8, h: 0.33,
            fontSize: 12, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        const ghItems = [
            "Git Flow: main → develop → feature/SH-[ID]-name branches",
            "Branch protection: no direct push to main—PRs required",
            "Mandatory peer review (1 approval min) before merge",
            "GitHub Actions CI: ESLint + Jest + Mocha + Pytest on every PR",
            "Docker build validation in pipeline",
            "Auto-deploy to staging on develop merge; production on main",
            "Commit messages reference Jira ticket IDs for full traceability",
        ];
        const ghBullets = ghItems.map((t, i) => ({
            text: t,
            options: { bullet: true, breakLine: i < ghItems.length - 1, fontSize: 10.5, color: "2D3748", fontFace: "Trebuchet MS", paraSpaceAfter: 5 }
        }));
        s.addText(ghBullets, { x: 5.38, y: 1.66, w: 4.18, h: 3.5 });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 7 — RISK MANAGEMENT
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: "7F1D1D" }, line: { color: "7F1D1D", width: 0 } });
        s.addImage({ data: icRisk, x: 0.35, y: 0.22, w: 0.5, h: 0.5 });
        s.addText("Risk Management", {
            x: 1.0, y: 0.12, w: 8.5, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Risk Register  ·  Risk Matrix (P×I)  ·  4 Response Strategies", {
            x: 1.0, y: 0.66, w: 8.5, h: 0.28,
            fontSize: 11, color: "FCA5A5", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        const risks = [
            { risk: "AI Model Accuracy < 85%", p: "3", i: "5", score: "15", impact: "HIGH", strat: "Mitigate", mit: "Ensemble models + rule-based fallback", color: C.red },
            { risk: "Security Vulnerabilities", p: "4", i: "5", score: "20", impact: "CRITICAL", strat: "Mitigate", mit: "OWASP audits + Snyk + encryption", color: "DC2626" },
            { risk: "Scope Creep", p: "4", i: "4", score: "16", impact: "HIGH", strat: "Avoid", mit: "Change control + sprint freeze rule", color: C.red },
            { risk: "Team Unavailability", p: "2", i: "3", score: "6", impact: "MEDIUM", strat: "Mitigate", mit: "Cross-training + documentation", color: C.gold },
            { risk: "Integration Challenges", p: "3", i: "3", score: "9", impact: "MEDIUM", strat: "Mitigate", mit: "API contracts + early integration testing", color: C.gold },
            { risk: "Tech Learning Curve", p: "3", i: "3", score: "9", impact: "MEDIUM", strat: "Accept", mit: "Pair programming + proof-of-concept sprints", color: C.gold },
        ];

        // Table header
        s.addShape(pres.shapes.RECTANGLE, { x: 0.25, y: 1.12, w: 9.5, h: 0.4, fill: { color: "7F1D1D" }, line: { color: "7F1D1D", width: 0 } });
        ["Risk", "P", "I", "Score", "Impact", "Strategy", "Mitigation"].forEach((h, i) => {
            const xArr = [0.3, 3.15, 3.6, 4.05, 4.6, 5.55, 6.65];
            const wArr = [2.8, 0.4, 0.4, 0.5, 0.9, 1.0, 3.1];
            s.addText(h, { x: xArr[i], y: 1.15, w: wArr[i], h: 0.33, fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0 });
        });

        risks.forEach((r, i) => {
            const y = 1.57 + i * 0.64;
            const bg = i % 2 === 0 ? C.darkCard : C.navyMid;
            s.addShape(pres.shapes.RECTANGLE, { x: 0.25, y, w: 9.5, h: 0.58, fill: { color: bg }, line: { color: "2D4A7A", width: 0.3 } });
            s.addText(r.risk, { x: 0.35, y: y + 0.1, w: 2.75, h: 0.38, fontSize: 10, color: C.offWhite, fontFace: "Trebuchet MS", margin: 0 });
            s.addText(r.p, { x: 3.18, y: y + 0.1, w: 0.35, h: 0.38, fontSize: 10, color: C.light, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(r.i, { x: 3.62, y: y + 0.1, w: 0.35, h: 0.38, fontSize: 10, color: C.light, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(r.score, { x: 4.05, y: y + 0.1, w: 0.45, h: 0.38, fontSize: 11, bold: true, color: r.color, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(r.impact, { x: 4.55, y: y + 0.1, w: 0.95, h: 0.38, fontSize: 9, bold: true, color: r.color, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(r.strat, { x: 5.55, y: y + 0.1, w: 1.0, h: 0.38, fontSize: 10, color: C.teal, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(r.mit, { x: 6.62, y: y + 0.05, w: 3.05, h: 0.48, fontSize: 9.5, color: C.light, fontFace: "Trebuchet MS", margin: 0 });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 8 — TECHNICAL ARCHITECTURE
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: "F0F4FF" };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.blue }, line: { color: C.blue, width: 0 } });
        s.addImage({ data: icLayer, x: 0.3, y: 0.2, w: 0.55, h: 0.55 });
        s.addText("Technical Architecture", {
            x: 1.0, y: 0.12, w: 8.5, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("3-Layer Microservices  ·  React + Node.js + Python FastAPI  ·  PostgreSQL + Redis + Docker", {
            x: 1.0, y: 0.66, w: 8.5, h: 0.28,
            fontSize: 11, color: "BFDBFE", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        const layers = [
            {
                title: "PRESENTATION LAYER",
                color: "5B21B6",
                items: ["React 18 + TypeScript", "Redux Toolkit (state)", "Material-UI components", "Chart.js visualisations", "Axios API client"]
            },
            {
                title: "APPLICATION LAYER",
                color: C.blue,
                items: ["Node.js / Express.js", "JWT Authentication", "Sequelize ORM", "Socket.io real-time", "Python FastAPI (AI)"]
            },
            {
                title: "AI / ML LAYER",
                color: C.tealDark,
                items: ["spaCy + NLTK NLP", "BERT intent classifier", "Random Forest + NN", "FastAPI microservice", "87% accuracy achieved"]
            },
            {
                title: "DATA LAYER",
                color: "059669",
                items: ["PostgreSQL 15", "Redis caching", "Cloud file storage", "Migration scripts", "Backup strategy"]
            },
        ];

        layers.forEach((l, i) => {
            const x = 0.28 + i * 2.38;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.18, w: 2.2, h: 4.18,
                fill: { color: C.white }, line: { color: l.color, width: 1.2 },
                shadow: mkShadow()
            });
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.18, w: 2.2, h: 0.48,
                fill: { color: l.color }, line: { color: l.color, width: 0 }
            });
            s.addText(l.title, {
                x: x + 0.05, y: 1.21, w: 2.1, h: 0.38,
                fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            l.items.forEach((item, j) => {
                s.addShape(pres.shapes.RECTANGLE, {
                    x: x + 0.1, y: 1.75 + j * 0.68, w: 2.0, h: 0.56,
                    fill: { color: "F5F7FF" }, line: { color: "D1DCEF", width: 0.5 }
                });
                s.addShape(pres.shapes.RECTANGLE, {
                    x: x + 0.1, y: 1.75 + j * 0.68, w: 0.06, h: 0.56,
                    fill: { color: l.color }, line: { color: l.color, width: 0 }
                });
                s.addText(item, {
                    x: x + 0.22, y: 1.78 + j * 0.68, w: 1.85, h: 0.5,
                    fontSize: 10, color: "2D3748", fontFace: "Trebuchet MS",
                    valign: "middle", margin: 0
                });
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 9 — QUALITY ASSURANCE
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: "065F46" }, line: { color: "065F46", width: 0 } });
        s.addImage({ data: icCheck, x: 0.3, y: 0.22, w: 0.5, h: 0.5 });
        s.addText("Quality Assurance & Testing", {
            x: 1.0, y: 0.12, w: 8.5, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Test Pyramid  ·  CI-Integrated  ·  6/6 Quality Metrics Achieved", {
            x: 1.0, y: 0.66, w: 8.5, h: 0.28,
            fontSize: 11, color: "A7F3D0", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Testing pyramid levels
        const testLevels = [
            { level: "Unit Tests", tool: "Jest + Mocha + Pytest", coverage: "81% avg coverage", color: C.blue, x: 0.3, w: 9.4 },
            { level: "Integration Tests", tool: "Supertest + DB Integration", coverage: "All 15 API endpoints", color: C.tealDark, x: 0.7, w: 8.6 },
            { level: "E2E Tests", tool: "Cypress Automation", coverage: "3 critical user flows", color: "7C3AED", x: 1.4, w: 7.2 },
            { level: "Performance Tests", tool: "K6 Load Testing", coverage: "<200ms at 95th percentile", color: C.gold, x: 2.3, w: 5.4 },
            { level: "Security Tests", tool: "OWASP + Snyk", coverage: "Zero critical vulns", color: C.red, x: 3.2, w: 3.6 },
        ];

        testLevels.forEach((t, i) => {
            const y = 1.15 + i * 0.7;
            s.addShape(pres.shapes.RECTANGLE, {
                x: t.x, y, w: t.w, h: 0.58,
                fill: { color: t.color }, line: { color: t.color, width: 0 },
                shadow: mkShadow()
            });
            s.addText(`${t.level}  |  ${t.tool}  |  ${t.coverage}`, {
                x: t.x + 0.15, y: y + 0.1, w: t.w - 0.3, h: 0.36,
                fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
        });

        // Quality metrics grid
        const metrics = [
            { label: "Code Coverage", val: "81%", target: "≥80%", met: true },
            { label: "API Response", val: "145ms", target: "<200ms", met: true },
            { label: "System Uptime", val: "99.7%", target: "≥99%", met: true },
            { label: "AI Accuracy", val: "87%", target: ">85%", met: true },
            { label: "Bug Density", val: "0.7", target: "<1/100", met: true },
            { label: "UAT Satisfaction", val: "82%", target: ">80%", met: true },
        ];

        metrics.forEach((m, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 0.3 + col * 3.15;
            const y = 4.72 + row * 0.0; // single row
            // only one row needed
            const y2 = 4.72;
            s.addShape(pres.shapes.RECTANGLE, {
                x: 0.3 + col * 3.15, y: y2, w: 2.9, h: 0.72,
                fill: { color: C.darkCard }, line: { color: C.green, width: 0.8 }
            });
            s.addImage({ data: icCheck, x: 0.38 + col * 3.15, y: y2 + 0.22, w: 0.28, h: 0.28 });
            s.addText(`${m.label}: ${m.val} (target ${m.target})`, {
                x: 0.72 + col * 3.15, y: y2 + 0.18, w: 2.4, h: 0.36,
                fontSize: 10.5, bold: true, color: C.green, fontFace: "Trebuchet MS", margin: 0
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 10 — SPM FRAMEWORKS APPLIED
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: "F0F4FF" };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 } });
        s.addText("SPM Frameworks Applied", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Triple Constraint  ·  WBS  ·  SDLC  ·  Change Control  ·  Stakeholder Management", {
            x: 0.4, y: 0.66, w: 9, h: 0.28,
            fontSize: 11, color: C.teal, fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        const frameworks = [
            {
                title: "Triple Constraint",
                icon: icClock,
                desc: "Time fixed (16 wks)\nCost = zero (open-source)\nScope managed via MoSCoW"
            },
            {
                title: "WBS",
                icon: icLayer,
                desc: "5 Epics → 87 Stories\nLeaf nodes tracked in Jira\nFull traceability"
            },
            {
                title: "Change Control",
                icon: icTools,
                desc: "Formal Jira CR process\nTeam sign-off required\nScope freeze mid-sprint"
            },
            {
                title: "Critical Path (CPM)",
                icon: icRocket,
                desc: "AI Integration = zero float\nFront-loaded ML dev\nBuffer at Sprint 10"
            },
            {
                title: "Stakeholder Mgmt",
                icon: icUsers,
                desc: "Instructor as PO-proxy\nBi-weekly sprint demos\nFormal UAT in Wk 13-14"
            },
            {
                title: "Tech Debt Mgmt",
                icon: icBug,
                desc: "Tracked in Jira 'tech-debt'\nIntentional + documented\nPaid back in Sprint 7"
            },
        ];

        frameworks.forEach((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 0.28 + col * 3.22;
            const y = 1.18 + row * 2.12;

            s.addShape(pres.shapes.RECTANGLE, {
                x, y, w: 3.0, h: 1.9,
                fill: { color: C.white }, line: { color: "D1DCEF", width: 0.8 },
                shadow: mkShadow()
            });
            s.addShape(pres.shapes.RECTANGLE, {
                x, y, w: 0.08, h: 1.9,
                fill: { color: C.blue }, line: { color: C.blue, width: 0 }
            });
            s.addImage({ data: f.icon, x: x + 0.18, y: y + 0.18, w: 0.42, h: 0.42 });
            s.addText(f.title, {
                x: x + 0.68, y: y + 0.15, w: 2.2, h: 0.32,
                fontSize: 12, bold: true, color: C.navy, fontFace: "Trebuchet MS", margin: 0
            });
            s.addText(f.desc, {
                x: x + 0.68, y: y + 0.5, w: 2.2, h: 1.25,
                fontSize: 10.5, color: "4A5568", fontFace: "Trebuchet MS", margin: 0
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 11 — KEY METRICS & OUTCOMES
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: "1E40AF" }, line: { color: "1E40AF", width: 0 } });
        s.addText("Key Metrics & Outcomes", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("8 Sprints Completed  ·  All 6 Quality Targets Met  ·  10 Success Criteria Achieved", {
            x: 0.4, y: 0.66, w: 9, h: 0.28,
            fontSize: 11, color: "BFDBFE", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        // Big stat numbers
        const bigStats = [
            { val: "87%", label: "AI Model\nAccuracy", color: C.teal },
            { val: "32", label: "Story Points\nPer Sprint (avg)", color: C.gold },
            { val: "81%", label: "Code\nCoverage", color: C.green },
            { val: "99.7%", label: "System\nUptime", color: C.blue },
            { val: "145ms", label: "API Response\nTime (avg)", color: "7C3AED" },
        ];

        bigStats.forEach((bs, i) => {
            const x = 0.3 + i * 1.88;
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 1.18, w: 1.72, h: 1.8,
                fill: { color: C.darkCard }, line: { color: bs.color, width: 1.5 },
                shadow: mkShadow()
            });
            s.addText(bs.val, {
                x: x + 0.05, y: 1.28, w: 1.62, h: 0.85,
                fontSize: 34, bold: true, color: bs.color, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
            s.addText(bs.label, {
                x: x + 0.05, y: 2.08, w: 1.62, h: 0.72,
                fontSize: 9.5, color: C.light, fontFace: "Trebuchet MS",
                align: "center", margin: 0
            });
        });

        // Deliverables checklist in 2 cols
        const deliverables = [
            "Full-stack web app deployed publicly",
            "SRS + SDD + API docs (Swagger)",
            "Trained ML models with benchmarks",
            "Docker containerisation all services",
            "Automated CI/CD via GitHub Actions",
            "8 sprint reports + meeting minutes",
            "UAT with 82% satisfaction score",
            "Risk register with all items resolved",
            "16-week timeline fully on schedule",
            "Live demo delivered to stakeholders",
        ];

        deliverables.forEach((d, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 0.3 + col * 4.85;
            const y = 3.18 + row * 0.46;
            s.addImage({ data: icCheck, x: x, y: y + 0.08, w: 0.24, h: 0.24 });
            s.addText(d, {
                x: x + 0.32, y: y + 0.04, w: 4.3, h: 0.38,
                fontSize: 11, color: C.offWhite, fontFace: "Trebuchet MS", margin: 0
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SLIDE 12 — LESSONS LEARNED & CONCLUSION
    // ═══════════════════════════════════════════════════════════
    {
        const s = pres.addSlide();
        s.background = { color: C.navy };

        // Diagonal accent
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.tealDark }, line: { color: C.tealDark, width: 0 } });
        s.addText("Lessons Learned & Conclusion", {
            x: 0.4, y: 0.12, w: 9, h: 0.55,
            fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0
        });
        s.addText("Retrospective Insights  ·  SPM Value Delivered  ·  Portfolio Achievement", {
            x: 0.4, y: 0.66, w: 9, h: 0.28,
            fontSize: 11, color: "CFFAFE", fontFace: "Trebuchet MS", italic: true, margin: 0
        });

        const lessons = [
            { num: "01", title: "Invest in tooling early", desc: "CI/CD + Jira in Week 2 paid dividends every single sprint — reduced integration bugs by 60%." },
            { num: "02", title: "Definitions create alignment", desc: "Definition of Done, acceptance criteria, and coding standards prevented more conflict than any team-building." },
            { num: "03", title: "Retrospectives drive improvement", desc: "Every measurable improvement traces back to a retrospective action item. Velocity grew 28 → 36 SP/sprint." },
            { num: "04", title: "Risk management is proactive", desc: "Documented risks didn't materialise. Undocumented ones caught us off guard. The register proved its value." },
            { num: "05", title: "Documentation is a team asset", desc: "Clear Jira stories and PR descriptions reduced cognitive load for the whole team and enabled full traceability." },
        ];

        lessons.forEach((l, i) => {
            const y = 1.15 + i * 0.84;
            s.addShape(pres.shapes.RECTANGLE, {
                x: 0.28, y, w: 9.44, h: 0.72,
                fill: { color: C.darkCard }, line: { color: "2D4A7A", width: 0.5 }
            });
            s.addShape(pres.shapes.RECTANGLE, {
                x: 0.28, y, w: 0.55, h: 0.72,
                fill: { color: C.tealDark }, line: { color: C.tealDark, width: 0 }
            });
            s.addText(l.num, { x: 0.3, y: y + 0.2, w: 0.5, h: 0.32, fontSize: 14, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", margin: 0 });
            s.addText(l.title, { x: 0.95, y: y + 0.08, w: 2.5, h: 0.32, fontSize: 12, bold: true, color: C.teal, fontFace: "Trebuchet MS", margin: 0 });
            s.addText(l.desc, { x: 0.95, y: y + 0.36, w: 8.6, h: 0.3, fontSize: 10.5, color: C.light, fontFace: "Trebuchet MS", margin: 0 });
        });

        // Closing
        s.addText("SmartHealth AI Assistant demonstrates that rigorous SPM practices—Agile Scrum, Jira, GitHub, risk management, and quality frameworks—deliver measurable outcomes within constrained academic timelines.", {
            x: 0.28, y: 5.33, w: 9.44, h: 0.22,
            fontSize: 9, color: C.slate, fontFace: "Trebuchet MS", italic: true, align: "center", margin: 0
        });
    }

    // ───────────────────────────────────────────────────────────
    await pres.writeFile({ fileName: "SmartHealth_SPM_Presentation.pptx" });
    console.log("Done!");
}

buildPresentation().catch(console.error);