/** Filter Pagination */
//From a filter collection
const filterArray = [];
//From the dataset collection - grabbed once
/**
 * Original collection set kept in memory
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {{}}
 */
const originalCollection = [];
//A subset of the original collection based on filters
/**
 * Current collection, subset of original collection
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {{}}
 */
let currentCollection = [];

// Number of back tracks avaiable
/**
 * The number of back tracks avaiable
 * @date 5/9/2023 - 7:42:33 PM
 * 
 * @type {{}}
 */
let filterCount = 0;

// Keeps track of all filter array contents for back tracking
/**
 * Keeps track of all filter arrays
 * @date 5/9/2023 - 7:42:33 PM
 * 
 * @type {{}}
 */
let filterArrays = [];

//pagination stuff
/**
 * html tag
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*} 
 */
const paginationNumbers = document.getElementById("pagination-numbers");
/**
 * html tag
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
const paginatedList = document.getElementById("img_list");
/**
 * html tag
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
const nextButton = document.getElementById("next-button");
/**
 * html tag
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
const prevButton = document.getElementById("prev-button");

nextButton.classList.add("hidden");
prevButton.classList.add("hidden");

/**
 * Items to display per page
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
let paginationLimit; //items per page
/**
 * Total number of pages
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
let pageCount; //total number of pages
/**
 * The current active page
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @type {*}
 */
let currentPage; //current active page

/**
 * Adds pages to html
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} index A number
 */
const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    paginationNumbers.appendChild(pageNumber);
};

//adding pages 0..n to tag based on number of items / pagination limit
/**
 * Creates the list of page numbers
 * @date 5/3/2023 - 6:32:31 PM
 */
const getPaginationNumbers = () => {
    paginationLimit = Number(data.config.paginationLimit);
    pageCount = Math.ceil(currentCollection.length / paginationLimit);
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};

//showing items on current page
/**
 * Displays the current current and all necessary items
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} pageNum A number
 */
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

/**
 * Highlight the current active page
 * @date 5/3/2023 - 6:32:31 PM
 */
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
/**
 * Switch < or > to non-clickable
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} button A button tag
 */
const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

//makes the < or > buttons functional
/**
 * Switch < or > to non-clickable
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} button A button tag
 */
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

//check wether a < or > click is appropriate
/**
 * Determines wether a < or > click is appropriate
 * @date 5/3/2023 - 6:32:31 PM
 */
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
    
    let urlFilterParams = new URLSearchParams(window.location.search); //create new object based on current URL
    let clonedArray = JSON.parse(JSON.stringify(filterArray)); //needs a deep copy
    filterArrays.push(clonedArray);
    filterCount++;
    
    //update user input for each filter option
    for (let filter of filterArray) {
        if (filter.type == "dropdown") {
            filter.selectValue = document.getElementById(filter.name + "-select").value;
            
            if (filter.selectedValue != -1) {
                urlFilterParams.set(filter.name, filter.selectedValue);
            } else {
                urlFilterParams.delete(filter.name);
            }
            
        }else if (filter.type == "searchbox") {
            filter.userInput = document.getElementById(filter.name + "searchbox").value;
        }else if (filter.type == "checkbox") {
            filter.checked = document.getElementById(filter.name + "checkbox").checked;
        }
    }
    
    let stateObj = {state: 'back'};
    let newURL = window.location.origin + window.location.pathname + '?' + urlFilterParams.toString(); // create new URL
    window.history.pushState(stateObj, '', newURL); // push new URL to browser history
            
    updatePagination();
    
    //this is needed only when a user clicks the filter button after clicking the reset button
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

    window.history.pushState({state: 'back'},'', (window.location.origin + window.location.pathname));
}

/**
 * Loads initial collection
 * @date 5/3/2023 - 6:32:31 PM
 */
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

/**
 * Filter the entry
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} entry An object containing information from current collection
 * @param {*} newIndex
 * @returns {*} The entry if the current entry is valid or a tuple {false, newIndex} if its invalid
 */
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

/**
 * Forms a new collection after filtering the source collection
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} sourceCollection The original collection
 * @returns {{}} A new collection
 */
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
/**
 * Creates a html card to display an entry's information
 * @date 5/3/2023 - 6:32:31 PM
 *
 * @param {*} filterArray A array containing all the filter options
 * @param {*} entry A entry from the current collection
 * @returns A html tag
 */
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

window.addEventListener("popstate", function(event) {
    if (filterCount > 0) {
        filterCount--;
        //grab the previous filter array to display contents
        const previousFilterArray = filterArrays[filterCount];
        filterArray = previousFilterArray;
        if (filterCount == 0) {
            document.getElementById("filter-homes").reset();
            let img_list = document.getElementById("img_list");
            img_list.innerHTML = "";
            window.history.pushState({state: 'back'},'', (window.location.origin + window.location.pathname));
            pageCount = 0;
        } else {
            updatePagination();
        }
    }
})
