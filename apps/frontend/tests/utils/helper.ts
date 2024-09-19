export const waitForResponse = async (page, operationName, actionCallback) => {
    const [response] = await Promise.all([
        page.waitForResponse((response) => {
            const request = response.request();
            if (request) {
                const postData = request.postData();
                if (postData && postData.includes(operationName)) {
                    return response.url().includes("/graphql") && response.status() === 200;
                }
            }
            return false;
        }),
        actionCallback(),
    ]);

    const request = response.request();
    const postData = request?.postData();

    if (postData) {
        try {
            const parsedData = JSON.parse(postData);
            return parsedData;
        } catch (error) {
            return null;
        }
    }
    return null;
};
