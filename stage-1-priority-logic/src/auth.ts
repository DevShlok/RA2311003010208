export async function getAuthToken(): Promise<string | null> {
    const data = {
        email: 'shloki69rwu@srmist.edu.in',
        name: 'shlok',
        rollNo: 'RA2311003010208',
        accessCode: 'QkbpxH',
        clientID: '454418d7-5cea-4e14-9253-b7e5ffcd717a',
        clientSecret: 'GsxrjNWkUsqRkfuw'
    };
    try {
        const response = await fetch('http://20.207.122.201/evaluation-service/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            return null;
        }
        const authData = await response.json();
        return authData.access_token;
    } catch (error) {
        console.error("Failed to authenticate.", error);
        return null;
    }
}
