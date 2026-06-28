function operator(proxies) {
	return proxies.map(p => {
		delete p['packet-encoding'];
		return p;
	});
}
