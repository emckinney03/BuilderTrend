function loadFilter(array) {
    dmAPI.loadCollectionsAPI().then(api => {
        api.data("Brookfield Custom Homes")      
        .get()
        .then(json => {
            let img_list = document.getElementById("img_list");
            img_list.innerHTML = "";
            for (let object of json.values)
            {
                let check = new Boolean(true);

                for (let filter of array)
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
                    for (let filter of array)
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

dmAPI.loadCollectionsAPI().then(api => {
    api.data("Filter")
    .get()
    .then(json => 
    {
        let form = document.getElementById("filter-homes");
        for (let object of json.values) 
        {
            if (object.data.FilterType == "DropDown")
            {
                let filterName = object.data.FilterName;
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
            }
            else if (object.data.FilterType == "CheckBox")
            {
                if (object.data.Use == 1)
                {
                    let filterName = object.data.FilterName;
                    
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

let filterArrays = [];
let pageCount = 0;

window.addEventListener("popstate", function(event) {
    console.log(pageCount + ", this is the pageCount before loading.");
    console.log(event);
    if (pageCount > 0) { // back button
        pageCount--;
        const filterArray = filterArrays[pageCount - 1];
        if (pageCount == 0) {
            document.getElementById("filter-homes").reset();
            let img_list = document.getElementById("img_list");
            img_list.innerHTML = "";
            window.history.pushState({state: 'back'},'', (window.location.origin + window.location.pathname));
            pageCount = 0;
        } else {
            loadFilter(filterArray);
        }
    }
})

document.getElementById("FilterBtn").onclick = function() {
    const filterArray = [];
    //console.log(pageCount);
    let urlFilterParams = new URLSearchParams(window.location.search); // create new object based on current URL

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
                        let selectedValue = document.getElementById(selectId).value;
                        selectedValues.push(selectedValue);
                        if (selectedValue != "-1") {
                            urlFilterParams.set(filterName, selectedValue);
                        } else {
                            urlFilterParams.delete(filterName);
                        }
                    }
                    else
                    {
                        selectedValues.push(-1);
                    }
                    selectedValues.push(filterShow);
                    
                    filterArray.push(selectedValues);
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
            //console.log(filterArray);
            filterArrays.push(filterArray)
            pageCount++;
            loadFilter(filterArray);
            let stateObj = {state: 'back'};
            let newURL = window.location.origin + window.location.pathname + '?' + urlFilterParams.toString(); // create new URL
            window.history.pushState(stateObj, '', newURL); // push new URL to browser history
        })
    })
}

document.getElementById("ResetBtn").onclick = function () {
    document.getElementById("filter-homes").reset();
    let img_list = document.getElementById("img_list");
    img_list.innerHTML = "";
    window.history.pushState({state: 'back'},'', (window.location.origin + window.location.pathname));
}
