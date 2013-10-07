AwesomeGrid
===========

Awesome crud grid with angularjs!

Checkout the current demo page: http://havard024.github.io/AwesomeGrid

Directives
==========
* awesomeGridInline
* awesomeGridSimpleForm
* awesomeGrid
* 
awesomeGridInline
=================
Grid with inline update/create and full crud.

awesomeGridSimpleForm
=====================
Grid with forms for update/create, missing delete.

Configuration
=============
The following configuration description might be incomplete.  

Your data an awesomeGrid configurations needs to be placed in a factory called 'awesomeGridData'.  

The factory should return something like this:  
factory = {  
  config : { colums : ... },  
  rows : [...]  
}  

The row list is your data objects. Each object should be in the following format:  
rows = [{  
  "column1" : { value : "value1" },  
  "column2" : { value : "value2" }  
}, {  
  "column1" : { value : "value3" },  
  "column2" : { value : "value4" }  
}]  

The config object should have an object called columns with the following:  

colums = [{  
    id : "column1",  
    label : "columnHeader1"  
  }, {  
    id : "column2",  
    label : "columnHeader2"  
  }  
]  

The value of the id key should match one of the columns in a data object.  
The label is the name of the column.  

awesomeGrid
===========
Grid with forms for update/create, full crud. Also possible to undo deletes.
Event list which publishes each update/create/delete/undoDelete.
Animated grid, forms, events.

configuration
-------------

Structure same as the previous configurations.

Added new options to columns in the config object:  
columns = [{  
  id : ...,  
  label : ...,  
  read : {},  
  update : {},  
  create : {}  
}, {  
  ...  
}]  

Columns without read/create/update objects will be filtered out in the grid/updateForm/createForm.
