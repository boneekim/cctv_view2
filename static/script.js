
document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (location) {
        fetch(`/api/cctv?location=${encodeURIComponent(location)}`)
            .then(response => {
                if (!response.ok) {
                    // If the server response is not OK, parse the error JSON
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
                } else if (data.message) {
                    resultsDiv.innerHTML = `<p>${data.message}</p>`;
                } else if (data.cctv && data.cctv.length > 0) {
                    data.cctv.forEach(cctv => {
                        const cctvItem = document.createElement('div');
                        cctvItem.className = 'cctv-item';
                        cctvItem.innerHTML = `
                            <h3>${cctv.cctvname}</h3>
                            <p><a href="${cctv.cctvurl}" target="_blank">View CCTV</a></p>
                        `;
                        resultsDiv.appendChild(cctvItem);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No CCTV found nearby.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            });
    }
});
