export const fetchAgentConfig = async () => {
  const res = await fetch("/agent-config.json");
  return res.json();
};

export const saveAgentMessage = async (data) => {
  const res = await fetch("/api/agent-message", {
    method: data.id ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateTone = async (tone) => {
  const res = await fetch("/api/tone", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tone }),
  });

  return res.json();
};