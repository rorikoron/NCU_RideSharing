/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4043172148")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "bool1556434883",
    "name": "is_read",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4043172148")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "bool1556434883",
    "name": "is_received",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
