from flask import Flask, jsonify
# import request from flask as req
from flask import request as req
from flask_cors import CORS
from flask_cors import cross_origin
from sentinelhub import SHConfig, SentinelHubStatistical, BBox, Geometry, DataCollection, CRS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your existing configuration and variables here
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

@app.route('/getveg', methods=['POST'])
@cross_origin()
def get_veg():
    # Extract data from the request
    # data = request.json()
    print(req.get_json())

    # Extract coordinates, time interval, and bbox from the request data
    coordinates = req.json.get('coordinates')  # Expected to be a list of coordinate pairs
    time_interval = req.json.get('timeInterval')
    print("Coordinates: ", coordinates, "time:", time_interval)

    # Convert coordinates to a Polygon geometry
    if coordinates:
        # check if first and last coordinates are the same if not add the first one to the end
        if coordinates[0] != coordinates[-1]:
            coordinates.append(coordinates[0])
        polygon_coordinates = coordinates
        print("Polygon coordinates: ", polygon_coordinates)
        
        geometry = Geometry(geometry={'type': 'Polygon', 'coordinates': [polygon_coordinates]}, crs=CRS.WGS84)
    else:   
        geometry = None  # Or handle the case when no coordinates are provided

    # Initialize the SentinelHub request
    request = SentinelHubStatistical(
        aggregation=SentinelHubStatistical.aggregation(
            evalscript=evalscript,
            time_interval=time_interval,
            aggregation_interval='P1M',
            size=[537.101, 589.55],
        ),
        input_data=[
            SentinelHubStatistical.input_data(DataCollection.SENTINEL2_L2A),
        ],
        geometry=geometry,
        config=config
    )

    # Fetch the data
    response = request.get_data()

    # Process the response as needed
    processed_response = process_response(response)  # Implement this function based on your needs

    # Return the processed response as JSON
    return jsonify(processed_response), 200

# Function to classify NDVI score
def classify_ndvi_score(ndvi_mean):
    if ndvi_mean > 0.7:
        return "very good vegetation"
    elif ndvi_mean >= 0.5:
        return "good vegetation"
    elif ndvi_mean >= 0.3:
        return "medium vegetation"
    else:
        return "low to average vegetation"

# Function to classify BSI score
def classify_bsi_score(bsi_mean):
    if bsi_mean > 0:
        return "bare soil"
    else:
        return "vegetated soil"
# a function that will give me vegetation index of the land latest, 
# Function to detect recent vegetation cycles
def detect_recent_vegetation_cycle(ndvi_analysis, max_allowed_other_vegetations=5):
    recent_cycle = []
    other_vegetation_count = 0

    for entry in ndvi_analysis:
        if entry['ndvi_score'] == 'low to average vegetation':
            if recent_cycle and other_vegetation_count <= max_allowed_other_vegetations:
                recent_cycle.append(entry)
                other_vegetation_count = 0  # Reset the count after finding the cycle end
            else:
                recent_cycle = [entry]
                other_vegetation_count = 0
        else:
            if recent_cycle:
                other_vegetation_count += 1
                if other_vegetation_count > max_allowed_other_vegetations:
                    recent_cycle = []  # Reset the cycle if max allowed other vegetations exceeded
            else:
                other_vegetation_count = 0
          

    return bool(recent_cycle)

def process_response(response):
    
  # Initialize lists to store analysis results
  ndvi_analysis = []
  bsi_analysis = []

  # Extract NDVI and BSI data and perform analysis
#   print(response)
#   print(response[0]['data'],type(response[0]['data']))
  intervals = response[0]['data']
  previous_ndvi_mean = None
  previous_bsi_mean = None

  for interval in intervals:
      ndvi_stats = interval['outputs']['ndvi']['bands']['NDVI']['stats']
      bsi_stats = interval['outputs']['bsi']['bands']['BSI']['stats']

      ndvi_mean = ndvi_stats['mean']
      bsi_mean = bsi_stats['mean']

      # NDVI analysis
      ndvi_score = classify_ndvi_score(ndvi_mean)
      if previous_ndvi_mean is not None:
          ndvi_trend = "Increased" if ndvi_mean > previous_ndvi_mean else "Decreased"
      else:
          ndvi_trend = "N/A"
      ndvi_analysis.append({
          "interval": interval['interval']['from'],
          "mean_ndvi": ndvi_mean,
          "ndvi_score": ndvi_score,
          "ndvi_trend": ndvi_trend
      })
      print(ndvi_analysis)
      print(type(ndvi_analysis))

      # BSI analysis
      bsi_score = classify_bsi_score(bsi_mean)
      if previous_bsi_mean is not None:
          bsi_trend = "Increased" if bsi_mean > previous_bsi_mean else "Decreased"
      else:
          bsi_trend = "N/A"
      bsi_analysis.append({
          "interval": interval['interval']['from'],
          "mean_bsi": bsi_mean,
          "bsi_score": bsi_score,
          "bsi_trend": bsi_trend
      })

      previous_ndvi_mean = ndvi_mean
      previous_bsi_mean = bsi_mean

  # Store the analysis results in a dictionary
  output_dict = {
      "ndvi_analysis": ndvi_analysis,
      "bsi_analysis": bsi_analysis
  }
  recent_veg  = detect_recent_vegetation_cycle(ndvi_analysis,4)
#   latest
  analysis_report = [recent_veg, ndvi_analysis[-1]]
    # Example processing - adjust according to your needs
  return {"vegetationData": response, "processedData": output_dict,  "analysisReport": analysis_report}  # Simplified example



@app.route('/get_712', methods=['POST'])
@cross_origin()
def get_712():
    # Extract data from the request
    data = req.get_json()

    # Extract details from the request data
    coordinates = data.get('coordinates')
    survey_number = data.get('survey_number')
    owner_details = data.get('owner_details')

    # Print the extracted data for debugging purposes
    print("Coordinates:", coordinates)
    print("Survey Number:", survey_number)
    print("Owner Details:", owner_details)

    # Prepare the response
    response = {
        'coordinates': coordinates,
        'survey_number': survey_number,
        'owner_details': owner_details,
        'area_of_land': 2.45,
        'type_of_cultivation': 'bagayat',
        'water_source': 'well',
        'tax_information': 'bharla',
        'block_number': 'B-145'
    }

    # Check for missing fields and handle appropriately
    missing_fields = [key for key, value in response.items() if value is None]
    if missing_fields:
        return jsonify({
            'status': 'failure',
            'message': f'Missing or invalid fields: {", ".join(missing_fields)}',
            'data': response
        }), 400

    return jsonify({
        'status': 'success',
        'data': response
    })


if __name__ == '__main__':
    app.run(debug=True)
