/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_933145977")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2358664717",
    "hidden": false,
    "id": "relation1039323232",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "propose",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_933145977")

  // remove field
  collection.fields.removeById("relation1039323232")

  return app.save(collection)
})
