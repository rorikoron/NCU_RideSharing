/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819111526")

  // update collection data
  unmarshal({
    "name": "ProposeParticipant"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819111526")

  // update collection data
  unmarshal({
    "name": "ProposeParticipants"
  }, collection)

  return app.save(collection)
})
