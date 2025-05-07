/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool921107375",
    "name": "is_commision",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool921107375",
    "name": "commision",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
