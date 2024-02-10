const fetchWithTimeout = (url: string, params: RequestInit, timeout: number): Promise<any> => {
    return Promise.race([
        fetch(url, params),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('FETCH TIMEOUT')), timeout)
        ),
    ]);
};

export default fetchWithTimeout;