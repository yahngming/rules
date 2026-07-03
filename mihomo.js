function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

let baseContent = $content ?? (typeof $files !== 'undefined' ? $files[0] : "");
let config = ProxyUtils.yaml.safeLoad(baseContent);
let dynamicProxies = config.proxies || [];
config.proxies = dynamicProxies.map(p => {
	let cleaned = {};
	for (let key in p) {
		if (!key.startsWith('_')) {
			cleaned[key] = p[key];
		}
	}
	return cleaned;
});
let cleanProxies = config.proxies.filter(p => p.type && p.type !== 'select');

config['proxy-groups'] = (config['proxy-groups'] || []).map(group => {
	if (['DEFAULT'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies));}
	if (['FORCE'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /自建/i));}
	if (['GAME'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies));}
	if (['STREAM'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /自建|实验|日用|0\./i));}
	if (['US'].includes(group.name)) {group.proxies.push(...getNames(cleanProxies, /🇺🇸/i));}
	return group;
});

$content = ProxyUtils.yaml.dump(config);
