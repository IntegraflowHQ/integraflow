export const waitForResponse = async (page, operationName, actionCallback) => {
    const [response] = await Promise.all([
        page.waitForResponse((response) => {
            const request = response.request();
            if (request) {
                const postData = request.postData();
                if (postData && postData.includes(operationName)) {
                    console.log("POSTDATAAAAAAAAAAAAAAAAAAAAAAAAA", postData);
                    return response.url().includes("/graphql") && response.status() === 200;
                }
            }
            return false;
        }),
        actionCallback(),
    ]);

    const request = response.request();
    const postData = request?.postData();
    console.log(postData);

    if (postData) {
        try {
            const parsedData = JSON.parse(postData);
            console.log("Parsed postData:", parsedData); // Log the parsed postData
            return parsedData;
        } catch (error) {
            console.error("Error parsing postData:", error);
            return null;
        }
    }
    return null;
};
// export const waitForResponse = async (page, operationName, actionCallback) => {
//     const [response] = await Promise.all([
//         page.waitForResponse((response) => {
//             const request = response.request();
//             console.log("Received a response, checking request..."); // Log when a response is received

//             if (request) {
//                 const postData = request.postData();
//                 console.log("Request postData:", postData); // Log the postData even if it's not the expected one

//                 if (postData && postData.includes(operationName)) {
//                     console.log(`Found matching operation: ${operationName}`); // Log if the operation name matches
//                     return response.url().includes("/graphql") && response.status() === 200;
//                 }
//             }
//             return false;
//         }),
//         actionCallback(), // Trigger the action that causes the response
//     ]);

//     if (!response) {
//         console.error("Response not found!"); // Log when no response is matched
//         return null;
//     }

//     console.log({ response }); // Log the response object

// const request = response.request();
// const postData = request?.postData();

// if (postData) {
//     try {
//         const parsedData = JSON.parse(postData);
//         console.log("Parsed postData:", parsedData); // Log the parsed postData
//         return parsedData;
//     } catch (error) {
//         console.error("Error parsing postData:", error);
//         return null;
//     }
// }

//     return null;
// };
