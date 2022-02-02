# Pluralsight GraphQL API Team Sync

This project is meant to simplify GraphQL calls required for synchronizing a team structure using GraphQL.

## Why

Pluralsight offers a rich GraphQL-basd platform to retrieve and modify several aspects of the platform. One of those aspects is user + team information.

I needed to "replicate" the org chart of my company, which is completely doable via GraphQL, but for something as simple as adding a member to a team, I needed first to retrieve UIDs for both entities prior to invoking the mutation. I needed a little bit of abstraction and modularity to make this a bit painless.

## How to run

1. Simply clone the repo.
2. Run `npm i`
3. Create an `.env` file in the `/config/` folder. There's a [README.md](/config/README.md) explaining what you need, or read below.
4. Run `npm start`
