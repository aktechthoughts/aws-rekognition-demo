## This example is Using AWS Rekognition service to identify images appearing in webcam.

### How to 

* Install python3 and dependencies.
* Configure aws keys & secrect in ~/.aws directory.
* Run below command.
* Open webpage.
* Click Capture Imgae to chose image taken by webcam.
* Click Identify to check Image label.


```
$./run.sh

```

###  Dependencies.

```
python3
boto3
flask
AWS-rekognition service.
webrtc

### Identify image
```
Open http://127.0.0.1:5000/ in the browser.

```

### Find age of the person in the image
```
Open http://127.0.0.1:5000/findage in the browser.

```


