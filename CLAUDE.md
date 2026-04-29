@AGENTS.md

# Project: almostdaily

A Hobonichi-style daily journaling web app. Each authenticated user has a journal composed of one page per calendar day.

## Core concepts

- **Home page:** Calendar view — clicking a day opens that day's journal page
- **Journal page:** Date-addressed (`/journal/[date]`), displays the date as header
- **Page content:** Rich text editor (Tiptap), drawing canvas (Fabric.js), media (images, videos, embedded links)
- **Auth:** Supabase Auth — all journal data is scoped to the authenticated user

## Data model

`journal_entries` table — keyed by `(user_id, date)`, one row per user per calendar day:

```sql
user_id uuid  -- references auth.users
date    date  -- the calendar day this entry belongs to
content jsonb -- Tiptap JSON
```

## Stack

- Next.js (App Router), Supabase, Tiptap, Fabric.js, Tailwind CSS + shadcn tokens, base-ui primitives
