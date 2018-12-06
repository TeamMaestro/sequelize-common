# sequelize-common
A common set of models and functions that we use throughout most of our Sequelize projects

## Installation
```
npm i @teamhive/sequelize-common
```

## Peer Dependencies
There are a few peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```
npm i sequelize sequelize-typescript
```

## Dev Dependencies
There are also dev dependencies that you may want to add in order for typescript to compile correctly:

```
npm i --save-dev @types/sequelize
```

### Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_