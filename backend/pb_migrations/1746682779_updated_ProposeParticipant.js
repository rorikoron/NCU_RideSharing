/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819111526")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool3022985745",
    "name": "is_proposer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819111526")

  // remove field
  collection.fields.removeById("bool3022985745")

  return app.save(collection)
})
