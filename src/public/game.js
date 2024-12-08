// Initialize your game here
window.addEventListener('load', () => {
    // Get query parameters from Telegram
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    const score = params.get('score');

    // Your game initialization code here
    console.log('!Game initialized for user:', userId);

    // Fetch and display stats
    function updateStats() {
        fetch('/api/stats')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update totals
                document.getElementById('total-plays').textContent = data.totals.total_plays || 0;
                document.getElementById('total-shares').textContent = data.totals.total_shares || 0;

                // Update table
                const tableBody = document.getElementById('stats-table');
                tableBody.innerHTML = data.stats.map(user => `
                    <tr>
                        <td>${user.user_id}</td>
                        <td>${user.play_clicks}</td>
                        <td>${user.share_clicks}</td>
                    </tr>
                `).join('');
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    // Update stats every 5 seconds
    updateStats();
    setInterval(updateStats, 5000);
});