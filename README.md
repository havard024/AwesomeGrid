AwesomeGrid
===========

Awesome grid is a fully configurable crud app.

Features
---------

* Load remote or local data
* Choose which columns to display in create, read and update.
* Mark a column in the create/update as searchable.
* Full feedback of all crud events on success or failure.
* Awesome animations for filtering, events and forms.

Future Features
---------------
* Specify urls for delete/create/update to update the database.
* Different form fields: select, checkbox.
* Use a html template to style form fields.
* Form validation.
* Local or remote pagination.

Checkout the current demo page: http://havard024.github.io/AwesomeGrid

Configuration
=============

Define a factory with the following name in your application:  

angular.module('YourApp', []).factory('configFactory', function() { ... });

The factory should look like this:  

factory = {  
  columns : {...} ,  
  data    : {  
      local : [...],
      remote : "url"
}  

For local/remote, only one is needed.  

The columns object is where you configure your data columns:  

config = [{  
  id     : "...",  
  label  : "...",  
  search : true/false,  
  create : { ... },  
  read   : { ... },  
  update : { ... }  
}, {  
    ... same as above ...  
}];  

id     - Id of a column in your data. For the configuration of this column to take effect, the id must match a column id in the data rows.  
label  - Column header.
search - Mark as searchable in both update/create (If you only want to make a column searchable in update or create, you can do that in the create/update object, more info below).
create - Mark as visible in the create form.
read   - Mark as visible in the table.
update - Mark as visible in the update form.

read has no configuration options at the moment.

create and update has the following configuration options:  
create/update : {  
  search : true/false  
}

search - Marks a column searchable in either create or update form (If you want the column to be seachable in both forms, do that with the previous search option)

The rows of the supplied data should match the following structure:

Each row has a multiple key/value pairs.
A key is a column id, for that column to be visible, the column id must match a column id in the columns configuration object described above. (Remember to also add a read/update/create object in the some columns configuration object)
The value should also be a key value pair:  
{  
  "value" : "VALUE OF ROW"  
}  


[{   
  
  // ROW 1  
    
  "column 1" : {  
    value : "..."  
  },  
  
  "column 2" : {  
    ...  
  },  
  
  // Rest of columns ...    
}, {  
  
  // ROW 2  
    ...  
}]  








  
  




