This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Fraunces](https://fonts.google.com/specimen/Fraunces) for display and body text and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for kickers and labels.

## Contact form

The contact form posts to `app/api/contact/route.ts`, which validates the submission and either sends via Resend (if configured) or returns a composed `mailto` link plus the message body. The client then offers copy-to-clipboard and mailto fallbacks, so the form never silently fails when no mail client is installed.

Copy `.env.example` to `.env.local` and fill in the values to enable server-side email delivery:

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=hello@persidian.com
CONTACT_FROM_EMAIL="Persidian <hello@persidian.com>"
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

The site deploys to a VPS (nuncio-vultr) behind a Coolify-managed Traefik network. `deploy.sh` SSHes into the host, resets the repo to `origin/main`, and rebuilds with Docker Compose:

```bash
./deploy.sh          # git pull on VPS + rebuild
./deploy.sh build    # rebuild only, no pull
```

Configuration lives in `docker-compose.vps.yml`; the container is served at persidian.com and www.persidian.com.
