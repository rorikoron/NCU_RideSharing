/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_592516817")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2561261446",
    "name": "selected",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_592516817")

  // remove field
  collection.fields.removeById("bool2561261446")

  return app.save(collection)
})
