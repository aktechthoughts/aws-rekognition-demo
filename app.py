
import boto3
from flask import Flask, render_template 

app = Flask(__name__)

def aws_boto3_client():
    client = boto3.client('rekognition')

@app.route("/")
def home():
    return render_template("image.html")



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

    