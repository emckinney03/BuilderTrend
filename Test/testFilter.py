import unittest
import time
from selenium import webdriver
from selenium.webdriver.support.select import Select


class FilterTest(unittest.TestCase):
    expectedStatusOptions = ['status', 'For Sale', 'For Rent', 'Under Construction', 'Sold', 'Pending']
    numCardBody = 25

    def setUp(self):
        self.driver = webdriver.Chrome(executable_path='/Users/vyvo/Documents/UNO/SPRING 2023/CSCI 4970/BuilderTrend/Test/chromedriver')


    def test_filterTagOptions(self):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://uno-demo-brkfld-custom-homes-emckinney.sitebuilder.buildertrend.com")
        time.sleep(2)
        driver.find_element_by_link_text("Filter-work").click()
        time.sleep(5)

        selectElement = Select(driver.find_element_by_id("status-select"))
        options = selectElement.options
        i = 0
        for option in options:
            self.assertEqual(option.text, self.expectedStatusOptions[i], "Options under Status filter are incorrect")
            i += 1


    def test_cardBodyList(self):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://uno-demo-brkfld-custom-homes-emckinney.sitebuilder.buildertrend.com")
        time.sleep(2)
        driver.find_element_by_link_text("Filter-work").click()
        time.sleep(5)

        pages = driver.find_elements_by_xpath('//*[@id="pagination-numbers"]/button')
        currentCardBody = 0
        for i in range(len(pages)):
            cards = driver.find_elements_by_class_name('card_body')
            time.sleep(2)
            currentCardBody += len(cards)
            if i < len(pages):
                driver.find_element_by_id('next-button').click()

        self.assertEquals(currentCardBody, self.numCardBody, 'The total number of houses listed initially are not equal')


    def test_DropDown(self):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://uno-demo-brkfld-custom-homes-emckinney.sitebuilder.buildertrend.com")
        time.sleep(2)
        driver.find_element_by_link_text("Filter-work").click()
        time.sleep(5)

        selectElement = Select(driver.find_element_by_id("status-select"))
        selectElement.select_by_visible_text('For Sale')
        time.sleep(2)
        selectElement = Select(driver.find_element_by_id("Min Price-select"))
        selectElement.select_by_visible_text('$100,000')
        time.sleep(2)
        selectElement = Select(driver.find_element_by_id("Min Size-select"))
        selectElement.select_by_visible_text('1000 ft')
        time.sleep(2)

        driver.find_element_by_id('FilterBtn').click()
        time.sleep(5)
        pages = driver.find_elements_by_xpath('//*[@id="pagination-numbers"]/button')
        currentCardBody = 0
        for i in range(len(pages)):
            cards = driver.find_elements_by_class_name('card_body')
            currentCardBody += len(cards)
            if i < len(pages):
                driver.find_element_by_id('next-button').click()

        self.assertEquals(currentCardBody, 4, 'The result from the Drop Down is incorrect')

    def test_SearchBox(self):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://uno-demo-brkfld-custom-homes-emckinney.sitebuilder.buildertrend.com")
        time.sleep(2)
        driver.find_element_by_link_text("Filter-work").click()
        time.sleep(5)

        driver.find_element_by_id('Searchsearchbox').send_keys('7306')
        driver.find_element_by_id('FilterBtn').click()
        time.sleep(5)

        pages = driver.find_elements_by_xpath('//*[@id="pagination-numbers"]/button')
        currentCardBody = 0
        for i in range(len(pages)):
            cards = driver.find_elements_by_class_name('card_body')
            currentCardBody += len(cards)
            if i < len(pages):
                driver.find_element_by_id('next-button').click()

        self.assertEquals(currentCardBody, 8, 'The result from the Search Box is incorrect')


    def test_ResetButton(self):
        driver = self.driver
        driver.maximize_window()
        driver.get("http://uno-demo-brkfld-custom-homes-emckinney.sitebuilder.buildertrend.com")
        time.sleep(2)
        driver.find_element_by_link_text("Filter-work").click()
        time.sleep(5)

        driver.find_element_by_id('Searchsearchbox').send_keys('test')
        driver.find_element_by_id('FilterBtn').click()
        time.sleep(5)
        driver.find_element_by_id('ResetBtn').click()
        time.sleep(3)
        searchKey = driver.find_element_by_id('Searchsearchbox').get_attribute('value')
        self.assertEquals(searchKey, '', 'Reset button functionality is incorrect')


    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()