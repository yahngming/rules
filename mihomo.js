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

const baseContent = $content ?? (typeof $files !== 'undefined' ? $files[0] : "");
const config = ProxyUtils.yaml.safeLoad(baseContent);
let clashMetaProxies = await produceArtifact({
	name,
	type: /^1$|col/i.test(type) ? "collection" : "subscription",
	platform: 'ClashMeta',
	produceType: 'internal' 
});
const dynamicNodes = (clashMetaProxies || [])
	.filter(p => p.type && p.type !== 'select')
	.map(p => cleanProxy(p));

config.proxies.push(...dynamicNodes);
config['proxy-groups'] = config['proxy-groups'].map(group => {
	if (['DEFAULT'].includes(group.name)) {
		group.proxies.push(...getNames(dynamicNodes));
	}
	else if (['FORCE'].includes(group.name)) {
		group.proxies.push(...getNames(dynamicNodes, /自建/i));
	}
	else if (['GAME'].includes(group.name)) {
		group.proxies.push(...getNames(dynamicNodes));
	}
	else if (['STREAM'].includes(group.name)) {
		group.proxies.push(...getNames(dynamicNodes, /自建|实验|日用|0\./i));
	}
	else if (['US'].includes(group.name)) {
		group.proxies.push(...getNames(dynamicNodes, /🇺🇸/i));
	}
	return group;
});

$content = ProxyUtils.yaml.dump(config);
