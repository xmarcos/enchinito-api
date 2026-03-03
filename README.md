# enchinito API

A useless API for [@xmarcos/enchinito](https://github.com/xmarcos/enchinito) using [Cloudflare Workers](https://workers.cloudflare.com/).

## Usage

```bash
curl -s "https://enchinito-api.xmarcos.workers.dev/enchinito/Sudo%20make%20me%20a%20sandwich" | jq .
# {
#   "input": "Sudo make me a sandwich",
#   "output": "Sidi miki mi i sindwich",
#   "version": "2.1.0"
# }
```

You can also get the response in `text/plain` or `application/xml`.

```bash
# pipe-friendly text
curl -s "https://enchinito-api.xmarcos.workers.dev/enchinito/Sudo%20make%20me%20a%20sandwich" -H "Accept: text/plain" | rev
# hciwdnis i im ikim idiS

# verbose xml, if you are into that
# brew install python-yq
curl -s "https://enchinito-api.xmarcos.workers.dev/enchinito/Sudo%20make%20me%20a%20sandwich" -H "Accept: application/xml" | xq
# <data>
#   <input>Sudo make me a sandwich</input>
#   <output>Sidi miki mi i sindwich</output>
#   <version>2.1.0</version>
# </data>
```

## Local Development

All development tasks are powered by Docker to ensure environment parity.

### Start Development Server
```bash
docker compose up
```
→ <http://localhost:8787>

### Run Tests
```bash
docker compose run --rm app npm test
```

### Deploy
```bash
CLOUDFLARE_API_TOKEN=your_token_here docker compose run --rm app npx wrangler deploy
```

### Tail Production Logs
```bash
docker compose run --rm app npx wrangler tail
```

---

> [Conventional Commits](https://www.conventionalcommits.org/en/about/) are enforced using a hook. You can run `docker compose run --rm app npm run commit` if you need a wizard.

## But why?

<img src="images/why-not.gif" />
