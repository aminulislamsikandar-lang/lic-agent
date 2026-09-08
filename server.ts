import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db, DbUser } from './server/db';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-insurecare-secret';

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

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
  if (!token || revokedTokens.has(token)) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
    if (!decoded?.userId) return null;

    const user = db.findUserById(decoded.userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };
  } catch {
    return null;
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.headers['x-auth-token'] as string | undefined)?.trim();

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const sessionUser = verifyTokenAndGetUser(token);
  if (!sessionUser) return res.status(401).json({ error: 'Session expired or invalid token' });

  (req as any).user = sessionUser;
  next();
}

function requireAdvisor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as SessionUser | undefined;
  if (!user || user.role !== 'Advisor') {
    return res.status(403).json({ error: 'Advisor permission required' });
  }
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health/live', (_req, res) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

app.get('/api/health/ready', (_req, res) => {
  try {
    db.get();
    res.status(200).json({ status: 'ready', checks: { database: 'ok' }, timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'not_ready', checks: { database: 'failed' }, timestamp: new Date().toISOString() });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUser(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({
    token: generateToken(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.headers['x-auth-token'] as string | undefined)?.trim();
  if (token) revokedTokens.add(token);
  res.json({ success: true });
});

app.post('/api/leads', (req, res) => {
  const { name, phone, email, city, product_interest, preferred_time, message, source, sum_assured_estimate } = req.body || {};
  if (typeof name !== 'string' || typeof phone !== 'string' || !name.trim() || !phone.trim()) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const createdLead = db.addLead({
    name: name.trim(), phone: phone.trim(), email: typeof email === 'string' ? email : '',
    city: typeof city === 'string' && city ? city : 'General Inquiry',
    product_interest: typeof product_interest === 'string' && product_interest ? product_interest : 'Insurance Consultation',
    preferred_time: typeof preferred_time === 'string' && preferred_time ? preferred_time : 'Anytime',
    message: typeof message === 'string' ? message : '', source: typeof source === 'string' && source ? source : 'Website', sum_assured_estimate,
  });

  res.status(201).json({ success: true, message: 'Thank you! Your inquiry has been received. Our advisor will reach out shortly.', lead: createdLead });
});

app.get('/api/data', authMiddleware, (_req, res) => {
  const data = db.get();
  const safeStaff = data.users.map(({ password: _password, ...user }) => user);
  res.json({ clients: data.clients, policies: data.policies, leads: data.leads, timeline: data.timeline, callLogs: data.callLogs, automationRules: data.automationRules, templates: data.templates, advisorProfile: data.advisorProfile, staffMembers: safeStaff, notifications: data.notifications });
});

app.put('/api/leads/:id/status', authMiddleware, (req, res) => {
  const { status, notes } = req.body || {};
  const lead = db.updateLeadStatus(req.params.id, status, notes);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, lead });
});

app.post('/api/leads/:id/convert', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { clientData, policyData } = req.body || {};
  const result = db.convertLeadToClient(req.params.id, clientData, policyData, user.name);
  if (!result) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, ...result });
});

app.post('/api/clients', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { client, initialPolicy } = req.body || {};
  if (!client || !client.name || !client.phone) return res.status(400).json({ error: 'Client name and phone are required' });
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

app.post('/api/policies', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const policy = db.addPolicy(req.body, user.name);
  res.status(201).json({ success: true, policy });
});

app.put('/api/policies/:id/status', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { status } = req.body || {};
  const policy = db.updatePolicyStatus(req.params.id, status, user.name);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json({ success: true, policy });
});

app.delete('/api/policies/:id', authMiddleware, requireAdvisor, (req, res) => {
  db.deletePolicy(req.params.id);
  res.json({ success: true, message: 'Policy deleted' });
});

app.post('/api/calls', authMiddleware, (req, res) => {
  const user = (req as any).user as SessionUser;
  const { clientId, outcome, notes, policyId, followUpDate, markPaid } = req.body || {};
  if (!clientId || !outcome) return res.status(400).json({ error: 'Client ID and outcome are required' });
  const newLog = db.logCall(clientId, outcome, notes, policyId, followUpDate, markPaid, user.name);
  res.status(201).json({ success: true, callLog: newLog });
});

app.post('/api/timeline', authMiddleware, (req, res) => {
  const entry = db.logTimeline(req.body);
  res.status(201).json({ success: true, entry });
});

app.put('/api/rules/:id/toggle', authMiddleware, requireAdvisor, (req, res) => {
  const rule = db.toggleRule(req.params.id);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  res.json({ success: true, rule });
});

app.post('/api/automation/run', authMiddleware, requireAdvisor, (_req, res) => {
  const outcome = db.executeAutomation();
  res.json({ success: true, ...outcome });
});

app.put('/api/profile', authMiddleware, requireAdvisor, (req, res) => {
  const updated = db.updateAdvisorProfile(req.body);
  res.json({ success: true, profile: updated });
});

app.post('/api/notifications/read', authMiddleware, (_req, res) => {
  db.markNotificationsRead();
  res.json({ success: true });
});

app.post('/api/reset', authMiddleware, requireAdvisor, (_req, res) => {
  const resetData = db.resetData();
  res.json({ success: true, data: resetData });
});

async function start() {
  if (NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`InsureCare Server running on port ${PORT} (${NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received; shutting down gracefully`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
