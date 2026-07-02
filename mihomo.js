const { name, type } = $arguments;

// Helper to filter and map proxy names while preserving original subscription order
function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

// 1. Parse your base template config (Clash YAML structure)
let config = YAML.parse($files[0]);

// 2. Fetch the upstream nodes via Sub-Store internal engine for Clash platform
let proxies = await produceArtifact({
	name,
	type: /^1$|col/i.test(type) ? "collection" : "subscription",
	platform: "clash", // Switched platform target to clash/mihomo
	produceType: "internal",
});

// 3. Ensure the base proxies array exists, then append the fetched nodes
if (!config.proxies) config.proxies = [];
config.proxies.push(...proxies);

// 4. Map and push the filtered node names into your target proxy groups
if (config['proxy-groups']) {
	config['proxy-groups'].map(i => {
		if (['default'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
		if (['force'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建/i)); }
		if (['game'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
		if (['stream'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i)); }
		if (['us'].includes(i.name)) { i.proxies.push(...getNames(proxies, /🇺🇸/i)); }
	});
}

// 5. Output the finished YAML configuration string
$content = YAML.stringify(config);
