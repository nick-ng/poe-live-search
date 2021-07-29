# poe-live-search

Aggregate multiple Path of Exile live searches

# Steps

- Copy `.env.example` to `.env` and add any valid POESESSID (not necessarily your main account) and a valid USER_AGENT. You can change the port if necessary.

```
npm install
npm run build
npm start
```

- `searches.json` is created. Add/remove any searches you need. It should restart automatically.

- Go to http://localhost:9362
