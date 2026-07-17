interface RobotsRule {
  type: "allow" | "disallow";
  path: string;
}

interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
}

function parseRobotsGroups(robots: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;

  for (const rawLine of robots.split("\n")) {
    const line = rawLine.split("#")[0]?.trim() ?? "";
    if (!line) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === "user-agent") {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }

    if (!current) continue;

    if (key === "allow" || key === "disallow") {
      current.rules.push({ type: key, path: value });
    }
  }

  return groups;
}

function agentMatches(agents: string[], userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return agents.some(
    (agent) => agent === "*" || ua.includes(agent) || agent.includes("persidian")
  );
}

function pathMatches(rulePath: string, requestPath: string): boolean {
  if (rulePath === "") return false;
  if (rulePath === "/") return true;
  return requestPath.startsWith(rulePath);
}

export function isPathBlocked(
  robots: string | null,
  path = "/",
  userAgent = "Persidian-Xray"
): boolean {
  if (!robots) return false;

  const groups = parseRobotsGroups(robots).filter((group) =>
    agentMatches(group.agents, userAgent)
  );

  let allowed = true;

  for (const group of groups) {
    for (const rule of group.rules) {
      if (!pathMatches(rule.path, path)) continue;
      allowed = rule.type === "allow";
    }
  }

  return !allowed;
}
