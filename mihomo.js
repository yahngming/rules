const { name, type } = $arguments;

function getNames(proxies, regex) {
	return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

function cleanProxy(proxy) {
	const cleaned = {};
	for (const key in proxy) {
		if (key.startsWith('_')) continue;
		const value = proxy[key];
		if (value === '' || value === null || value === undefined) continue;
		if (typeof value === 'object' && !Array.isArray(value)) {
			const nestedCleaned = cleanProxy(value);
			if (Object.keys(nestedCleaned).length > 0) {
				cleaned[key] = nestedCleaned;
			}
		} else {
			cleaned[key] = value;
		}
	}
	return cleaned;
}

function toYaml(obj, indent = 0) {
	const spaces = ' '.repeat(indent);
	if (obj === null) return 'null';
	if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
	if (typeof obj === 'string') {
		if (obj.includes('\n') || obj.includes(':') || obj.includes('[') || obj.includes(']')) {
			return `"${obj.replace(/"/g, '\\"')}"`;
		}
		return obj;
	}
	if (Array.isArray(obj)) {
		if (obj.length === 0) return '[]';
		if (obj.every(item => typeof item === 'string' || typeof item === 'number')) {
			return '\n' + obj.map(item => `${spaces}- ${typeof item === 'string' && (item.includes(':') || item.includes(',')) ? `"${item}"` : item}`).join('\n');
		}
		return '\n' + obj.map(item => `${spaces}- ${toYaml(item, indent + 2).trim()}`).join('\n');
	}
	if (typeof obj === 'object') {
		return '\n' + Object.keys(obj).map(key => {
			const val = obj[key];
			if (typeof val === 'object' && val !== null) {
				return `${spaces}${key}:${toYaml(val, indent + 2)}`;
			}
			return `${spaces}${key}: ${toYaml(val, indent)}`;
		}).join('\n');
	}
	return '';
}

let config = {
  "hosts": {
    "time.android.com": "203.107.6.88"
  },
  "proxies": [], 
  "proxy-groups": [
    { "name": "DEFAULT", "type": "select", "proxies": ["DIRECT"] },
    { "name": "FORCE", "type": "select", "proxies": ["DEFAULT", "DIRECT"] },
    { "name": "GAME", "type": "select", "proxies": ["DEFAULT", "DIRECT"] },
    { "name": "STREAM", "type": "select", "proxies": ["DEFAULT", "DIRECT"] },
    { "name": "US", "type": "select", "proxies": ["DEFAULT", "DIRECT"] }
  ],
  "rule-providers": {
    "ads": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads-all.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "ai": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "blizzard": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/blizzard.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "cn": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "cnip": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs", "interval": 86400, "behavior": "ipcidr", "format": "mrs" },
    "direct": { "type": "http", "url": "https://raw.githubusercontent.com/yahngming/rules/master/direct.list", "interval": 86400, "behavior": "classical", "format": "text" },
    "emby": { "type": "http", "url": "https://raw.githubusercontent.com/yahngming/rules/master/emby.list", "interval": 86400, "behavior": "classical", "format": "text" },
    "force": { "type": "http", "url": "https://raw.githubusercontent.com/yahngming/rules/master/force.list", "interval": 86400, "behavior": "classical", "format": "text" },
    "game": { "type": "http", "url": "https://raw.githubusercontent.com/yahngming/rules/master/game.list", "interval": 86400, "behavior": "classical", "format": "text" },
    "github": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "google": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "netflix": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "private": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "privateip": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs", "interval": 86400, "behavior": "ipcidr", "format": "mrs" },
    "reject": { "type": "http", "url": "https://raw.githubusercontent.com/yahngming/rules/master/reject.list", "interval": 86400, "behavior": "classical", "format": "text" },
    "steam": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "x": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/x.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" },
    "youtube": { "type": "http", "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs", "interval": 86400, "behavior": "domain", "format": "mrs" }
  },
  "rules": [
    "RULE-SET,privateip,DIRECT,no-resolve",
    "RULE-SET,force,FORCE",
    "RULE-SET,ads,REJECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,cn,DIRECT",
    "RULE-SET,cnip,DIRECT",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,blizzard,GAME",
    "RULE-SET,game,GAME",
    "RULE-SET,steam,GAME",
    "RULE-SET,emby,STREAM",
    "RULE-SET,netflix,STREAM",
    "RULE-SET,ai,US",
    "RULE-SET,github,US",
    "RULE-SET,google,US",
    "RULE-SET,x,US",
    "RULE-SET,youtube,US",
    "MATCH,DEFAULT"
  ]
};
let proxies = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? "collection" : "subscription",
    platform: "mihomo", 
    produceType: "internal",
});

const cleanedProxies = proxies.map(p => cleanProxy(p));
config.proxies.push(...cleanedProxies);
if (config['proxy-groups']) {
	config['proxy-groups'].map(i => {
		if (['DEFAULT'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
		if (['FORCE'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建/i)); }
		if (['GAME'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
		if (['STREAM'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i)); }
		if (['US'].includes(i.name)) { i.proxies.push(...getNames(proxies, /🇺🇸/i)); }
	});
}

$content = toYaml(config).trim();
