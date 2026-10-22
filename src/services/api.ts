import type { Session } from '../types';

const SYSTEM_PROMPT = `You are THM Copilot, an intelligent and educational assistant for learning cybersecurity and solving TryHackMe labs.
Your role is to act as a technical mentor, NOT a simple command generator.

Guidelines:
1. Analyze the evidence provided by the user in the context of the room's objective.
2. Explain what the evidence means clearly.
3. Suggest the most promising NEXT STEP based on the evidence.
4. Provide commands only when appropriate, explaining what they do and what the user should observe in the output.
5. NEVER invent flags or assume a hypothesis is true without evidence. Do not record a finding as a "confirmed" discovery unless the exact terminal output provided strictly verifies it.
6. Acknowledge when information is missing and guide the user on how to find it.
7. Avoid repeating tests that have already been done unless there is a specific reason to do so.
8. Structure your response logically in Markdown. You may use headings like "Análise das evidências" (Evidence Analysis), "Próximo passo recomendado" (Recommended Next Step), etc., as appropriate for the user's language (default to Portuguese if requested, else match user's language).

CRITICAL REQUIREMENT:
You MUST return your response as a valid JSON object. Do not wrap it in markdown code blocks. The JSON object must strictly match the following schema:
{
  "reply": "The markdown-formatted text response representing your mentorship and analysis.",
  "new_discoveries": ["Array of string descriptions of new CONFIRMED facts (e.g. 'Port 22 is open'). Only include NEW confirmed facts that haven't been tracked yet."],
  "new_hypotheses": ["Array of string descriptions of new UNCONFIRMED hypotheses (e.g. 'FTP might allow anonymous login'). Only include NEW hypotheses."]
}`;

export interface ParsedChatResponse {
  reply: string;
  newDiscoveries: string[];
  newHypotheses: string[];
}

export const generateChatResponse = async (session: Session): Promise<ParsedChatResponse> => {
  // Construct the payload for the OpenAI API
  const messagesPayload = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content: `CURRENT INVESTIGATION CONTEXT:
Room: ${session.roomInfo.name}
Description: ${session.roomInfo.description}
Objective: ${session.roomInfo.objective}
Target IP: ${session.roomInfo.ip || 'Not provided'}

PREVIOUSLY TRACKED DISCOVERIES (Do not output these again):
${session.evidence.filter(e => e.status === 'confirmed').map(e => '- ' + e.description).join('\n') || 'None'}

PREVIOUSLY TRACKED HYPOTHESES:
${session.evidence.filter(e => e.status === 'hypothesis').map(e => '- ' + e.description).join('\n') || 'None'}`
    }
  ];

  // Map session messages to OpenAI format
  // We format user messages to clearly separate commands, output, and notes
  const history = session.messages.map((msg) => {
    if (msg.role === 'user' && msg.metadata) {
      let content = '';
      if (msg.metadata.commandExecuted) content += `Command Executed:\n${msg.metadata.commandExecuted}\n\n`;
      if (msg.metadata.terminalOutput) content += `Terminal Output:\n${msg.metadata.terminalOutput}\n\n`;
      if (msg.metadata.note) content += `User Note: ${msg.metadata.note}`;
      return { role: 'user', content: content.trim() || msg.content };
    }

    // Ignore system messages from UI in the API payload
    if (msg.role === 'system') return null;

    return { role: msg.role, content: msg.content };
  }).filter(Boolean);

  messagesPayload.push(...(history as any));

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: messagesPayload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detailedMessage = errorData.details ? `: ${errorData.details}` : '';
    throw new Error(`${errorData.error || 'Server error'}${detailedMessage}`);
  }

  const data = await response.json();
  const rawReply = data.reply;

  try {
    // Attempt to parse the JSON response. Handles markdown ```json formatting if the AI includes it.
    let jsonString = rawReply;
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    const parsed = JSON.parse(jsonString);

    return {
      reply: parsed.reply || 'No response provided.',
      newDiscoveries: Array.isArray(parsed.new_discoveries) ? parsed.new_discoveries : [],
      newHypotheses: Array.isArray(parsed.new_hypotheses) ? parsed.new_hypotheses : []
    };
  } catch (error) {
    console.warn('Failed to parse AI response as JSON. Falling back to plain text treatment.', error);
    return {
      reply: rawReply,
      newDiscoveries: [],
      newHypotheses: []
    };
  }
};
