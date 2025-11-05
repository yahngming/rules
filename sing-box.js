const { name, type } = $arguments;

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? "collection" : "subscription",
  platform: "sing-box",
  produceType: "internal",
});

const existingTags = config.outbounds.map(o => o.tag);
proxies = proxies.filter(p => !existingTags.includes(p.tag));
config.outbounds.push(...proxies);

const allTags = proxies.map(p => p.tag);
const terminalTags = proxies.filter(p => !p.detour).map(p => p.tag);
config.outbounds.forEach(group => {
  if (!Array.isArray(group.outbounds) || group.tag === "direct") return;
  if (group.tag === "relay") {
    group.outbounds.push(...terminalTags);
  } else {
    group.outbounds.push(...allTags);
  }
});
config.outbounds.forEach(group => {
  if (Array.isArray(group.outbounds)) {
    group.outbounds = [...new Set(group.outbounds)];
  }
});

$content = JSON.stringify(config, null, 2);
