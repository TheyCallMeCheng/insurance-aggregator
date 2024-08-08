import fs from "fs"
import cheerio from "cheerio"
import fetch from "fetch"

async function submitForm() {
    const url = "https://www.frontierassicurazioni.it/funnel/02"
    const secondFormData = new URLSearchParams()
    secondFormData.append("indice", "1")
    secondFormData.append("page_return", "/funnel/01")
    secondFormData.append("id_nazione", "126")
    secondFormData.append("data_partenza", "2024-08-30")
    secondFormData.append("data_rientro", "2024-09-20")
    secondFormData.append("assicurati_fasce[0_1]", "")
    secondFormData.append("assicurati_fasce[2_17]", "")
    secondFormData.append("assicurati_fasce[18_64]", "1")
    secondFormData.append("assicurati_fasce[65_74]", "")
    secondFormData.append("tariffa_famiglia", "")
    secondFormData.append("id_nazione", "126")
    console.log(secondFormData)
    try {
        const response = await fetch(url, {
            method: "POST",
            body: secondFormData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })

        if (response.ok) {
            const result = await response.text()
            fs.writeFileSync("response.html", result, "utf8")

            console.log("Form submitted successfully:", result)
            return result
        } else {
            console.error(
                "Form submission failed:",
                response.status,
                response.statusText
            )
        }
    } catch (error) {
        console.error("Error submitting form:", error)
    }
}

function extractData(page) {
    const $ = cheerio.load(page)
    const price = $(".price").text()
    console.log("price:", price)
    const pricesArray = price.replace(/€/gm, "").trim().split(" ")
    console.log(pricesArray)
    return pricesArray
}

async function runScraper() {
    const page = await submitForm()
    return extractData(page)
}

// runScraper()
exports.handler = async (event) => {
    try {
        const result = await runScraper()
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
