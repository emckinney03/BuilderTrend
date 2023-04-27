
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
                            select.options.add(new Option(displayList[i]), valueList[i]);
                        }
                        
                        form.appendChild(select);
                    }
                }
                else if (object.data.FilterType == "SearchBox")
                {
                    
                }
                else if (object.data.FilterType == "CheckBox")
                {
                    
                }
            }
        })
    })
    
document.getElementById("FilterBtn").onclick = function () {
    const filterArray = [];
    //console.log(window.location.search);
    let urlParams = new URLSearchParams(window.location.search); // create new object based on current URL
    
    dmAPI.loadCollectionsAPI().then(api => {
        api.data("Filter")
        .get()
        .then(json => {
            for (let object of json.values) {
                const selectedValues = [];
                
                let filterName = object.data.FilterName;
                let filterComparison = object.data.Comparison;
                let filterShow = object.data.Show;
                let selectId = filterName + "-select";
                
                selectedValues.push(filterName);
                selectedValues.push(filterComparison);
                if (object.data.Use == 1)
                {
                    let selectedValue = document.getElementById(selectId).value;
                    selectedValues.push(selectedValue);
                    urlParams.set(filterName, selectedValue); // actually sets the parameters gained
                }
                else
                {
                    selectedValues.push(-1);
                }
                selectedValues.push(filterShow);
                
                filterArray.push(selectedValues);
            }
            let newURL = window.location.origin + window.location.pathname + '?' + urlParams.toString(); // create new URL
            console.log(newURL);
            window.history.pushState(null, '', newURL); // push new URL to browser history
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
                        //ignore filters with no selected value
                        if (filter[2] == -1)
                        {
                            continue;
                        }
                        
                        if (filter[1] == "EQ")
                        {
                            if (object.data[filter[0]] != filter[2])
                            {
                                check = Boolean(false);
                                break; 
                            }
                        }
                        else if (filter[1] == "GTE")
                        {
                            if (object.data[filter[0]] < filter[2])
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
                            //check if info needs to be displayed in result
                            if (filter[3] == 1) 
                            {
                                
                                if (filter[0].includes("image") == Boolean(true))
                                {
                                    let imgsrc = object.data[filter[0]];
                                    img_list.innerHTML += "<img src=\"" + imgsrc + "\" alt=\"\" width=\"200px\" height=\"200px\">";
                                }
                                else
                                {
                                    let text = filter[0] + ": " + object.data[filter[0]];
                                     img_list.innerHTML += "<div>" + text + "</div>";
                                }
                                //
                                //img_list.innerHTML += "<img src=\"" + imgSrc + "\" alt=\"\" width=\"200px\" height=\"200px\">";
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
