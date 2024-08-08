const AWS = require("aws-sdk")
const lambda = new AWS.lambda()

exports.handler = async () => {
    const scraperFunctions = ["scrape-frontier"]
    try {
        const results = await Promise.all(
            scraperFunctions.map((functionName) =>
                invokeScraperLambda(functionName)
            )
        )
        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}

async function invokeScraperLambda(functionName) {
    const params = {
        FunctionName: functionName,
        InvocationType: "RequestResponse",
    }
    const response = await lambda.invoke(params).promise()
    return JSON.parse(response.payload)
}
