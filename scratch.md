I've read through the `AGENTS.md` file and understand that this specific installation of Next.js has some breaking changes, and the APIs, conventions, and file structure might be different. 

I've checked the root documentation at `node_modules/next/dist/docs/index.md` as requested. 

The most important takeaway for me as an AI agent is this comment hidden in the markdown:

```javascript
{/* AI agent hint: If fixing slow client-side navigations, Suspense alone is not enough. You must also export `unstable_instant` from the route. Read docs/01-app/02-guides/instant-navigation.mdx before making changes. */}
```

I will make sure to consult the guides located in `node_modules/next/dist/docs/` whenever working on this project. 

Let me know what we are working on next!
