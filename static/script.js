
document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetch(`/api/cctv?location=${encodeURIComponent(location)}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = ''; // Clear previous results

                if (data.error) {
                    resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
                } else if (data.message) {
                    results.innerHTML = `<p>${data.message}</p>`;
                }else if (data.cctv && data.cctv.length > 0) {
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
                document.getElementById('results').innerHTML = '<p>An error occurred while fetching data.</p>';
            });
    }
});
