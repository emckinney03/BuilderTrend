/*
*need to add units column to filter collection
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
                }
            }
        })
    })
    
document.getElementById("FilterBtn").onclick = function () {
    const filterArray = [];
    
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
                let units = object.data.Units;
                
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
                
                
                if (units == null) {
                    selectedValues.push("");
                }else {
                    selectedValues.push(units);
                }
                
                filterArray.push(selectedValues);
            }
        })
    })
    
                        
    dmAPI.loadCollectionsAPI().then(api => {
            api.data("Brookfield Custom Homes")      
            .get()
            .then(json => {
                let img_list = document.getElementById("img_list");
                img_list.innerHTML = "";
                let cardList = document.createElement("div");
                cardList.className = "card";
                img_list.appendChild(cardList);
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
                            filter[2] = Number(filter[2]);
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
                                let cardBody = createCard(filterArray, object);
                                cardList.appendChild(cardBody);
                                
                                let test_object = {
                                    Name: filter[0],
                                    d: object.data[filter[0]]
                                }
                                console.log(test_object);
                                break;
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

function createCard(filterArray, object) {
    let card = document.createElement("div");
    card.className = "card_body";
    
    imageTag = "<img src=\"" + object.data.background_image + "\" alt=\"\">";
    textTag = "<div id=\"card_text\">" + object.data.Address + ", " + object.data.ZIP + "<br>";
    
    for (let x of filterArray) {
        if (x[3] == 1) {
            if (x[4] != "Price") {
                textTag += object.data[x[0]] + "  " + x[4] + " &middot; ";
            }else {
                textTag += "$" +object.data[x[0]];
            }
        }
    }
    
    textTag += "</div>";
    
    card.innerHTML += imageTag;
    card.innerHTML += textTag;
    return card;
}
