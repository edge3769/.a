const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../../../src/routes/__error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/edit/[id].svelte"),
	() => import("../../../src/routes/add.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/auth/login.js
	[/^\/auth\/login\/?$/],

	// src/routes/auth/exit.js
	[/^\/auth\/exit\/?$/],

	// src/routes/auth/join.js
	[/^\/auth\/join\/?$/],

	// src/routes/edit/[id].svelte
	[/^\/edit\/([^/]+?)\/?$/, [c[0], c[4]], [c[1]], (m) => ({ id: d(m[1])})],

	// src/routes/add.svelte
	[/^\/add\/?$/, [c[0], c[5]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];