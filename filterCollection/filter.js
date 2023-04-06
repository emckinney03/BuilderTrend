
dmAPI.loadCollectionsAPI().then(api => {
    api.data("Filter")
    .get()
    .then(json => {
        // let filter_list = document.getElementById("filter-homes");
        // filter_list.innerHTML = "";
        let form = document.getElementById("filter-homes");
        for (let object of json.values) {
            let filterName = object.data.FilterName;
            
            let select = document.createElement("select");
            select.name = filterName + "select";
            select.id = filterName + "-select";
            
            // filter_list += "<select name=\"" + filterName + "\" id=\"" + filterName + "-select\"><option value=\"-1\">" + filterName + "</option>";
            let i = -1;
            select.options.add(new Option(filterName, i));
            
            let filterValues = object.data.FilterValues;
            var valueList = filterValues.split(',');
            
            for (var value of valueList) {
                i = i + 1;
                select.options.add(new Option(value, i));
            }
            
            form.appendChild(select);
            // filter_list = parseList(valueList, filter_list);
            // filter_list += "</select>";
            // console.log(filter_list);
        }
    })
})

document.getElementById("FilterBtn").onclick = function () {

// dmAPI.loadCollectionsAPI().then(api => {
//     api.data("Brookfield Custom Homes")
//     .get()
//     .then(json => {
        
//         // let filter_list = document.getElementById("filter-homes");
//         // //need to reset the image list for subsequent button clicks
//         // filter_list.innerHTML = "";
//         // for (let object of json.values) {
//         //     for (let object2 of object.data) {
//         //         console.log(object2);
//         //     }
//         // }
//         console.log(json.values[0].data.Address);
//     }
//     )
// })  

}
document.getElementById("ResetBtn").onclick = function () {
    document.getElementById("filter-homes").reset();
    //Empty out image list
    let img_list = document.getElementById("img_list");
    img_list.innerHTML = "";
}

function parseList(list, htmlstring) {

// let option = document.createElement("otion");
// select.name = "test";
// select.id = "test-select";
let i = 1;
for (let x of list) {
    // if (x.option == undefined) {
    //     break; //prevents empty option from showing in filter
    // }
    htmlstring += "<option value=\"" + i + "\">" + x + "</option>";
    i = i+1;
}
return htmlstring;
}
function parseList(list, form) {

let select = document.createElement("select");
select.name = "test";
select.id = "test-select";

for (let x of list) {
    if (x.option == undefined) {
        break; //prevents empty option from showing in filter
    }
    let i = -1;
    select.options.add(new Option(x.option, i));
    }
    form.appendChild(select);
    console.log("Done");
}