const { name = "everything", type = "collection" } = $arguments || {};

function getTags(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({ name, type, platform: "sing-box", produceType: "internal" });

config.outbounds.push(...proxies);
config.outbounds.map(i => {
	if (['default'].includes(i.tag)) {i.outbounds.push(...getTags(proxies));}
	if (['force'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建/i));}
	if (['game'].includes(i.tag)) {i.outbounds.push(...getTags(proxies));}
	if (['stream'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /自建|实验|日用|0\./i));}
	if (['us'].includes(i.tag)) {i.outbounds.push(...getTags(proxies, /🇺🇸/i));}
});

$content = JSON.stringify(config, null, 2);
