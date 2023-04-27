/** Filter Pagination */
//From a filter collection
const filterArray = [];
//From the dataset collection - grabbed once
const originalCollection = [];
//A subset of the original collection based on filters
let currentCollection = [];

//pagination stuff
const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("img_list");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

nextButton.classList.add("hidden");
prevButton.classList.add("hidden");

let paginationLimit; //items per page
let pageCount; //total number of pages
let currentPage; //current active page

const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    paginationNumbers.appendChild(pageNumber);
};

//adding pages 0..n to tag based on number of items / pagination limit
const getPaginationNumbers = () => {
    paginationLimit = Number(data.config.paginationLimit);
    pageCount = Math.ceil(currentCollection.length / paginationLimit);
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};

//showing items on current page
const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    
    handleActivePageNumber();
    handlePageButtonsStatus();
  
    //range of number of items to show
    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;
    
    //only load a subset of the current database
    let img_list = document.getElementById("img_list");
    img_list.innerHTML = "";
    let cardList = document.createElement("div");
    cardList.className = "card";
    let numOfRows = "";
    //3 item per row
    for (let i=0; i<(paginationLimit / 3); i++) {
        numOfRows += "21em ";
    }
    cardList.style.gridTemplateRows = numOfRows;
    for (let object of currentCollection) {
        if (object.index >= prevRange && object.index < currRange) {
            let card_body = createCard(filterArray, object.contents);
            cardList.append(card_body);
        }
    }
    img_list.appendChild(cardList);
};

const handleActivePageNumber = () => {
    
    //make the current page active
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("active");
        }
    });
};

//adding functionality to arrow buttons
prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
});

nextButton.addEventListener("click", () => {
  setCurrentPage(currentPage + 1);
});

//makes the < or > buttons non-functional
const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

//makes the < or > buttons functional
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

//check wether a < or > click is appropriate
const handlePageButtonsStatus = () => {
    if (currentPage == 1) {
        disableButton(prevButton);
    }else {
        enableButton(prevButton);
    }
    if (pageCount == currentPage) {
        disableButton(nextButton);
    }else {
        enableButton(nextButton);
    }
};

dmAPI.loadCollectionsAPI().then(api => {
    api.data(data.config.filterCollection)
    .get()
    .then(json => 
    {
        let form = document.getElementById("filter-homes");
        //Creates and displays filter options for user selection
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
            
            //populate filterArray
            let units = object.data.Units;
            if (units == null) {
                units = "";
            }
            
            //the filter collection needs to have the following columns for widget to work
            //some fields like comparison for rows that aren't a comparator needs a n/a
            let selectedValues = {
                name: object.data.FilterName,
                comparison: object.data.Comparison,
                selectValue: -1,
                show: object.data.Show,
                use: object.data.Use,
                unit: units
            };
            
            filterArray.push(selectedValues);
        }
        
        getCollection();
    })
})
    
document.getElementById("FilterBtn").onclick = function () {
    
    for (let filter of filterArray) {
        //live site = undefined but editor = 'n/a"
        if (filter.use != 0 && filter.comparison != "n/a") {
            filter.selectValue = document.getElementById(filter.name + "-select").value;
        }
    }
    
    if (currentCollection.length == 0) {
        currentCollection = formNewCollection(originalCollection);
    }else {
        currentCollection = formNewCollection(currentCollection);
    }
    
    //clears page numbers
    paginationNumbers.innerHTML = "";
    //starts pagination
    getPaginationNumbers();
    setCurrentPage(1);
    
    nextButton.classList.remove("hidden");
    prevButton.classList.remove("hidden");
    
    //when the user clicks on a page number it will turn to a new page
    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
            button.addEventListener("click", () => {
                setCurrentPage(pageIndex);
            });
        }
    });
}

document.getElementById("ResetBtn").onclick = function () {
    document.getElementById("filter-homes").reset();
    //Empty out image list
    let img_list = document.getElementById("img_list");
    img_list.innerHTML = "";
    //Empty out pages
    paginationNumbers.innerHTML = "";
    nextButton.classList.add("hidden");
    prevButton.classList.add("hidden");
    //Reset current collection
    currentCollection = [];
}

function getCollection() {
    dmAPI.loadCollectionsAPI().then(api => {
        api.data(data.config.dataCollection)      
        .get()
        .then(json => {
            let i = 0;
            for (let object of json.values) {
                let newEntry = {
                    index: i,
                    contents: object.data
                }
                i++;
                originalCollection.push(newEntry);
            }
        })
    })
}

function filter_v1(entry, newIndex) {
    let check = true;
    for (let filter of filterArray)
    {
        //ignore filters with no selected value
        if (filter.selectValue == -1)
        {
            continue;
        }
        
        let databaseValue = entry.contents[filter.name];
        let userSelectedValue = filter.selectValue;
        //Only == and >= for now
        if (filter.comparison == "EQ")
        {
            if (databaseValue != userSelectedValue)
            {
                check = false;
            }
        }
        else if (filter.comparison == "GTE")
        {
            // = Number(y);
            if (databaseValue < userSelectedValue)
            {
                check = false;
            }
        }
    }
    if (check == true)
    {
        newIndex++;
        entry.index = newIndex;
        return entry;
    }
    let index = newIndex;
    return {check, index};
}

function formNewCollection(sourceCollection) {
    let currentIndex = -1;
    let newCollection = [];
    for (let object of sourceCollection) {
        for (let filter of filterArray) {
            //show value
            if (filter.show == 1) {
                let value = filter_v1(object, currentIndex);
                currentIndex = value.index;
                //filter it
                if (value.check != false) {
                    newCollection.push(value);
                }
                break;
            }
        }
    }
    return newCollection;
}
function createCard(filterArray, entry) {
    let card = document.createElement("div");
    card.className = "card_body";
    
    imageTag = "<img src=\"" + entry.background_image + "\" alt=\"\">";
    textTag = "<div id=\"card_text\">" + entry.Address + ", " + entry.ZIP + "<br>";
    
    for (let filter of filterArray) {
        if (filter.show == 1) {
            if (filter.unit != "Price") {
                textTag += entry[filter.name] + "  " + filter.unit + " &middot; ";
            }else {
                textTag += "$" + entry[filter.name];
            }
        }
    }
    
    textTag += "</div>";
    
    card.innerHTML += imageTag;
    card.innerHTML += textTag;
    return card;
}
