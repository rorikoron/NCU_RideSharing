/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_592516817")

  // remove field
  collection.fields.removeById("bool2561261446")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2973601975",
    "max": 0,
    "min": 0,
    "name": "appendix",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_592516817")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool2561261446",
    "name": "selected",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("text2973601975")

  return app.save(collection)
})
