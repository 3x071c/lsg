/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
import type { ServerBuild } from "remix";
import { resolve } from "path";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const app = express();

/* https://expressjs.com/en/advanced/best-practice-security.html */
// app.use(helmet());
app.disable("x-powered-by");

app.use((req, res, next) => {
	// helpful headers:
	res.set("x-fly-region", process.env["FLY_REGION"] ?? "unknown");
	res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

	// /clean-urls/ -> /clean-urls
	if (req.path.endsWith("/") && req.path.length > 1) {
		const query = req.url.slice(req.path.length);
		const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
		res.redirect(301, safepath + query);
		return;
	}
	next();
});

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all("*", function getReplayResponse(req, res, next) {
	const { method, path: pathname } = req;
	const { PRIMARY_REGION, FLY_REGION } = process.env;

	const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method);
	const isReadOnlyRegion =
		FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

	const shouldReplay = isMethodReplayable && isReadOnlyRegion;

	if (!shouldReplay) return next();

	const logInfo = {
		FLY_REGION,
		method,
		pathname,
		PRIMARY_REGION,
	};
	console.info(`[SERVER] ⏳ Replaying:`, logInfo);
	res.set("fly-replay", `region=${PRIMARY_REGION}`);
	return res.sendStatus(409);
});

app.use(compression());

// Remix fingerprints its assets so we can cache forever
app.use(
	"/build",
	express.static("public/build", { immutable: true, maxAge: "1 year" }),
);

// Cache all other static assets too
app.use(express.static("public", { maxAge: "1 week" }));

app.use(morgan("combined"));

const BUILD_DIR = resolve(".remix", "server");

app.all(
	"*",
	createRequestHandler({
		build: require(BUILD_DIR) as ServerBuild,
	}),
);

const port = process.env["PORT"] || 3000;

const server = app.listen(port, () => {
	console.log(`[SERVER] ✅ http://localhost:${port}`);
});

/* Handle graceful shutdowns */
const shutdown: NodeJS.SignalsListener = async (signal) => {
	console.log(`🏁 TERMINATING (${signal})`);
	try {
		await global.prisma?.$disconnect();
	} catch (e) {}
	server.close(() => {
		console.log("ℹ️ TERMINATED! Exiting...");
		process.kill(process.pid, signal);
	});
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
