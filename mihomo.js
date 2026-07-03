const { name, type } = $arguments;

function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

function cleanProxy(proxy) {
	const cleaned = {};
	for (const key in proxy) {
		if (key.startsWith('_')) continue;
		const value = proxy[key];
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			cleaned[key] = cleanProxy(value);
		} else {
			cleaned[key] = value;
		}
	}
	return cleaned;
}

let baseContent = $content ?? (typeof $files !== 'undefined' ? $files[0] : "");
let config = ProxyUtils.yaml.safeLoad(baseContent);
let proxies = await produceArtifact({
	name,
	type: /^1$|col/i.test(type) ? "collection" : "subscription",
	platform: 'mihomo',
	produceType: 'internal' 
});
let cleanProxies = (proxies || [])
	.filter(p => p.type && p.type !== 'select')
	.map(p => cleanProxy(p));

config.proxies.push(...cleanProxies);
config['proxy-groups'] = config['proxy-groups'].map(group => {
	if (['DEFAULT'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies));}
	if (['FORCE'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /自建/i));}
	if (['GAME'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies));}
	if (['STREAM'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /自建|实验|日用|0\./i));}
	if (['US'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /🇺🇸/i));}
});

$content = ProxyUtils.yaml.dump(config);
