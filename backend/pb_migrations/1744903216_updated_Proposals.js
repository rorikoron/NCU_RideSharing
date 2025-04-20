/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // update collection data
  unmarshal({
    "name": "Propose"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // update collection data
  unmarshal({
    "name": "Proposals"
  }, collection)

  return app.save(collection)
})
