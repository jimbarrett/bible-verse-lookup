This is a small app that I created in order to try out NextJS. 

You can look up bible verses and click through to next/previous verse. The database is the sqlite db that I got from [scrollmapper's repo](https://github.com/scrollmapper/bible_databases). It's a great resource and I've used their mysql db on other projects.

### A few things I may add later...
* Add support for mysql db in addition to sqlite. Not sure why aside from it may be cool to have options.
* Right now I'm only doing lookups on the King James version. I hope to add another selector so you can choose your version.
* Add a 'related verses' lookup. We have a cross_references table in the db that should make this pretty straight forward.
* If I get really bored I may restyle it but probably not.

You can run it just like any other NextJS app...

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and you're all set.

### Update: 09/28/23
I've added jest and written the first few unit tests for this. I'm mostly only doing this to keep the habit alive.

### Update: 10/24/23
I've finally gotten back to this and added the ability to compare different versions of the bible side by side. Also did a lot of code cleanup and minor restyling (buttons, etc)
