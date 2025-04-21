/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_933145977")

  // update collection data
  unmarshal({
    "name": "Review"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_933145977")

  // update collection data
  unmarshal({
    "name": "Reviews"
  }, collection)

  return app.save(collection)
})
