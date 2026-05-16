var IGV = "tesat" ;//STATIC ID OF THE IG 
var spinner$ = apex.util.showSpinner(); // ADD SPINNER WAIT TILL PROCESS DONE CUZ THE PROCESS RUN IN BACKGROUD 
var grid = apex.region(IGV).widget().interactiveGrid("getViews", "grid"); // THE GRID
var model = grid.model;// MODEL , YOU CAN LOOP ON THIS TO LOOP ON ALL APPEAR ROWS
var changes = model.getChanges();//GET THE CHANGES ONLY TO AIM TO NEEDED DATA ONLY
var columns = grid.view$.grid("getColumns");// GET ALL IG COLUMN TO MAKE IT GENERAL ONLY
var data = [];
changes.forEach(function(chg){// LOOP ON CHANGED ROW (ADD"INSERT", UPDATE AND DELETE)
    var record = chg.record;
    var fields = chg.fields;
    var action = "U";//UPDATE
    if (chg.inserted) action = "I";//INSERT
    else if (chg.deleted) action = "D";//DELETE
        var row = {
            ACTION: action // ADD THE RESULT OF THE ACTION 
        };
        columns.forEach(function(col){ // LOOP ON ALL COLUMNS
            var colName = col.property || col.name;
            row[colName] = model.getValue(record, colName);//GET DATA OF COLUMN IN THE ROW
        });
        data.push(row);//LOAD THE ROW IN DATA 
});
// NOW WE HAVE JSON ON ALL CHANGES HAPPEN
var check;
apex.server.process(
    "SAVE_EMP", // CALL AJEX CALLBACK PROCESS
    {
        p_clob_01: JSON.stringify(data) // PARAMTER DATA JSON
    },
    {
        success: function(pData){
            if (pData.status == "success") {// LOOP EVERY SEC TO CHECK STATUS
                setTimeout(function(){
                    spinner$.remove();// REMOVE THE SPINNER THAT WE ADD IT
                    model.clearChanges();//CLEAR THE CHANGE OF IG
                    apex.region(IGV).refresh();// REFERSH THE IG TO GET UPDATED DATA
                }, 1000); // 1000 = 1 SEC
            }
             console.log(pData);
        },
        error: function(){
            spinner$.remove();// REMOVE THE SPINNER THAT WE ADD IT
        }
    }
);
