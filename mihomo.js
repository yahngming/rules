const { name, type } = $arguments;

// Helper to filter and map proxy names while preserving original subscription order
function getNames(proxies, regex) {
    return (regex ? proxies.filter(p => regex.test(p.name)) : proxies).map(p => p.name);
}

// 1. In Sub-Store script nodes, the profile template object is passed directly in $files[0]
// If it is a string, Sub-Store's environment can map it or parse it directly
let config;
try {
    config = typeof $files[0] === 'string' ? JSON.parse($files[0]) : $files[0];
} catch (e) {
    // Fallback if Sub-Store passes it natively as a template object structure
    config = $files[0];
}

// 2. Fetch the upstream nodes via Sub-Store internal engine for Clash platform
let proxies = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? "collection" : "subscription",
    platform: "clash",
    produceType: "internal",
});

// 3. Ensure the base proxies array exists, then append the fetched nodes
if (!config.proxies) config.proxies = [];
config.proxies.push(...proxies);

// 4. Map and push the filtered node names into your target proxy groups (Strict Case-Sensitive Match)
if (config['proxy-groups']) {
    config['proxy-groups'].map(i => {
        if (['DEFAULT'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
        if (['FORCE'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建/i)); }
        if (['GAME'].includes(i.name)) { i.proxies.push(...getNames(proxies)); }
        if (['STREAM'].includes(i.name)) { i.proxies.push(...getNames(proxies, /自建|实验|日用|0\./i)); }
        if (['US'].includes(i.name)) { i.proxies.push(...getNames(proxies, /🇺🇸/i)); }
    });
}

// 5. Output the finished object config structure. 
// Sub-Store will automatically serialize this object into valid Clash YAML upon pipeline finalization!
$content = typeof config === 'string' ? config : JSON.stringify(config, null, 2);
