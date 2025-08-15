import requests
import pandas as pd
import time
import json
from datetime import datetime
import os

class AirQualityDataCollector:
    def __init__(self):
        self.api_keys = {
            'openweather': os.getenv('OPENWEATHER_API_KEY', ''),
            'airvisual': os.getenv('AIRVISUAL_API_KEY', ''),
            'airnow': os.getenv('AIRNOW_API_KEY', '')
        }
        self.data_file = 'AQI-and-Lat-Long-of-Countries.csv'
        self.new_data_file = 'real_time_air_quality.csv'
        
    def get_openweather_data(self, lat, lng):
        """Collect data from OpenWeatherMap Air Pollution API"""
        if not self.api_keys['openweather']:
            return None
            
        try:
            url = f"http://api.openweathermap.org/data/2.5/air_pollution"
            params = {
                'lat': lat,
                'lon': lng,
                'appid': self.api_keys['openweather']
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                components = data['list'][0]['components']
                
                return {
                    'co': components.get('co', 0),
                    'no2': components.get('no2', 0),
                    'o3': components.get('o3', 0),
                    'pm2_5': components.get('pm2_5', 0),
                    'aqi': data['list'][0]['main']['aqi']
                }
        except Exception as e:
            print(f"Error fetching OpenWeather data: {e}")
        return None
    
    def get_airvisual_data(self, lat, lng):
        """Collect data from AirVisual API"""
        if not self.api_keys['airvisual']:
            return None
            
        try:
            url = f"http://api.airvisual.com/v2/nearest_city"
            params = {
                'lat': lat,
                'lon': lng,
                'key': self.api_keys['airvisual']
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                current = data['data']['current']
                
                return {
                    'co': current['pollution'].get('co', 0),
                    'no2': current['pollution'].get('no2', 0),
                    'o3': current['pollution'].get('o3', 0),
                    'pm2_5': current['pollution'].get('pm25', 0),
                    'aqi': current['pollution'].get('aqius', 0)
                }
        except Exception as e:
            print(f"Error fetching AirVisual data: {e}")
        return None
    
    def convert_to_aqi_values(self, data):
        """Convert raw pollutant values to AQI values"""
        # Simplified conversion - in practice, you'd use EPA standards
        return {
            'CO AQI Value': min(data['co'] * 10, 500),
            'Ozone AQI Value': min(data['o3'] * 2, 500),
            'NO2 AQI Value': min(data['no2'] * 5, 500),
            'PM2.5 AQI Value': min(data['pm2_5'] * 2, 500),
            'AQI Value': data['aqi']
        }
    
    def collect_data_for_location(self, lat, lng, location_name=""):
        """Collect air quality data for a specific location"""
        print(f"Collecting data for {location_name or f'({lat}, {lng})'}...")
        
        # Try different APIs
        data = None
        if self.api_keys['openweather']:
            data = self.get_openweather_data(lat, lng)
        elif self.api_keys['airvisual']:
            data = self.get_airvisual_data(lat, lng)
        
        if data:
            aqi_data = self.convert_to_aqi_values(data)
            return {
                'AQI Value': aqi_data['AQI Value'],
                'CO AQI Value': aqi_data['CO AQI Value'],
                'Ozone AQI Value': aqi_data['Ozone AQI Value'],
                'NO2 AQI Value': aqi_data['NO2 AQI Value'],
                'PM2.5 AQI Value': aqi_data['PM2.5 AQI Value'],
                'lat': lat,
                'lng': lng,
                'timestamp': datetime.now().isoformat(),
                'source': 'real_time'
            }
        
        return None
    
    def collect_data_for_multiple_locations(self, locations):
        """Collect data for multiple locations"""
        collected_data = []
        
        for location in locations:
            data = self.collect_data_for_location(
                location['lat'], 
                location['lng'], 
                location.get('name', '')
            )
            if data:
                collected_data.append(data)
            time.sleep(1)  # Rate limiting 
        
        return collected_data
    
    def update_training_dataset(self, new_data):
        """Add new data to the training dataset"""
        try:
            # Load existing data
            if os.path.exists(self.data_file):
                existing_df = pd.read_csv(self.data_file)
            else:
                existing_df = pd.DataFrame()
            
            # Convert new data to DataFrame
            new_df = pd.DataFrame(new_data)
            
            # Combine datasets
            combined_df = pd.concat([existing_df, new_df], ignore_index=True)
            
            # Remove duplicates based on lat/lng
            combined_df = combined_df.drop_duplicates(subset=['lat', 'lng'], keep='last')
            
            # Save updated dataset
            combined_df.to_csv(self.data_file, index=False)
            print(f"Updated dataset with {len(new_data)} new records")
            
            return True
        except Exception as e:
            print(f"Error updating dataset: {e}")
            return False
    
    def save_real_time_data(self, data):
        """Save real-time data to separate file"""
        try:
            df = pd.DataFrame(data)
            df.to_csv(self.new_data_file, index=False)
            print(f"Saved {len(data)} real-time records to {self.new_data_file}")
            return True
        except Exception as e:
            print(f"Error saving real-time data: {e}")
            return False

# Example usage
if __name__ == "__main__":
    collector = AirQualityDataCollector()
    
    # Example locations (major cities)
    locations = [
        {'lat': 40.7128, 'lng': -74.0060, 'name': 'New York'},
        {'lat': 51.5074, 'lng': -0.1278, 'name': 'London'},
        {'lat': 48.8566, 'lng': 2.3522, 'name': 'Paris'},
        {'lat': 35.6762, 'lng': 139.6503, 'name': 'Tokyo'},
        {'lat': 39.9042, 'lng': 116.4074, 'name': 'Beijing'}
    ]
    
    print("Starting air quality data collection...")
    print("Note: Set API keys as environment variables for real data collection")
    print("OPENWEATHER_API_KEY, AIRVISUAL_API_KEY, AIRNOW_API_KEY")
    
    # Collect data
    new_data = collector.collect_data_for_multiple_locations(locations)
    
    if new_data:
        # Save real-time data
        collector.save_real_time_data(new_data)
        
        # Update training dataset (optional)
        # collector.update_training_dataset(new_data)
        
        print(f"Successfully collected data for {len(new_data)} locations")
    else:
        print("No data collected. Check API keys and network connection.")
