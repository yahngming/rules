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
  if (['white'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建/i));}
  if (['game'].includes(i.tag)) {i.outbounds.push(...getTags(proxies));}
  if (['stream'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建|实验|直连|TEST|Emby|0\./i));}
  if (['us'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /🇺🇸/i));}
  if (['default'].includes(i.tag)) {i.outbounds.push(...getTags(proxies));}
});

$content = JSON.stringify(config, null, 2);
