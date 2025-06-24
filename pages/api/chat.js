export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const assistant_id = "asst_DSrlApTOUx2cGTvdGxGQSKiR";

  const messages = req.body.messages;

  // Step 1: Create thread
  const threadRes = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });
  const thread = await threadRes.json();

  // Step 2: Add messages to thread
  await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      role: "user",
      content: messages[messages.length - 1].content,
    }),
  });

  // Step 3: Run the Assistant
  const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      assistant_id,
    }),
  });

  const run = await runRes.json();

  // Step 4: Poll until run is complete
  let status = run.status;
  while (status === "queued" || status === "in_progress") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const statusRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });
    const statusData = await statusRes.json();
    status = statusData.status;
  }

  // Step 5: Get the response message
  const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });
  const messageData = await messagesRes.json();
  const resultMessage = messageData.data?.[0]?.content?.[0]?.text?.value || "No answer received.";

  res.status(200).json({ result: resultMessage });
}
