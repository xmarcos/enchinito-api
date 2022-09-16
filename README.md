# enchinito API

A useless API for [@xmarcos/enchinito](https://github.com/xmarcos/enchinito) using [Cloudflare Workers](https://workers.cloudflare.com/).

## Usage

```bash
curl -s "https://enchinito-api.xmarcos.workers.dev/enchinito/Sudo%20make%20me%20a%20sandwich" | jq .
# {
#   "input": "Sudo make me a sandwich",
#   "output": "Sidi miki mi i sindwich",
#   "version": "0.1.0"
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
#   <version>0.1.0</version>
# </data>
```

## Setup

```bash
# needs node v16+
npm install -g wrangler
npm install
```

## Development

→ <http://0.0.0.0:8787>

```bash
wrangler dev
# 🤞
```

## Deploy

→ <https://enchinito-api.xmarcos.workers.dev/>

```bash
wrangler publish
# tail prod logs
wrangler tail
```

## But why?

<img src="images/why-not.gif" />
