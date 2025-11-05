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
const allTags = proxies.map(p => p.tag);
const terminalTags = proxies.filter(p => !p.detour).map(p => p.tag);
function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}

config.outbounds.push(...proxies);
config.outbounds.map(i => {
  if (['all'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['eco'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /自建|实验|直连|TEST/i))
  }
  if (['eu'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇫🇷|🇩🇪|🇮🇹|🇳🇱|🇪🇸|🇬🇧/i))
  }
  if (['hk'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇭🇰/i))
  }
  if (['jp'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇯🇵/i))
  }
  if (['us'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇺🇸/i))
  }
})
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
