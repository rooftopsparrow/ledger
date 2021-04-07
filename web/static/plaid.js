async function createPlaidHandler() {
			
    const fetchLinkToken = async () => {
        const response = await fetch("/create_link_token", { 
            method: 'POST',
            credentials: "same-origin",
        });
        return await response.text()
    };
    
    const configs = {

        token: await fetchLinkToken(),
        onSuccess: async function(public_token, metadata) {

        await fetch('/get_access_token', {
            method: 'POST',
            body: JSON.stringify({ public_token: public_token }),
        });
        },
        onExit: async function(err, metadata) {

        if (err != null && err.error_code === 'INVALID_LINK_TOKEN') {
            linkHandler.destroy();
            linkHandler = Plaid.create({
            ...configs,
            token: await fetchLinkToken(),
            });
        }
        if (err != null) {

        }

        },
    };
    var linkHandler = Plaid.create(configs);
    linkHandler.open();
    }
    document.getElementById('link-button').onclick = function() {
        createPlaidHandler();
    };