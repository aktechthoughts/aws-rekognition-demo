import base64
import boto3
from flask import Flask, render_template, request,make_response
import json


app = Flask(__name__)

def aws_boto3_client():
    client = boto3.client('rekognition')

@app.route("/")
def home():
    return render_template("image.html")

@app.route("/findage")
def age():
    return render_template("agefinder.html")


@app.route('/saveFile', methods=['POST']) 
def upload_base64_file(): 
    data = request.get_json()
    #print(data)
    if data is None:
        print("No valid request body, json missing!")
        return json.dumps({'success':False}), 200, {'ContentType':'application/json'} 
    else:
        b64_string = data['img']
        # this method convert and save the base64 string to image
        #print(b64_string)
        res = convert_and_save(b64_string)
        return json.dumps({'success':True,'result': res}), 200, {'ContentType':'application/json'} 

def convert_and_save(imagestring):

    with open("tmp/capture.base64", "w") as fh:
        fh.write(imagestring)

    with open("tmp/capture.png", "wb") as fh:
        fh.write(base64.decodebytes(imagestring.encode()))

    response=detect_labels_local_file("tmp/capture.png")
    return response['Labels'][0]['Name']

def detect_labels_local_file(photo):
    client=boto3.client('rekognition')
   
    with open(photo, 'rb') as image:
        response = client.detect_labels(Image={'Bytes': image.read()})
        
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

    