const { name, type } = $arguments;

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? "collection" : "subscription",
  platform: "sing-box",
  produceType: "internal",
});

config.outbounds.push(...proxies);
config.outbounds.map(i => {
  if (['default'].includes(i.tag)) {i.outbounds.push(...getTags(proxies));}
  if (['white'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建/i));}
  if (['emby'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /Emby|自建|实验|直连|TEST/i));}
  if (['github'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建|实验|直连|TEST/i));}
  if (['netflix'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /🇦🇷|🇵🇰|🇹🇷|实验|直连|TEST/i));}
  if (['steam'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /🇦🇷|🇭🇰|🇯🇵|🇵🇰|🇸🇬|🇹🇷|🇹🇼/i));}
  if (['youtube'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /🇺🇸/i));}
});

$content = JSON.stringify(config, null, 2);
