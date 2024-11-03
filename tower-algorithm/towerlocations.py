import json
import pandas as pd
import geopandas as gpd
import random
from shapely.geometry import Point


with open('istanbul-districts.json', encoding='utf-8') as f:
    districts_data = json.load(f)

output_df = pd.read_csv('output.csv')
gdf = gpd.GeoDataFrame.from_features(districts_data['features'])

locations = []

for index, row in output_df.iterrows():
    district_name = row['District']
    tower_count = int(row['Towers Inside'])
    
    district_geom = gdf[gdf['name'] == district_name]['geometry'].values[0]
    
    if district_geom is not None and tower_count > 0:
        min_x, min_y, max_x, max_y = district_geom.bounds
        
        for _ in range(tower_count):
            while True:
                random_lat = random.uniform(min_y, max_y)
                random_lon = random.uniform(min_x, max_x)
                point = Point(random_lon, random_lat)
                
                if district_geom.contains(point):
                    locations.append({
                        "District": district_name,
                        "Latitude": random_lat,
                        "Longitude": random_lon
                    })
                    break 

output_file_path = '../communication-tower-app/public/tower_locations.json'
with open(output_file_path, 'w', encoding='utf-8') as outfile:
    json.dump(locations, outfile, indent=4, ensure_ascii=False)

print(f"Generated {len(locations)} locations in tower_locations.json in communication-tower-app/public.")
