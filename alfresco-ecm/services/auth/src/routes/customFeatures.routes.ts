// Custom feature endpoints (batch_09 audit suggestions)
// Implements ECM-oriented suggestions: tenant-grounded LLM assistant, compliance pack,
// PII redaction pipeline, workflow analytics, cross-tenant marketplace, real-time co-editing bootstrap.
import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';

async function callLLM(system: string, user: string, maxTokens = 2000) {
  if (!process.env.OPENROUTER_API_KEY) {
    const e: any = new Error('OPENROUTER_API_KEY not configured');
    e.statusCode = 503;
    throw e;
  }
  const r = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      max_tokens: maxTokens,
      temperature: 0.4,
    }),
  });
  const data: any = await r.json();
  return { content: data?.choices?.[0]?.message?.content || '', model: data?.model };
}

function parseJSON(t: string) {
  if (!t) return null;
  const c = t.replace(/```(?:json)?/gi, '').replace(/```/g, '');
  const m = c.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

function err(res: Response, e: any, label: string) {
  if (e.statusCode === 503) return res.status(503).json({ error: e.message });
  logger.error(`${label} error: ${e.message}`);
  res.status(500).json({ error: e.message });
}

// 1. LLM knowledge assistant grounded on tenant content
router.post('/tenant-assistant', async (req: Request, res: Response) => {
  try {
    const { question, tenant_id, top_k_snippets } = req.body || {};
    if (!question || !tenant_id) return res.status(400).json({ error: 'question and tenant_id required' });
    const ai = await callLLM(
      `You are a tenant-scoped ECM assistant for tenant ${tenant_id}. Only answer using provided snippets; cite snippet ids. JSON only.`,
      `QUESTION: ${question}\nSNIPPETS: ${JSON.stringify(top_k_snippets || []).slice(0, 6000)}\nReturn JSON {"answer":"","citations":[{"snippet_id":"","quote":""}],"confidence":0,"needs_human_review":false}`
    );
    res.json({ type: 'tenant-assistant', tenant_id, result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e: any) { err(res, e, 'tenant-assistant'); }
});

// 2. Automated compliance pack generation (SOC2 / ISO27001)
router.post('/compliance-pack', async (req: Request, res: Response) => {
  try {
    const { framework = 'SOC2', controls_evidence } = req.body || {};
    const ai = await callLLM(
      `You assemble a compliance evidence pack for ${framework}. JSON only.`,
      `EVIDENCE: ${JSON.stringify(controls_evidence || {}).slice(0, 4000)}\nReturn JSON {"framework":"","controls":[{"id":"","status":"pass|gap|na","evidence_ref":""}],"gaps":[""],"executive_summary":"","next_audit_steps":[""]}`,
      2800
    );
    res.json({ type: 'compliance-pack', framework, result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e: any) { err(res, e, 'compliance-pack'); }
});

// 3. Smart-redaction pipelines for PII/PHI
// TODO: configure credentials for REDACTION_VAULT_KEY (KMS for redacted vault).
router.post('/redaction', async (req: Request, res: Response) => {
  try {
    const { text, classes = ['PII', 'PHI'] } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text required' });
    const ai = await callLLM(
      `You redact PII/PHI from text. Vault key set: ${Boolean(process.env.REDACTION_VAULT_KEY)}. JSON only.`,
      `CLASSES: ${classes.join(', ')}\nTEXT: ${text.slice(0, 8000)}\nReturn JSON {"redacted_text":"","spans":[{"start":0,"end":0,"class":"","replacement":""}],"residual_risk":"low|med|high"}`,
      2500
    );
    res.json({ type: 'redaction', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e: any) { err(res, e, 'redaction'); }
});

// 4. Workflow analytics with bottleneck detection
router.post('/workflow-bottlenecks', async (req: Request, res: Response) => {
  try {
    const { workflow_runs } = req.body || {};
    if (!Array.isArray(workflow_runs)) return res.status(400).json({ error: 'workflow_runs array required' });
    const ai = await callLLM(
      'You spot workflow bottlenecks from run logs. JSON only.',
      `RUNS: ${JSON.stringify(workflow_runs.slice(0, 40))}\nReturn JSON {"bottleneck_steps":[{"step":"","avg_wait_minutes":0,"frequency":0}],"throughput_change":"up|flat|down","recommendations":[""]}`
    );
    res.json({ type: 'workflow-bottlenecks', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e: any) { err(res, e, 'workflow-bottlenecks'); }
});

// 5. Cross-tenant content marketplace
router.post('/content-marketplace', async (req: Request, res: Response) => {
  try {
    const { offering, browse_query } = req.body || {};
    const ai = await callLLM(
      'You curate a cross-tenant content marketplace: search ranking and pricing hints. JSON only.',
      `OFFERING: ${JSON.stringify(offering || {})}\nQUERY: ${browse_query || ''}\nReturn JSON {"recommended_listings":[{"id":"","title":"","price_usd":0,"fit_score":0}],"pricing_suggestion_usd":0,"category_tags":[""]}`
    );
    res.json({ type: 'content-marketplace', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e: any) { err(res, e, 'content-marketplace'); }
});

// 6. Real-time co-editing session bootstrap (operational transforms)
router.post('/co-editing-session', async (req: Request, res: Response) => {
  try {
    const { document_id, participants } = req.body || {};
    if (!document_id) return res.status(400).json({ error: 'document_id required' });
    const sessionId = `coed_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    // TODO: configure credentials for OT_SERVER_SECRET (real OT/CRDT backend).
    res.json({
      type: 'co-editing-session',
      sessionId,
      document_id,
      ot_endpoint: process.env.OT_SERVER_URL || 'ws://localhost:3013/ot',
      participants: Array.isArray(participants) ? participants : [],
      started_at: new Date().toISOString(),
    });
  } catch (e: any) { err(res, e, 'co-editing-session'); }
});

export const customFeaturesRouter = router;
