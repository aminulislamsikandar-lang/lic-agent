import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db, DbUser } from './server/db';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side secret for signing and verifying tokens
const JWT_SECRET: string = process.env.JWT_SECRET || 'insurecare-secure-crm-signing-key-2026';

// Token helpers (properly signed JWT)
interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'Advisor' | 'Staff';
  phone: string;
}

interface JwtTokenPayload {
  userId: string;
  email: string;
  role: 'Advisor' | 'Staff';
}

// In-memory blacklist for tokens invalidated on explicit logout
const revokedTokens = new Set<string>();

function generateToken(user: DbUser): string {
  const payload: JwtTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyTokenAndGetUser(token: string): SessionUser | null {
  if (!token || revokedTokens.has(token)) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = db.findUserById(decoded.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };
  } catch {
    // Strictly reject any token that fails signature verification or is expired
    return null;
  }
}

// Authentication Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-auth-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const sessionUser = verifyTokenAndGetUser(token);
  if (!sessionUser) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  (req as any).user = sessionUser;
  next();
}

// Require Advisor Role (Staff restriction for Settings, Automations, Deletions)
function requireAdvisor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as SessionUser;
  if (!user || user.role !== 'Advisor') {
    return res.status(403).json({
      error: 'Access denied: Staff accounts do not have permission for Settings or Automations.',
    });
  }
  next();
}

// ==========================================
// 1. PUBLIC API ROUTES (NO AUTH REQUIRED)
// ==========================================

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    },
  });
});

// Current User Verification
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-auth-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const sessionUser = verifyTokenAndGetUser(token);
  if (!sessionUser) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  res.json({ user: sessionUser });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-auth-token'] as string);
  if (token) {
    revokedTokens.add(token);
  }
  res.json({ success: true });
});

// Public Lead Capture (Open to anyone submitting via website)
app.post('/api/leads', (req, res) => {
  const { name, phone, email, city, product_interest, preferred_time, message, source, sum_assured_estimate } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const createdLead = db.addLead({
    name,
    phone,
    email: email || '',
    city: city || 'General Inquiry',
    product_interest: product_interest || 'Insurance Consultation',
    preferred_time: preferred_time || 'Anytime',
    message: message || '',
    source: source || 'Website',
    sum_assured_estimate,
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your inquiry has been received. Our advisor will reach out shortly.',
    lead: createdLead,
  });
});

// ==========================================
// 2. PROTECTED CRM ROUTES (AUTH REQUIRED)
// ==========================================

// Full Data Fetch
app.get('/api/data', (_req, res) => {
  const data = db.get();
  // Strip passwords for safety
  const safeStaff = data.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
  }));

  res.json({
    clients: data.clients,
    policies: data.policies,
    leads: data.leads,
    timeline: data.timeline,
    callLogs: data.callLogs,
    automationRules: data.automationRules,
    templates: data.templates,
    advisorProfile: data.advisorProfile,
    staffMembers: safeStaff,
    notifications: data.notifications,
  });
});

// Leads Management
app.put('/api/leads/:id/status', authMiddleware, (req, res) => {
  const { status, notes } = req.body;
  const lead = db.updateLeadStatus(req.params.id, status, notes);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, lead });
});

app.post('/api/leads/:id/convert', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { clientData, policyData } = req.body;
  const result = db.convertLeadToClient(req.params.id, clientData, policyData, user.name);
  if (!result) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, ...result });
});

// Clients Management
app.post('/api/clients', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { client, initialPolicy } = req.body;
  if (!client || !client.name || !client.phone) {
    return res.status(400).json({ error: 'Client name and phone are required' });
  }
  const newClient = db.addClient(client, initialPolicy, user.name);
  res.status(201).json({ success: true, client: newClient });
});

app.put('/api/clients/:id', authMiddleware, (req, res) => {
  const updatedClient = db.updateClient(req.body);
  res.json({ success: true, client: updatedClient });
});

app.delete('/api/clients/:id', authMiddleware, requireAdvisor, (req, res) => {
  db.deleteClient(req.params.id);
  res.json({ success: true, message: 'Client and policies deleted' });
});

// Policies Management
app.post('/api/policies', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const policy = db.addPolicy(req.body, user.name);
  res.status(201).json({ success: true, policy });
});

app.put('/api/policies/:id/status', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { status } = req.body;
  const policy = db.updatePolicyStatus(req.params.id, status, user.name);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json({ success: true, policy });
});

app.delete('/api/policies/:id', authMiddleware, requireAdvisor, (req, res) => {
  db.deletePolicy(req.params.id);
  res.json({ success: true, message: 'Policy deleted' });
});

// Calls & Interactions
app.post('/api/calls', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { clientId, outcome, notes, policyId, followUpDate, markPaid } = req.body;
  if (!clientId || !outcome) {
    return res.status(400).json({ error: 'Client ID and outcome are required' });
  }

  const newLog = db.logCall(
    clientId,
    outcome,
    notes,
    policyId,
    followUpDate,
    markPaid,
    user.name
  );
  res.status(201).json({ success: true, callLog: newLog });
});

app.post('/api/timeline', authMiddleware, (req, res) => {
  const entry = db.logTimeline(req.body);
  res.status(201).json({ success: true, entry });
});

// Automation Rules (Restricted to Advisor)
app.put('/api/rules/:id/toggle', authMiddleware, requireAdvisor, (req, res) => {
  const rule = db.toggleRule(req.params.id);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  res.json({ success: true, rule });
});

app.post('/api/automation/run', authMiddleware, (req, res) => {
  const outcome = db.executeAutomation();
  res.json({ success: true, ...outcome });
});

// Settings & Profile (Restricted to Advisor)
app.put('/api/profile', authMiddleware, requireAdvisor, (req, res) => {
  const updated = db.updateAdvisorProfile(req.body);
  res.json({ success: true, profile: updated });
});

// Notifications
app.post('/api/notifications/read', authMiddleware, (_req, res) => {
  db.markNotificationsRead();
  res.json({ success: true });
});

// Reset Demo Data (Restricted to Advisor)
app.post('/api/reset', authMiddleware, requireAdvisor, (_req, res) => {
  const resetData = db.resetData();
  res.json({ success: true, data: resetData });
});

// ==========================================
// 3. FRONTEND VITE MIDDLEWARE / STATIC SERVING
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InsureCare Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
