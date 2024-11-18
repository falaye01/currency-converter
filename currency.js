const countriesUrl = 'https://restcountries.com/v3.1/all';
const currencyApiUrl = 'https://api.currencyapi.com/v3/latest?apikey=cur_live_yQZPKaPdRZPP0jOPWGLoG9uta7MMSEOsk4eXEQlM';

let countryCurrencyMap = {};

async function populateCountryDropdowns() {
    try {
        const fromCountryDropdown = document.getElementById("fromCountry");
        const toCountryDropdown = document.getElementById("toCountry");

        const response = await fetch(countriesUrl);
        const data = await response.json();

        data.forEach(country => {
            const countryName = country.name.common;
            const currencyCode = Object.keys(country.currencies)[0];

    
            countryCurrencyMap[countryName] = currencyCode;

            // Populate dropdowns
            const optionFrom = document.createElement("option");
            optionFrom.value = countryName;
            optionFrom.textContent = countryName;
            fromCountryDropdown.appendChild(optionFrom);

            const optionTo = document.createElement("option");
            optionTo.value = countryName;
            optionTo.textContent = countryName;
            toCountryDropdown.appendChild(optionTo);
        });

        // Set default values after the dropdowns are populated
        fromCountryDropdown.value = "Nigeria";
        toCountryDropdown.value = "Canada";

    } catch (error) {
        console.error("Error fetching country names:", error);
    }
}

populateCountryDropdowns();

async function getRate() {
    try {
        const response = await fetch(currencyApiUrl);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Unsuccessful response:", error);
    }
}

let convertCurrency = async () => {
    const amount = document.getElementById("amount").value;
    const fromCountry = document.getElementById("fromCountry").value;
    const toCountry = document.getElementById("toCountry").value;

    const fromCurrency = countryCurrencyMap[fromCountry];
    const toCurrency = countryCurrencyMap[toCountry];

    if (!fromCurrency || !toCurrency) {
        console.error("Currency not found");
        return;
    }

    if (amount.length != 0) {
        try {
            const rates = await getRate();
            let exchangeFrom = rates[fromCurrency]?.value;
            let exchangeTo = rates[toCurrency]?.value;

            if (exchangeFrom && exchangeTo) {
                const convertedRate = (amount / exchangeFrom) * exchangeTo;
                const result = document.getElementById("get");
                result.innerHTML = `${amount} ${fromCurrency} = ${convertedRate.toFixed(2)} ${toCurrency}`;
            } else {
                console.error("Currency not found in API response");
            }
        } catch (error) {
            console.error("Error converting currency:", error);
        }
    } else {
        alert("Please fill in the amount");
    }
};

document.getElementById("submit").addEventListener("click", convertCurrency);
