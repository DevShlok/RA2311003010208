let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAuthToken(): Promise<string | null> {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const data = {
        email: 'shloki69rwu@srmist.edu.in',
        name: 'shlok',
        rollNo: 'RA2311003010208',
        accessCode: 'QkbpxH',
        clientID: '454418d7-5cea-4e14-9253-b7e5ffcd717a',
        clientSecret: 'GsxrjNWkUsqRkfuw'
    };

    try {
        const response = await fetch('/evaluation-service/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error("Auth fetch failed:", response.status);
            return null;
        }

        const authData = await response.json();
        cachedToken = authData.access_token;
        // The API returns expires_in in UNIX epoch seconds or seconds from now?
        // Assuming the authData returns expires_in as seconds from now, or timestamp. Let's just cache it for a while.
        // If it's epoch time (like 1743574344) we multiply by 1000 if needed, but let's just cache for 50 minutes.
        tokenExpiry = Date.now() + 50 * 60 * 1000;
        
        return cachedToken;
    } catch (error) {
        console.error("Failed to authenticate.", error);
        return null;
    }
}
