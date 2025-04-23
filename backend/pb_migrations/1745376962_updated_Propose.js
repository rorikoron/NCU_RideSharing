/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_592516817",
    "hidden": false,
    "id": "relation701925182",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "offer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // remove field
  collection.fields.removeById("relation701925182")

  return app.save(collection)
})
