const { name, type } = $arguments;

function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

let config = $yaml.load($files[0]);
let proxies = await produceArtifact({
	name,
	type: /^1$|col/i.test(type) ? "collection" : "subscription",
	platform: "clash",
	produceType: "internal",
});

config.proxies.push(...proxies);
config['proxy-groups'].map(i => {
	const groupName = i.name.toLowerCase();
	if (['default'].includes(groupName)) { i.proxies.push(...getNames(proxies)); }
	if (['force'].includes(groupName)) { i.proxies.push(...getNames(proxies, /自建/i)); }
	if (['game'].includes(groupName)) { i.proxies.push(...getNames(proxies)); }
	if (['stream'].includes(groupName)) { i.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i)); }
	if (['us'].includes(groupName)) { i.proxies.push(...getNames(proxies, /🇺🇸/i)); }
});

$content = $yaml.dump(config);
