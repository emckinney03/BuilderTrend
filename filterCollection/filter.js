/**
 * Description
 * @returns {any}
 */
dmAPI.loadCollectionsAPI().then(api => {
    api.data("Filter")
    .get()
    .then(json => 
    {
        let form = document.getElementById("filter-homes");
        for (let object of json.values) 
        {
            let filterName = object.data.FilterName;
            if (object.data.FilterType == "DropDown")
            {
                
                if (object.data.Use == 1)
                {
                    let select = document.createElement("select");
                    select.name = filterName + "select";
                    select.id = filterName + "-select";
                    
                    select.options.add(new Option(filterName, -1));
                    
                    let filterValues = object.data.FilterValues;
                    var valueList = filterValues.split(',');
                    
                    let filterDisplay = object.data.FilterDisplay;
                    var displayList = filterDisplay.split(';');
                    
                    for (let i = 0; i < displayList.length; i++) 
                    {
                        select.options.add(new Option(displayList[i], valueList[i]));
                    }
                    
                    form.appendChild(select);
                }
            }
            else if (object.data.FilterType == "SearchBox")
            {
                let div = document.createElement("div");
                let input = document.createElement("input");
                input.id = filterName + "searchbox";
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "Search...");
                
                div.appendChild(input);
                form.appendChild(div);
            }
            else if (object.data.FilterType == "CheckBox")
            {
                if (object.data.Use == 1)
                {
                    let div = document.createElement("div");
                    let input = document.createElement("input");
                    input.id = filterName + "checkbox";
                    input.setAttribute("type", "checkbox");
                    input.name = filterName + "Post";
                    
                    let labelInside = document.createElement("label");
                    labelInside.innerHTML += filterName;
                    labelInside.setAttribute("for", filterName + "checkbox");
                    
                    div.appendChild(input);
                    div.appendChild(labelInside);
                    
                    form.appendChild(div);
                }
            }
        }
    })
})


    
/**
 * Description
 * @param {any} "FilterBtn"
 * @returns {any}
 */
document.getElementById("FilterBtn").onclick = function () {
    const filterArray = [];
    
    dmAPI.loadCollectionsAPI().then(api => {
        api.data("Filter")
        .get()
        .then(json => {
            for (let object of json.values) 
            {
                let filterName = object.data.FilterName;
                    
                if (object.data.FilterType == "DropDown")
                {
                    const selectedValues = [];
                    let filterComparison = object.data.Comparison;
                    let filterShow = object.data.Show;
                    let selectId = filterName + "-select";
                    
                    selectedValues.push(object.data.FilterType);
                    selectedValues.push(filterName);
                    selectedValues.push(filterComparison);
                    if (object.data.Use == 1)
                    {
                        selectedValues.push(document.getElementById(selectId).value);
                    }
                    else
                    {
                        selectedValues.push(-1);
                    }
                    selectedValues.push(filterShow);
                    
                    filterArray.push(selectedValues);
                }
                else if (object.data.FilterType == "SearchBox")
                {
                    let userInput = document.getElementById(filterName + "searchbox").value;
                    let searchValue = [];
                    searchValue.push(object.data.FilterType);
                    searchValue.push(userInput);
                    filterArray.push(searchValue);
                }
                else if (object.data.FilterType == "CheckBox")
                {
                    let checkboxId = filterName + "checkbox";
                    let checkedValues = [];
                    checkedValues.push(object.data.FilterType);
                    checkedValues.push(filterName);
                    checkedValues.push(document.getElementById(checkboxId).checked);
                    checkedValues.push(object.data.Show);
                    filterArray.push(checkedValues);
                }
            }
        })
    })
    
    dmAPI.loadCollectionsAPI().then(api => {
            api.data("Brookfield Custom Homes")      
            .get()
            .then(json => {
                let img_list = document.getElementById("img_list");
                img_list.innerHTML = "";
                for (let object of json.values)
                {
                    let check = new Boolean(true);

                    for (let filter of filterArray)
                    {
                        if (filter[0] == "DropDown")
                        {
                            //ignore filters with no selected value
                            if (filter[3] == -1)
                            {
                                continue;
                            }
                            
                            if (filter[2] == "EQ")
                            {
                                if (object.data[filter[1]] != filter[3])
                                {
                                    check = Boolean(false);
                                    break; 
                                }
                            }
                            else if (filter[2] == "GTE")
                            {
                                if (object.data[filter[1]] < filter[3])
                                {
                                    check = Boolean(false);
                                    break; 
                                }
                            }
                        }
                        else if (filter[0] == "SearchBox")
                        {
                            searchKey = filter[1]
                            if (searchKey != "")
                            {
                                check = Boolean(false)
                                let keys = Object.keys(object.data)
                                for (let key of keys)
                                {
                                    // let value = object.data[key]
                                    // let value2 = value.toLowerCase()
                                    // console.log(value2)
                                    if (String(object.data[key]).toLowerCase().includes(String(searchKey).toLowerCase()))
                                    {
                                        check = Boolean(true)
                                        break
                                    }
                                }
                                if (check == Boolean(false))
                                {
                                    break;
                                }
                            }
                        }
                        else if (filter[0] == "CheckBox")
                        {
                            if (filter[2] == Boolean(true) && object.data[filter[1]] == Boolean(false))
                            {
                                check = Boolean(false);
                                break;
                            }
                        }
                    }
                    if (check == Boolean(true))
                    {
                        for (let filter of filterArray)
                        {
                            if (filter[0] == "DropDown")
                            {
                                //check if info needs to be displayed in result
                                if (filter[4] == 1) 
                                {
                                    
                                    if (filter[1].includes("image") == Boolean(true))
                                    {
                                        let imgsrc = object.data[filter[1]];
                                        console.log(imgsrc);
                                        img_list.innerHTML += "<img src=\"" + imgsrc + "\" alt=\"\" width=\"200px\" height=\"200px\">";
                                    }
                                    else
                                    {
                                        let text = filter[1] + ": " + object.data[filter[1]];
                                        img_list.innerHTML += "<div>" + text + "</div>";
                                    }
                                    //
                                    //img_list.innerHTML += "<img src=\"" + imgSrc + "\" alt=\"\" width=\"200px\" height=\"200px\">";
                                }
                            }
                            else if (filter[0] == "CheckBox")
                            {
                                //check if info needs to be displayed in result
                                if (filter[3] == 1)
                                {
                                    let text = filter[1] + ": Yes";
                                    img_list.innerHTML += "<div>" + text + "</div>";
                                }
                            }
                        }
                    }
                }
            })
    })
}

document.getElementById("ResetBtn").onclick = function () {
    document.getElementById("filter-homes").reset();
    //Empty out image list
    let img_list = document.getElementById("img_list");
    img_list.innerHTML = "";
}

// function parseList(list, htmlstring) {
    
//     // let option = document.createElement("otion");
//     // select.name = "test";
//     // select.id = "test-select";
//     let i = 1;
//     for (let x of list) {
//         // if (x.option == undefined) {
//         //     break; //prevents empty option from showing in filter
//         // }
//         htmlstring += "<option value=\"" + i + "\">" + x + "</option>";
//         i = i+1;
//     }
//     return htmlstring;
// }
// function parseList(list, form) {
    
//     let select = document.createElement("select");
//     select.name = "test";
//     select.id = "test-select";
    
//     for (let x of list) {
//         if (x.option == undefined) {
//             break; //prevents empty option from showing in filter
//         }
//         let i = -1;
//         select.options.add(new Option(x.option, i));
//     }
//     form.appendChild(select);
//     console.log("Done");
// }
