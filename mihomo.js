function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

let config = ProxyUtils.yaml.safeLoad($content ?? (typeof $files !== 'undefined' ? $files[0] : ""));
let proxies = config.proxies.filter(p => p.type && p.type !== 'select');

config['proxy-groups'] = (config['proxy-groups'] || []).map(group => {
	if (['DEFAULT'].includes(group.name)) {group.proxies.push(...getNames(proxies));}
	if (['FORCE'].includes(group.name)) {group.proxies.push(...getNames(proxies, /自建/i));}
	if (['GAME'].includes(group.name)) {group.proxies.push(...getNames(proxies));}
	if (['STREAM'].includes(group.name)) {group.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i));}
	if (['US'].includes(group.name)) {group.proxies.push(...getNames(proxies, /🇺🇸/i));}
	return group;
});

$content = ProxyUtils.yaml.dump(config);
