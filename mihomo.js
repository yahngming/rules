const { name, type } = $arguments;

function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

let config = $clash.parse($files[0]);
let proxies = await produceArtifact({
	name,
	type: /^1$|col/i.test(type) ? "collection" : "subscription",
	platform: "clash",
	produceType: "internal",
});

config.proxies.push(...proxies);
config['proxy-groups'].map(i => {
	if (['DEFAULT'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
	if (['FORCE'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建/i)); }
	if (['GAME'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
	if (['STREAM'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i)); }
	if (['US'].includes(i.name)) { i.proxies.push(...getNames(proxies, /🇺🇸/i)); }
});

$content = $clash.stringify(config);
