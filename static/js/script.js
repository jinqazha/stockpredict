document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('stock-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // 폼의 기본 동작을 막음

        const ticker = document.getElementById('ticker').value;
        const lastPriceEl = document.getElementById('last-price');
        const predictedPriceEl = document.getElementById('predicted-price');
        const percentageChangeEl = document.getElementById('percentage-change');
        const errorMessageEl = document.getElementById('error-message');

        // 결과 영역을 초기화
        lastPriceEl.textContent = '';
        predictedPriceEl.textContent = '';
        percentageChangeEl.textContent = '';
        errorMessageEl.textContent = '';

        try {
            const response = await fetch('/api/forecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticker }),
            });

            const data = await response.json();

            if (data.error) {
                errorMessageEl.textContent = `Error: ${data.error}`;
            } else {
                lastPriceEl.textContent = `현재 주가: ${data.last_price.toFixed(0)}`;
                predictedPriceEl.textContent = `1년 후 예측 주가: ${data.predicted_price.toFixed(0)}`;
                percentageChangeEl.textContent = `예상 변동률: ${data.percentage_change.toFixed(2)}%`;
            }
        } catch (error) {
            errorMessageEl.textContent = `Error: ${error.message}`;
        }
    });
});
