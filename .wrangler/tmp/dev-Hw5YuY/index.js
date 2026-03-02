(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // .wrangler/tmp/bundle-aVePIT/checked-fetch.js
  var urls = /* @__PURE__ */ new Set();
  function checkURL(request, init) {
    const url = request instanceof URL ? request : new URL(
      (typeof request === "string" ? new Request(request, init) : request).url
    );
    if (url.port && url.port !== "443" && url.protocol === "https:") {
      if (!urls.has(url.toString())) {
        urls.add(url.toString());
        console.warn(
          `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
        );
      }
    }
  }
  __name(checkURL, "checkURL");
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      const [request, init] = argArray;
      checkURL(request, init);
      return Reflect.apply(target, thisArg, argArray);
    }
  });

  // ../usr/local/lib/node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  __name(__facade_register__, "__facade_register__");
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  __name(__facade_registerInternal__, "__facade_registerInternal__");
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  __name(__facade_invokeChain__, "__facade_invokeChain__");
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }
  __name(__facade_invoke__, "__facade_invoke__");

  // ../usr/local/lib/node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  __name(__facade_isSpecialEvent__, "__facade_isSpecialEvent__");
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = /* @__PURE__ */ Symbol("__facade_waitUntil__");
  var __facade_response__ = /* @__PURE__ */ Symbol("__facade_response__");
  var __facade_dispatched__ = /* @__PURE__ */ Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class ___Facade_ExtendableEvent__ extends Event {
    static {
      __name(this, "__Facade_ExtendableEvent__");
    }
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof ___Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  var __Facade_FetchEvent__ = class ___Facade_FetchEvent__ extends __Facade_ExtendableEvent__ {
    static {
      __name(this, "__Facade_FetchEvent__");
    }
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof ___Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof ___Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  var __Facade_ScheduledEvent__ = class ___Facade_ScheduledEvent__ extends __Facade_ExtendableEvent__ {
    static {
      __name(this, "__Facade_ScheduledEvent__");
    }
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof ___Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = /* @__PURE__ */ __name(function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    }, "__facade_sw_dispatch__");
    const __facade_sw_fetch__ = /* @__PURE__ */ __name(function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    }, "__facade_sw_fetch__");
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // ../usr/local/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e2) {
        console.error("Failed to drain the unused request body.", e2);
      }
    }
  }, "drainBody");
  var middleware_ensure_req_body_drained_default = drainBody;

  // ../usr/local/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e2) {
    return {
      name: e2?.name,
      message: e2?.message ?? String(e2),
      stack: e2?.stack,
      cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
    };
  }
  __name(reduceError, "reduceError");
  var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e2) {
      const error = reduceError(e2);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  }, "jsonError");
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-aVePIT/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // node_modules/itty-router/index.mjs
  var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: /* @__PURE__ */ __name((o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r, "get") }), routes: t, ...o2, async fetch(e3, ...o3) {
    let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
    for (let [e4, t2] of n.searchParams) a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
    for (let [a2, c2, i2, l2] of t) if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = l2;
      for (let t2 of i2) if (null != (s2 = await t2(e3.proxy ?? e3, ...o3))) return s2;
    }
  } }), "e");
  var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
  var s = o("application/json; charset=utf-8", JSON.stringify);
  var c = o("text/plain; charset=utf-8", String);
  var i = o("text/html");
  var l = o("image/jpeg");
  var p = o("image/png");
  var d = o("image/webp");

  // node_modules/@xmarcos/enchinito/lib/esm/enchinito.js
  var charMap = {
    a: "i",
    // a
    \u00E0: "\xEC",
    // a grave
    \u00E1: "\xED",
    // a acute
    \u00E2: "\xEE",
    // a circumflex
    \u00E3: "\u0129",
    // a tilde
    \u00E4: "\xEF",
    // a umlaut
    e: "i",
    // e
    \u00E8: "\xEC",
    // e grave
    \u00E9: "\xED",
    // e acute
    \u00EA: "\xEE",
    // e circumflex
    \u00EB: "\xEF",
    // e umlaut
    i: "i",
    // i
    \u00EC: "\xEC",
    // i grave
    \u00ED: "\xED",
    // i acute
    \u00EE: "\xEE",
    // i circumflex
    \u00EF: "\xEF",
    // i umlaut
    o: "i",
    // o
    \u00F2: "\xEC",
    // o grave
    \u00F3: "\xED",
    // o acute
    \u00F4: "\xEE",
    // o circumflex
    \u00F5: "\u0129",
    // o tilde
    \u00F6: "\xEF",
    // o umlaut
    u: "i",
    // u
    \u00F9: "\xEC",
    // u grave
    \u00FA: "\xED",
    // u acute
    \u00FB: "\xEE",
    // u circumflex
    \u00FC: "\xEF"
    // u umlaut
  };
  var isUpper = /* @__PURE__ */ __name((char) => char.toUpperCase() === char, "isUpper");
  var enChinito = /* @__PURE__ */ __name((text) => {
    if (typeof text !== "string") {
      throw new TypeError(`text must be a string, got ${typeof text}`);
    }
    const re = new RegExp(`([${Object.keys(charMap).join("")}])`, "gi");
    return text.replace(
      re,
      (_, char) => isUpper(char) ? charMap[char.toLowerCase()].toUpperCase() : charMap[char]
    );
  }, "enChinito");
  var enchinito = enChinito;

  // package.json
  var package_default = {
    name: "enchinito-api",
    version: "2.0.0",
    author: "Marcos Sader <xmarcos@gmail.com>",
    homepage: "https://github.com/xmarcos/enchinito-api",
    private: true,
    scripts: {
      commit: "commit",
      prepare: "is-ci || husky install"
    },
    dependencies: {
      "@xmarcos/enchinito": "^0.4.2",
      "itty-router": "^4.2.2"
    },
    devDependencies: {
      "@cloudflare/workers-types": "^4.20240314.0",
      "@commitlint/cli": "^19.0.3",
      "@commitlint/config-conventional": "^19.1.0",
      "@commitlint/prompt-cli": "^19.0.3",
      "@semantic-release/changelog": "^6.0.3",
      "@semantic-release/git": "^10.0.1",
      husky: "^9.0.11",
      "is-ci": "^3.0.1",
      "semantic-release": "^23.0.2",
      wrangler: "^3.34.2"
    },
    engines: {
      node: ">=16"
    },
    release: {
      branches: [
        "main"
      ],
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        [
          "@semantic-release/npm",
          {
            npmPublish: false
          }
        ],
        "@semantic-release/git",
        "@semantic-release/github"
      ],
      tagFormat: "v${version}"
    }
  };

  // src/index.ts
  var router = e();
  var version = package_default.version;
  router.all("/enchinito/:input", (req, event) => {
    const { params } = req;
    const { headers } = event.request;
    const acceptHeader = headers.get("Accept")?.toLocaleLowerCase() || "";
    const input = decodeURIComponent(params?.input || "");
    const output = enchinito(input);
    if (acceptHeader === "text/plain") {
      return new Response(`${output}
`, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      });
    }
    if (acceptHeader === "application/xml") {
      const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <input>${input}</input>
  <output>${output}</output>
  <version>${version}</version>
</data>`;
      return new Response(xmlResponse, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8"
        }
      });
    }
    const jsonResponse = JSON.stringify({
      input,
      output,
      version
    });
    return new Response(jsonResponse, {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  });
  router.all("*", (req) => {
    const reqURL = new URL(req.url);
    if (reqURL.pathname === "/favicon.ico") {
      const favicon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>\u{1F440}</text></svg>`;
      const faviconResponse = new Response(favicon, {
        headers: { "content-type": "image/svg+xml" }
      });
      faviconResponse.headers.set("Cache-Control", "max-age=36000");
      return faviconResponse;
    }
    const body = JSON.stringify({
      goto: "/enchinito/:input",
      version
    });
    return new Response(body, {
      headers: { "Content-type": "application/json" }
    });
  });
  addEventListener("fetch", (event) => {
    event.respondWith(router.handle(event.request, event));
  });
})();
//# sourceMappingURL=index.js.map
