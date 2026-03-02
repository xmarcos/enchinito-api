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

## Development

Local development is powered by Docker.

```bash
docker compose up
```

→ <http://localhost:8787>

> [Conventional Commits](https://www.conventionalcommits.org/en/about/) are enforced using a hook but there is no `prepare-commit-msg` _wizard_. You can do `npm run commit` if you need that.

## Deploy

→ <https://enchinito-api.xmarcos.workers.dev/>

```bash
# Using Docker
CLOUDFLARE_API_TOKEN=your_token_here docker compose run --rm app wrangler deploy

# Or using native wrangler
wrangler deploy

# tail prod logs
wrangler tail
```

## But why?

<img src="images/why-not.gif" />
