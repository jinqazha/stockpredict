from flask import Flask, render_template, request, jsonify
import pandas as pd
import yfinance as yf
from prophet import Prophet

app = Flask(__name__)

def forecast_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="10y")

        if data.empty:
            return {"error": "Invalid stock ticker or insufficient data."}

        df = data.reset_index()[["Date", "Close"]]
        df.columns = ["ds", "y"]
        df['ds'] = df['ds'].dt.tz_localize(None)

        model = Prophet(yearly_seasonality=True, daily_seasonality=False, weekly_seasonality=True)
        model.fit(df)

        future_dates = model.make_future_dataframe(periods=365)
        forecast = model.predict(future_dates)

        last_price = df["y"].iloc[-1]
        predicted_price = forecast["yhat"].iloc[-1]

        return {
            "last_price": last_price,
            "predicted_price": predicted_price,
            "percentage_change": (predicted_price - last_price) / last_price * 100
        }
    except Exception as e:
        return {"error": str(e)}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/forecast', methods=['POST'])
def get_forecast():
    data = request.get_json()
    ticker = data.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    forecast_data = forecast_stock(ticker)
    return jsonify(forecast_data)

if __name__ == '__main__':
    app.run(debug=True)