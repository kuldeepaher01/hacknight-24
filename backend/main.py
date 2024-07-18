from sentinelhub import SHConfig, SentinelHubStatistical, BBox, Geometry, DataCollection, CRS
import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import matplotlib

# Credentials
config = SHConfig()
config.sh_client_id = '56e09ce1-f626-4ea8-a63d-ce7d0f684961'
config.sh_client_secret = 'PYgpFQkzUFQpQgRt3cAEpXeWa21SDsLR'

evalscript = """
//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "B02",
        "B04",
        "B08",
        "B11",
        "SCL",
        "CLM",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "ndvi",
        bands: ["NDVI"]
      },
      {
        id: "bsi",
        bands: ["BSI"]
      },
      {
        id: "dataMask",
        bands: 1
      }]
  }
}

function evaluatePixel(samples) {
    let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
    let bsi = ((samples.B11 + samples.B04)-(samples.B08 + samples.B02))/((samples.B11 + samples.B04)+(samples.B08 + samples.B02));
     
    var validNDVIMask = 1
    if (samples.B08 + samples.B04 + samples.B11 + samples.B02 == 0 ){
        validNDVIMask = 0
    }
    
    var noWaterMask = 1
    if (samples.SCL == 6 ){
        noWaterMask = 0
    }

    return {
        ndvi: [ndvi],
        bsi: [bsi],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [samples.dataMask * validNDVIMask * noWaterMask]
    }
}
"""

# bbox = BBox(bbox=[74.174071, 19.3193956, 74.1751117, 19.3204736], crs=CRS.WGS84)
geometry = Geometry(geometry={"type":"Polygon","coordinates":[[[74.1742212,19.3195019],[74.1742212,19.319512],[74.1745752,19.3197955],[74.1747147,19.3199321],[74.1747791,19.3197752],[74.1746825,19.3196537],[74.1748595,19.3193956],[74.1751117,19.3194665],[74.1750365,19.3198815],[74.1749614,19.3200485],[74.1749293,19.3202459],[74.174822,19.3204331],[74.1746718,19.3204736],[74.1745591,19.3204129],[74.1744304,19.3202509],[74.1744035,19.3201092],[74.1742963,19.3199068],[74.1740924,19.319927],[74.174071,19.3196791],[74.1742212,19.3195019]]]}, crs=CRS.WGS84)

request = SentinelHubStatistical(
    aggregation=SentinelHubStatistical.aggregation(
        evalscript=evalscript,
        time_interval=('2023-07-12T00:00:00Z', '2024-07-17T23:59:59Z'),
        aggregation_interval='P1M',
        size=[537.101, 589.55],        
    ),
    input_data=[
        SentinelHubStatistical.input_data(
            DataCollection.SENTINEL2_L2A,                        
      ),
    ],
    # bbox=bbox,
    geometry=geometry,
    config=config
)

response = request.get_data()
# save response to a file
# response.save_data("output.json")
# response is a list of objects/dictionary rem
print(response)
print("--------------------------------------------------------")
response = response[0]
# save response to a json file
with open('output.json', 'w+') as f:
    json.dump(response, f, indent=4)


#  read output.json file
data = None

with open('output.json', 'r') as f:
    data = json.load(f)

sh_statistics = data
date = []
Mean = []
Min = []
Max = []
# Find ndvi values
for data_item in sh_statistics['data']:
    for band, value in data_item['outputs']['ndvi']['bands'].items(): 
        Mean.append(value ['stats']['mean'])            # Find mean values and append them to the mean array  
        Max.append(value ['stats']['max'])              # Find max values and append them to the max array                                  
        Min.append(value ['stats']['min'])              # Find min values and append them to the min array

# Find "date to" for each ndvi entry
for data_item in sh_statistics['data']:
    for band in data_item['outputs']['ndvi']['bands'].items():  # For each band found
        date.append(data_item['interval']['to'])                # Find and append "date to" values to the date array
        date[:] = (elem[:10] for elem in date)                  # Limit each date string to the first 10 characters to keep a readable date format
        
# Print out the data arrays
print (date)
print (Mean)
print (Max)
print (Min)
elements = {
    'Date': date,
    'Mean': Mean,
    'Max' : Max,
    'Min' : Min,
}

table = pd.DataFrame(elements)
print (table)


matplotlib.rcParams.update({'font.size': 16})
factor = 1000000

fig, ax = plt.subplots()
fig.set_size_inches(20,8)
ax.ticklabel_format(style='plain')
# plt.style.use('seaborn-whitegrid')

x = table['Date']
y1 = table['Max']
y4 = table['Min']

line1 = table.plot(color='#4d6600', alpha=0.3, kind='line',x='Date',y='Max',ax=ax, label='Maximum NDVI', linewidth=6)
line2 = table.plot(color='#739900', kind='line',x='Date',y='Mean',ax=ax, label='Mean NDVI', linewidth=6, marker='o', markersize=15)
line3 = table.plot(color='#99cc00', alpha = 0.3, kind='line',x='Date',y='Min',ax=ax, label='Minimum NDVI', linewidth=6)

plt.fill_between(x, y1, y4, color='#99cc00', alpha=0.1)


plt.xlabel('Date')
plt.ylabel('NDVI value')
plt.title('NDVI')
plt.legend(loc='best', bbox_to_anchor=(0.5, 0.2, 0.45, 0.2), shadow=True, prop={'size': 18})

plt.savefig('ndvi-mix-1.png')

